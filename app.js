const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const cookie = require('cookie-parser')

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

mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(app.listen(PORT))
    .catch(e => console.error(e))


app.use(morgan('dev'))

app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(cookie())

app.use(express.static('public'))
app.set('views', 'views')
app.set('view engine', 'ejs')

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

