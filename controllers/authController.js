const {validationResult} = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {sendConfirm, sendChange} = require('../middleware/emailMiddleware')
// models
const User = require('../models/User')
const Link = require('../models/Link')

require('dotenv').config()

function createSESSToken(id) {
    return jwt.sign({id}, process.env.SESSION_KEY, {expiresIn: '30d'})
}
function createCONFToken(id) {
    return jwt.sign({id}, process.env.CONFIRM_KEY, {expiresIn: '30d'})
}
function createNLToken(id) {
    return jwt.sign({id}, process.env.NOTLOGIN_KEY, {expiresIn: '30d'})
}
function createCPToken(id) {
    return jwt.sign({id}, process.env.CHANGE_KEY, {expiresIn: '30d'})
}


function sign_up_get(req, res) {
    res.render('./auth/sign-up')
}

async function sign_up_post(req, res) {
    const {name, surname, email, password} = req.body
    const errors = validationResult(req)
    const existUser = await User.findOne({email})
    if(existUser) {
        errors.errors.push({param: 'email', msg: 'Пользователь с этой электронной почтой уже существует'})
    }
    if(!errors.isEmpty()) {
        const messages = {name: '', surname: '', email: '', password: '', repeat: ''}
        errors.errors.forEach(err => {
            messages[err.param] = err.msg
        })
        res.json({errors: messages})
        return
    }
    const hash = await bcrypt.hash(password, 10)
    const user = await User.create({name, surname, email, email_confirmed: false, password: hash, last_email_send: Date.now()})
    const link = await Link.create({user: user._id, created: Date.now(), type: 'confirm'})
    const emailStatus = await sendConfirm(email, `http://pystorm.xyz/auth/confirm/${link._id}`)
    if(emailStatus == 'Error') {
        User.findByIdAndDelete(user._id, async () => {
            await Link.findByIdAndDelete(link._id)
            res.json({emailError: 'Произошла ошибка, пожалуйста попробуйте зарегистрироваться через 30 минут.'})
        })
        return
    } else {
        const token = createCONFToken(user._id)
        res.cookie('CONF_ID', token, {httpOnly: true, maxAge: 1000*60*60*24*30})
        res.json({status: 200})
    }
}

function login_get(req, res) {
    res.render('./auth/login')
}

async function login_post(req, res) {
    const {email, password} = req.body

    const user = await User.findOne({email})

    if(!user) {
        res.json({error: 'Неверна электронная почта или(и) пароль'})
        return
    }
    const auth = await bcrypt.compare(password, user.password)

    if(!auth) {
        res.json({error: 'Неверна электронная почта или(и) пароль'})
        return
    }
    if(!user.email_confirmed) {
        const token = createCONFToken(user._id)
        res.cookie('CONF_ID', token, {httpOnly: true, maxAge: 1000*60*60*24*30})
        res.json({confirmError: 'needConfirm'})
        return
    } else {
        const token = createSESSToken(user._id)
        res.cookie('SESS_ID', token, {httpOnly: true, maxAge: 1000*60*60*24*30})
        res.json({status: 200})
    }
}

async function confirm_get(req, res) {
    if(req.params.linkid.length !== 24) {
        res.render('./auth/confirmed', {confirmError: 'Ссылка не действительна или срок её действия закончился'})
        return
    }
    const link = await Link.findById(req.params.linkid)
    if(!link || link.type !== 'confirm') {
        res.render('./auth/confirmed', {confirmError: 'Ссылка не действительна или срок её действия закончился'})
        return
    }
    const user = await User.findById(link.user)
    user.email_confirmed = true
    Link.findByIdAndDelete(link._id, () => {
        User.findByIdAndUpdate(user._id, user, (err, user) => {
            if(err) {
                console.log(err)
                return
            }
            res.render('./auth/confirmed', {email: user.email, confirmError: null})
        })
    })
    
}

function needconfirm_get_sign(req, res) {
    const token = req.cookies.CONF_ID
    if(token) {
        jwt.verify(token, process.env.CONFIRM_KEY, async (err, decodedToken) => {
            if(err) {
                res.clearCookie('CONF_ID')
                res.redirect('/')
            } else {
                const user = await User.findById(decodedToken.id)
                if(!user) {
                    res.clearCookie('CONF_ID')
                    res.redirect('/')
                    return
                }
                const time = 180 - Math.trunc((Date.now() - user.last_email_send)/1000)
                if(time <= 1) {
                    breakTime = ''
                } else {
                    breakTime = `${(time-(time%60))/60}:${time%60}`
                    if(breakTime.split(':')[0].length === 1) {
                        breakTime = `0${breakTime}`
                    }
                    if(breakTime.split(':')[1].length === 1) {
                        breakTime = `${breakTime.split(':')[0]}:0${breakTime.split(':')[1]}`
                    }
                }
                res.render('./auth/needConfirm', {template: 'sign-up', email: user.email, breakTime})
            }
        })
    } else {
        res.redirect('/')
    }
    
}

