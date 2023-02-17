// if (process.env.NODE_ENV !== 'production') {
//     require('dotenv').config()
// }

require('dotenv').config()

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

mongoose.set('strictQuery', false)
mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("Connected to MongoDB!")
});

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
initializePassport(
    passport, 
    async email => User.findOne({ email })
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


router.route('/login')
.post(checkNotAuthenticated, async (req, res, next) => {
    try {
        await passport.authenticate('local', { session: false }, async (err, user, info) => {
            if (err) {
                return next(err)
            }
            if (!user) {
                return res.jsonResponse({
                    success: false,
                    message: info.message
                })
            }
            
            await req.logIn(user, (err) => {
                if (err) {
                    return res.jsonResponse({
                        success: false,
                        message: info.message
                    })
                }
            })

            res.cookie('sessionId', req.user, { secure: true, signed: true, expires: new Date(new Date().setMonth(new Date().getMonth() + 1)) }) // Expires in one month
            res.jsonResponse({
                success: true,
                message: "Authentication successful"
            })
        })
        (req, res, next)
    }
    catch(err) {
        res.jsonResponse({
            success: false,
            message: err
        })
        next(err)
    }
})

router.route('/logout')
.delete(async (req, res) => {
    console.log("Try to logout")
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
   