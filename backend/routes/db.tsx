if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const { MongoClient } = require('mongodb')
const Ajv = require('ajv')
const { JSONSchemaType } = require('ajv')
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')

const { router } = require('../utility.tsx')
const initializePassport = require('../passport-config.tsx')
initializePassport(
    passport, 
    async email => getUserByProperty("email", email),
    async id => getUserByProperty("_id", id)
)

router.use(flash())
router.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
router.use(passport.initialize())
router.use(passport.session())
router.use(methodOverride('_method'))
 
async function getUserByProperty(mongoProperty, value) {
    const uri = process.env.DB_URI;
    const mongoClient = await connectToCluster(uri);
    const db = mongoClient.db('data')
    const collection = db.collection('users')
    return await collection.findOne({[mongoProperty]: value})
}

async function connectToCluster(uri) {
    try {
        const mongoClient = new MongoClient(uri);
        console.log('Connecting to MongoDB Atlas cluster...');
        await mongoClient.connect();
        console.log('Successfully connected to MongoDB Atlas!');
 
        return mongoClient;
    } catch (err) {
        console.error('Connection to MongoDB Atlas failed!', err);
        process.exit();
    }
}

async function createUserDocument(userJson, collection) {
    try {
        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(userJson.password, salt)
        const newUser = { ...userJson, password: hashedPassword, games: [] }
        const emailExists = await collection.findOne({email: newUser.email})
        const userExists = emailExists !== null
        !userExists && await collection.insertOne(newUser);
        let message = ""
        if (!userExists) {
            message = "User created successfully."
        }
        else {
            if (emailExists) {
                message = "Email already exists."
            }
        }
        const result = {
            code: userExists ? 409 : 201,
            status: userExists ? 'HTTP/1.1 409 Conflict' : 'HTTP/1.1 201 Success',
            message: message,
            emailExists: emailExists !== null
        }
        return result
    } catch {
        return {
            code: 500,
            status: 'Error code 500',
            message: 'Error creating user',
        }
    }
 }

router
.route('/createUser')
.post(async (req, response) => {
    const userData = req.body
    let mongoClient
    let result
    try {
        const uri = process.env.DB_URI;
        mongoClient = await connectToCluster(uri);
        const db = mongoClient.db('data')
        const collection = db.collection('users')
        result = await createUserDocument(userData, collection)
    }
    catch(err) {
        console.log(err)
        response.status(500).send(err)
    }
    finally {
        await mongoClient.close((err, mongoDbResult) => {
            if (err) {
                response.status(500).send(err)
            }
            else {
                response.status(result.code).send(result)
            }
        });
    }
})

router
.route('/login')
.post(checkNotAuthenticated, (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err)
        }
        if (!user) {
            return res.json({
                success: false,
                message: info.message
            })
        }
        req.logIn(user, err => {
            if (err) {
                return next(err)
            }
            console.log("Log in")
            return res.json({
                success:true,
                message: "Authentication successful!"
            })
        })
    })
    (req, res, next)
})

router
.route('/logout')
.delete((req, res) => {
    req.logOut(err => {
        if (err) {
            res.status(500).send({
                message: "Error logging user out"
            })
        }
        else {
            res.status(200).send({
                message: "Logged out"
            })
        }
    })
})



function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }

    return res.json({
        success: false,
        message: "Not authenticated"
    })
}

function checkNotAuthenticated(req, res, next) {
    if (!req.isAuthenticated()) {
        return next()
    }

    return res.json({
        success:false,
        message: "Already authenticated"
    })
}

module.exports = router
   