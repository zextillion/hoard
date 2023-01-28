const { express, cors } = require('./utility.tsx')
const igdbRouter = require('./routes/igdb.tsx')
const dbRouter = require("./routes/dbRoute.tsx")
const { config } = require('dotenv')
const cookieParser = require('cookie-parser')

async function main() {
    config()
}

const app = express()
app.use(cookieParser("super-secret-key"))
app.use(express.json())
app.use(express.text())
app.use(cors({
    origin: ["https://hoard.fyi", "https://hoard.onrender.com"],
    methods: 'GET,PUT,POST,DELETE',
    credentials: true,
}))
app.use('/igdb', igdbRouter)
app.use('/db', dbRouter)

main()

app.listen(process.env.PORT || 4269, () => console.log("API Server is running..."))

module.exports = app