function needconfirm_get_login(req, res) {
    const token = req.cookies.CONF_ID
    if(token) {
        jwt.verify(token, process.env.CONFIRM_KEY, async (err, decodedToken) => {
            if(err) {
                res.clearCookie('CONF_ID')
                res.redirect('/')
            } else {
                const user = await User.findById(decodedToken.id)
                if(!user) {
                    res.clearCookie('CONF_ID')
                    res.redirect('/')
                    return
                }
                const time = 180 - Math.trunc((Date.now() - user.last_email_send)/1000)
                if(time <= 1) {
                    breakTime = ''
                } else {
                    breakTime = `${(time-(time%60))/60}:${time%60}`
                    if(breakTime.split(':')[0].length === 1) {
                        breakTime = `0${breakTime}`
                    }
                    if(breakTime.split(':')[1].length === 1) {
                        breakTime = `${breakTime.split(':')[0]}:0${breakTime.split(':')[1]}`
                    }
                }
                res.render('./auth/needConfirm', {template: 'login', email: user.email, breakTime})
            }
        })
    } else {
        res.redirect('/')
    }
    
}

function needConfirm_get_change(req, res) {
    const token = req.cookies.NL_ID

    if(token) {
        jwt.verify(token, process.env.NOTLOGIN_KEY, async (err, decodedToken) => {
            if(err) {
                res.clearCookie('NL_ID')
                res.redirect('/')
            } else {
                const user = await User.findById(decodedToken.id)
                if(!user) {
                    res.clearCookie('NL_ID')
                    res.redirect('/')
                    return
                }
                const time = 180 - Math.trunc((Date.now() - user.last_email_send)/1000)
                if(time <= 1) {
                    breakTime = ''
                } else {
                    breakTime = `${(time-(time%60))/60}:${time%60}`
                    if(breakTime.split(':')[0].length === 1) {
                        breakTime = `0${breakTime}`
                    }
                    if(breakTime.split(':')[1].length === 1) {
                        breakTime = `${breakTime.split(':')[0]}:0${breakTime.split(':')[1]}`
                    }
                }
                res.render('./auth/needConfirm', {template: 'change', email: user.email, breakTime})
            }
        })
    } else {
        res.redirect('/')
    }
}

function resend_email_post(req, res) {
    const token = req.cookies.CONF_ID
    
    if(token) {
        jwt.verify(token, process.env.CONFIRM_KEY, async (err, decodedToken) => {
            if(err) {
                res.clearCookie('CONF_ID')
                res.redirect('/')
            } else {
                const user = await User.findById(decodedToken.id)
                const time = 180 - Math.trunc((Date.now() - user.last_email_send)/1000)
                if(time <= 1) {
                    const link = await Link.findOne({user: user._id})
                    const emailStatus = await sendConfirm(user.email, `http://pystorm.xyz/auth/confirm/${link._id}`)
                    user.total_emails = user.total_emails + 1
                    User.findByIdAndUpdate(user._id, user, () => {
                        if(emailStatus == 'Error') {
                            res.json({sendError: 'Произошла ошибка отправки почты, пожалуйста, попробуйте позже!'})
                        } else {
                            user.last_email_send = Date.now()
                            User.findByIdAndUpdate(user._id, user, (err, user) => {
                                res.json({status: 'Письмо отправлено повторно'})
                            })
                        }
                    })
                } else {
                    res.json({timeError: 'Мы слишком часто отпраляем почту на ваш электронный адрес'})
                }
            }
        })
    } else {
        const token =  req.cookies.NL_ID

        if(token) {
            jwt.verify(token, process.env.NOTLOGIN_KEY, async (err, decodedToken) => {
                if(err) {
                    res.clearCookie('NL_ID')
                    res.redirect('/')
                } else {
                    const user = await User.findById(decodedToken.id)
                    const time = 180 - Math.trunc((Date.now() - user.last_email_send)/1000)
                    if(time <= 1) {
                        const link = await Link.findOne({user: user._id})
                        const emailStatus = await sendConfirm(user.email, `http://pystorm.xyz/auth/confirm/${link._id}`)
                        user.total_emails = user.total_emails + 1
                        User.findByIdAndUpdate(user._id, user, () => {
                            if(emailStatus == 'Error') {
                                res.json({sendError: 'Произошла ошибка отправки почты, пожалуйста, попробуйте позже!'})
                            } else {
                                user.last_email_send = Date.now()
                                User.findByIdAndUpdate(user._id, user, (err, user) => {
                                    res.json({status: 'Письмо отправлено повторно'})
                                })
                            }
                        })
                    } else {
                        res.json({timeError: 'Мы слишком часто отпраляем почту на ваш электронный адрес'})
                    }
                }
            })
        } else {
            res.redirect('/')
        }
    }
}

