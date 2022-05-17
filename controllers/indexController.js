const jwt = require('jsonwebtoken')

require('dotenv').config()

function index_get(req, res) { // главная страница, когда пользователь ещё не зарегистрирован
    // const token = req.cookies.SESS_ID
    // if(token) {
    //     jwt.verify(token, process.env.SESSION_KEY, async (err, decodedToken) => {
    //         if(err) {
    //             res.clearCookie('SESS_ID')
    //             res.redirect('/')
    //         } else {
    //             res.redirect('/main')
    //         }
    //     })
    // } else {
        res.render('index')
    // }
    
}

function main_get(req, res) { // главная страница, когда пользователь зарегистрирован, уже включает некоторую статистику
    res.redirect('/')
    // res.render('main')
}
module.exports = {
    index_get,
    main_get
}