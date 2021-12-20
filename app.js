const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const cookie = require('cookie-parser')
const compression = require('compression')
const path = require('path')
const helmet = require('helmet')
const favicon = require('serve-favicon')

require('dotenv').config()

//routers
const authRouter = require('./routers/authRouter.js')
const courseRouter = require('./routers/courseRouter.js')
const codeRunRouter = require('./routers/codeRunRouter.js')
const indexRouter = require('./routers/indexRouter.js')

const courseFilling = require('./routers/courseFilling.js')

const {checkConfirm, checkNotLogin} = require('./middleware/authMiddleware')

const app = express()

const PORT = process.env.PORT || 3000

// MongoDB Cloud connection 
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(app.listen(PORT))
    .catch(e => console.error(e))


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
    req.body.PORT = PORT
    next()
}

app.use(checkConfirm, checkNotLogin)

app.use('', indexRouter)
app.use('/run', addPort, codeRunRouter)
app.use('/auth', authRouter)
app.use('/courses', courseRouter)
app.use('/fill', courseFilling)

