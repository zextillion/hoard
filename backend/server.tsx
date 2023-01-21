const { express, cors } = require('./utility.tsx')
const igdbRouter = require('./routes/igdb.tsx')
const dbRouter = require("./routes/db.tsx")
const { config } = require('dotenv')

async function main() {
    config()
}


const app = express()
app.use(express.json())
app.use(express.text())
app.options('*', cors())
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}))
app.use('/igdb', igdbRouter)
app.use('/db', dbRouter)

main()

app.listen(process.env.PORT || 4269, () => console.log("API Server is running..."))

module.exports = express