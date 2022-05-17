const jwt = require('jsonwebtoken')
const User = require('../models/User')

require('dotenv').config()

function createSESSToken(id) {
    return jwt.sign({id}, process.env.SESSION_KEY, {expiresIn: '30d'})
}
// function createCONFToken(id) {
//     return jwt.sign({id}, process.env.CONFIRM_KEY, {expiresIn: '30d'})
// }

function requireAuth(req, res, next) {
    console.time('requireAuth')
    if(req.body.SESS_ID_OK) {
        console.timeEnd('requireAuth')
        next()
        return
    } else {
        console.timeEnd('requireAuth')
        res.redirect('/auth/login')
    }
}

function checkConfirm(req, res, next) {
    console.time('checkConfirm')
    const token = req.cookies.CONF_ID

    if(!token) {
        console.timeEnd('checkConfirm')
        next()
        return
    }

    jwt.verify(token, process.env.CONFIRM_KEY, async (err, decodedToken) => {
        if(err) {
            res.clearCookie('CONF_ID')
            res.redirect('/auth/login')
            console.timeEnd('checkConfirm')
            return
        }
        const user = await User.findById(decodedToken.id)
        if(user.email_confirmed) {
            res.clearCookie('CONF_ID')
            const token = createSESSToken(user._id)
            res.cookie('SESS_ID', token, {httpOnly: true, maxAge: 1000*60*60*24*30})
            req.body.SESS_ID_OK = true
			res.locals.user = user
            console.timeEnd('checkConfirm')
            next()
        } else {
            console.timeEnd('checkConfirm')
            next()
        }
    })
}

function check_SESS_ID(req, res, next) {
    console.time('check_SESS_ID')
	if(req.body.SESS_ID_OK) {
        next()
        return
    }

    const token = req.cookies.SESS_ID

    if(!token){
        console.timeEnd('check_SESS_ID')
        res.locals.user = null
        next()
        return
    }
    console.time('check_SESS_ID verifying')
    jwt.verify(token, process.env.SESSION_KEY, async (err, decodedToken) => {
        console.timeEnd('check_SESS_ID verifying')
        if(err) {
            res.clearCookie('SESS_ID')
            res.redirect('/auth/login')
            console.timeEnd('check_SESS_ID')
            return
        }
        console.time('check_SESS_ID getting user')
        const user = await User.findById(decodedToken.id)
        console.timeEnd('check_SESS_ID getting user')
        if(!user){
            res.clearCookie('SESS_ID')
            res.redirect('/auth/login')
            console.timeEnd('check_SESS_ID')
        } else {
            req.body.SESS_ID_OK = true
            res.locals.user = user
            console.timeEnd('check_SESS_ID')
            next()
        }
    }) 
}
module.exports = {
    requireAuth,
    checkConfirm,
    check_SESS_ID
}