function change_password_get_email(req, res) {
    res.render('./auth/changeEmail')
}

async function change_password_post_email(req, res) {
    const {email} = req.body

    const errors = validationResult(req)

    if(!errors.isEmpty()) {
        res.json({emailError: 'Электронная почта не корректна'})
        return
    }
    const user = await User.findOne({email})
    if(!user) {
        res.json({emailError: 'Не существует пользователя с этой электронной почтой'})
        return
    }
    if(!user.email_confirmed) {
        const token = createNLToken(user._id)
        res.cookie('NL_ID', token, {httpOnly: true, maxAge: 1000*60*60*24*30})
        res.json({confirmError: 'Чтобы сбросить пароль нужно подтвердить электронную почту'})
        return
    }
    const time = 180 - Math.trunc((Date.now() - user.last_email_send)/1000)
    if(time > 1) {
        res.json({sendError: 'Пожалуйста, попробуйте сбросить пароль позже'})
        return
    }
    let link = await Link.findOne({user: user._id, type: 'change'})
    if(!link) {
        link = await Link.create({user: user._id, created: Date.now(), type: 'change'})
    }
    const emailStatus = await sendChange(email, user.name, `http://pystorm.xyz/auth/change/${link._id}`)
    user.total_emails = user.total_emails + 1
    User.findByIdAndUpdate(user._id, user, () => {
        if(emailStatus === 'Error') {
            res.json({sendError: 'Пожалуйста, попробуйте сбросить пароль позже'})
            return
        }
        user.last_email_send = Date.now()
        User.findByIdAndUpdate(user._id, user, () => {
            res.json({status: `Письмо с инструкциями для сброса пароля отправлено на электронный адрес <span class="u-email">${email}</span>. Если письмо не пришло, проверьте спам.`})
        })
    })
}

async function change_password_get(req, res) {
    if(req.params.linkid.length !== 24) {
        res.render('./auth/change', {changeError: 'Ссылка не действительна или срок её действия закончился'})
        return
    }
    const link = await Link.findById(req.params.linkid)

    if(!link || link.type !== 'change') {
        res.render('./auth/change', {changeError: 'Ссылка не действительна или срок её действия закончился'})
        return
    } else if((Date.now() - link.created)/(1000*60*60) > 3) {
        Link.findByIdAndDelete(link._id, () => {
            res.render('./auth/change', {changeError: 'Ссылка не действительна или срок её действия закончился'})
        })
        return
    }
    res.render('./auth/change')
}

async function change_password_post(req, res) {
    const {password} = req.body

    const errors = validationResult(req)

    const link = await Link.findById(req.params.linkid)
    if(!link || link.type !== 'change') {
        res.json({linkError: 'Произошла ошибка при изменении пароля'})
        return
    } else if((Date.now() - link.created)/(1000*60*60) > 3) {
        Link.findByIdAndDelete(link._id, () => {
            res.json({linkError: 'Cрок действия ссылки закончился'})
        })
        return
    }
    if(!errors.isEmpty()) {
        const messages = {password: '', repeat: ''}
        errors.errors.forEach(err => {
            messages[err.param] = err.msg
        })
        res.json({errors: messages})
        return
    }
    const user = await User.findById(link.user)
    const current = await bcrypt.compare(password, user.password)
    if(current) {
        res.json({passError:'Нельзя изменить пароль на недавно используемый'})
        return
    }
    if(user.previous_password) {
        const previous = await bcrypt.compare(password, user.previous_password)
        if(previous) {
            res.json({passError: 'Нельзя изменить пароль на недавно используемый'})
            return
        }
    }
  
    const hash = await bcrypt.hash(password, 10)
    console.log(user)
    console.log('-------------------------')
    user.previous_password = user.password
    user.password = hash
    console.log(user)
    User.findByIdAndUpdate(link.user, user, () => {
        Link.findByIdAndDelete(link._id, () => {
            res.json({status: 'Пароль успешно изменен'})
        })
    })
}

module.exports = {
    sign_up_get,
    sign_up_post,
    login_get,
    login_post,
    confirm_get,
    needconfirm_get_sign,
    needconfirm_get_login,
    needConfirm_get_change,
    resend_email_post,
    change_password_get_email,
    change_password_post_email,
    change_password_get,
    change_password_post
}