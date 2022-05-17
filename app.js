const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const cookie = require('cookie-parser')
const compression = require('compression')
const helmet = require('helmet')
const path = require('path')
const https = require('https')
const http = require('http')
const fs = require('fs')
const favicon = require('serve-favicon')

require('dotenv').config()

//routers
const authRouter = require('./routers/authRouter.js')
const courseRouter = require('./routers/courseRouter.js')
const lessonsRouter = require('./routers/lessonsRouter.js')
const codeRunRouter = require('./routers/codeRunRouter.js')
const indexRouter = require('./routers/indexRouter.js')
const tasksRouter = require('./routers/tasksRouter.js')
const aboutRouter = require('./routers/aboutRouter.js')

const {checkConfirm, check_SESS_ID} = require('./middleware/authMiddleware')

const app = express()

const HTTPPORT = process.env.HTTPPORT || 80
const HTTPSPORT = process.env.HTTPSPORT || 443

// enable https server 
const httpsServer = https.createServer({
    cert: fs.readFileSync(path.join(__dirname, 'private', 'cert.pem'), 'utf-8'),
    key: fs.readFileSync(path.join(__dirname, 'private', 'privkey.pem'), 'utf-8'),
    ca: fs.readFileSync(path.join(__dirname, 'private', 'chain.pem'), 'utf-8')
}, app)

const httpServer = http.createServer(app)


app.use(morgan('dev'))
app.use(compression())
app.use(helmet())


// serving favicon
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

// parsing url body, JSON, cookie
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(cookie())

// serving public files
app.use(express.static('public'))

// setting EJS view engine config
app.set('views', 'views')
app.set('view engine', 'ejs')

// adding PORT for CodeRunController
function addPort(req, res, next) {
    req.body.PORT = HTTPPORT
    next()
}

app.use(checkConfirm, check_SESS_ID)

app.use('', indexRouter)
app.use('/lesson', lessonsRouter)
app.use('/run', addPort, codeRunRouter)
app.use('/auth', authRouter)
app.use('/courses', courseRouter)
app.use('/task', tasksRouter)
app.use('/about', aboutRouter)


// MongoDB Cloud connection 
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        httpsServer.listen(HTTPSPORT, () => {
            console.log(`HTTPS server started on port ${HTTPSPORT}`)
        })
        httpServer.listen(HTTPPORT, () => {
            console.log(`HTTP server started on port ${HTTPPORT}`)
        })
    })
    .catch(e => console.error(e))

