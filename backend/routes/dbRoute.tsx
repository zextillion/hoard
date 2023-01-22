// if (process.env.NODE_ENV !== 'production') {
//     require('dotenv').config()
// }

const db = require('../db.tsx')
const mongoose = require('mongoose');
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
    async email => User.findOne({ email }),
    async id => User.findById(id)
)

router.use(flash())
router.use(session({
    store: new MongoStore({ mongooseConnection: db }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
router.use(passport.initialize())
router.use(passport.session())
router.use(methodOverride('_method'))
router.use((req, res, next) => {
    res.set('Access-Control-Allow-Origin', req.headers.origin)
    next()
})
router.use(jsonResponse)

function jsonResponse(req, res, next) {
    res.jsonResponse = (data, status = 200) => {
        res.status(status).json(data);
    }
    next();
}

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    games: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game'
    }]
});

const User = mongoose.model('User', userSchema);

async function createUserDocument(userJson) {
    try {
        const emailExists = await User.findOne({email: userJson.email});
        const userExists = emailExists !== null;
        if (!userExists) {
            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(userJson.password, salt);
            const newUser = new User({ ...userJson, password: hashedPassword, games: [] });
            await newUser.save();
        }
        let message = "";
        if (!userExists) {
            message = "User created successfully.";
        } else {
            if (emailExists) {
                message = "Email already exists.";
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

router.route('/createUser')
.post(async (req, res) => {
    const userCredentials = req.body
    try {
        const result = await createUserDocument(userCredentials);
        if(result.code === 201) {
            res.jsonResponse({
                success: true,
                message: result.message
            });
        } else {
            res.jsonResponse({
                success: false,
                message: result.message
            }, result.code);
        }
    } catch(err) {
        res.jsonResponse({
            success: false,
            message: err.message
        }, 500)
    }
});


router
.route('/login')
.post(checkNotAuthenticated, (req, res, next) => {
    try {
        const user = await passport.authenticate('local', (err, user, info) => {
            if (err) {
                return next(err)
            }
            if (!user) {
                throw new Error(info.message)
            }
            return user
        })
        (req, res, next)
        
        await req.logIn(user, (err) => {
            if (err) {
                throw err
            }
        })

        console.log("Log in")
        res.jsonResponse({
            success: true,
            message: "Authentication successful"
        })
    }
    catch(err) {
        next(err)
    }
    
        
})

router
.route('/logout')
.delete(async (req, res) => {
    try {
        await req.logOut();
        res.jsonResponse({
            success: true,
            message: "Logged out"
        })
    } catch(err) {
        res.jsonResponse({
            success: false,
            message: "Error logging user out"
        }, 500)
    }
});

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }

    res.jsonResponse({
        success: false,
        message: "Not authenticated"
    }, 500)
}

function checkNotAuthenticated(req, res, next) {
    if (!req.isAuthenticated()) {
        return next()
    }

    res.jsonResponse({
        success: false,
        message: "Already authenticated"
    }, 500)
}

module.exports = router
   