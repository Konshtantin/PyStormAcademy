const jwt = require('jsonwebtoken')
const User = require('../models/User')

require('dotenv').config()

function createSESSToken(id) {
    return jwt.sign({id}, process.env.SESSION_KEY, {expiresIn: '30d'})
}
// function createCONFToken(id) {
//     return jwt.sign({id}, process.env.CONFIRM_KEY, {expiresIn: '30d'})
// }
// function createNLToken(id) {
//     return jwt.sign({id}, process.env.NOTLOGIN_KEY, {expiresIn: '30d'})
// }

function requireAuth(req, res, next) {
    if(req.body.checked) {
        next()
        return
    }

    const token = req.cookies.SESS_ID

    if(token) {
        jwt.verify(token, process.env.SESSION_KEY, (err, decodedToken) => {
            if(err) {
                res.clearCookie('SESS_ID')
                res.redirect('/auth/login')
                return
            }
            next()
        })
    } else {
        res.redirect('/auth/login')
    }
}

function checkUser(req, res, next) {
    const token = req.cookies.SESS_ID

    if(token) {
        jwt.verify(token, process.env.SESSION_KEY, (err, decodedToken) => {
            if(err) {
                req.body.user = null
                next()
            } else {
                User.findById(decodedToken.id)
                    .then(user => {
                        req.body.user = user
                        next()
                    })
            }
        })
    } else {
        req.body.user = null
        next()
    }
}

function checkConfirm(req, res, next) {
    const token = req.cookies.CONF_ID

    if(!token) {
        next()
        return
    }

    jwt.verify(token, process.env.CONFIRM_KEY, async (err, decodedToken) => {
        if(err) {
            res.clearCookie('CONF_ID')
            res.redirect('/auth/login')
            return
        }
        const user = await User.findById(decodedToken.id)
        if(user.email_confirmed) {
            res.clearCookie('CONF_ID')
            const token = createSESSToken(user._id)
            res.cookie('SESS_ID', token, {httpOnly: true, maxAge: 1000*60*60*24*30})
            req.body.checked = true
            next()
        } else {
            next()
        }
    })
}

function checkNotLogin(req, res, next) {
    const token = req.cookies.NL_ID

    if(!token) {
        next()
        return
    }

    jwt.verify(token, process.env.NOTLOGIN_KEY, async (err, decodedToken) => {
        if(err) {
            res.clearCookie('NL_ID')
            res.redirect('/auth/login')
            return
        }
        if(req.cookies.SESS_ID || req.body.checked) {
            res.clearCookie('NL_ID')
            next()
            return
        }
        next()
    })
}

module.exports = {
    requireAuth,
    checkUser,
    checkConfirm,
    checkNotLogin
}