const {Router} = require('express')
const authController = require('../controllers/authController')
const {body} = require('express-validator')

const router = Router()

router.get('/sign-up', authController.sign_up_get)

router.post('/sign-up', 
    body('name').isLength({min: 3, max: 24}).withMessage('Имя пользователя должно быть длиной от 3 до 24 символов').custom(value => new RegExp(/^[a-zA-Zа-яА-ЯёЁ-]+$/).test(value)).withMessage('Имя пользователя может содержать только русские, латинские буквы и тире').custom(value => {
        const lvalue = value.toLowerCase()
        const noWorlds = ['бля', 'eб', 'ёб', 'ганд', 'пид', 'пизд', 'хуй', 'хуе', 'хуи', 'сук', 'fuck', 'shit', 'eb', 'blya', 'gand', 'pid', 'pizd']
        for(const word of noWorlds) {
            if(lvalue.includes(word)) {
                return false
            }
        }
        return true
    }).withMessage('Использование нецензурных слов недопустимо'),
    body('surname').isLength({min: 3, max: 24}).withMessage('Фамилия пользователя должна быть длиной от 3 до 24 символов').custom(value => new RegExp(/^[a-zA-Zа-яА-ЯёЁ-]+$/).test(value)).withMessage('Фамилия пользователя может содержать только русские, латинские буквы и тире').custom(value => {
        const lvalue = value.toLowerCase()
        const noWorlds = ['бля', 'eб', 'ёб', 'ганд', 'пид', 'пизд', 'хуй', 'хуе', 'хуи', 'сук', 'fuck', 'shit', 'eb', 'blya', 'gand', 'pid', 'pizd']
        for(const word of noWorlds) {
            if(lvalue.includes(word)) {
                return false
            }
        }
        return true
    }).withMessage('Использование нецензурных слов недопустимо'),
    body('email').trim().isEmail().withMessage('Электронная почта не корректна'),
    body('password').isLength({min: 8, max: 36}).withMessage('Пароль должен быть длиной от 8 до 36 символов').custom(value => new RegExp(/^[\wа-яА-ЯёЁ\Q#$%|&\E]+$/).test(value)).withMessage('Пароль может содержать только русские или латинские буквы, цифры, специальные символы #, $, %, &, |'),
    body('repeat').custom((value, {req}) => value === req.body.password).withMessage('Пароли не совпадают'),
authController.sign_up_post)

router.get('/login', authController.login_get)

router.post('/login', authController.login_post)

router.get('/confirm/:linkid', authController.confirm_get)

router.get('/needconfirm', authController.needconfirm_get_sign)

router.get('/login/needconfirm', authController.needconfirm_get_login)

router.post('/resend', authController.resend_email_post)

router.get('/change', authController.change_password_get_email)

router.get('/change/needconfirm', authController.needConfirm_get_change)

router.get('/change/:linkid', authController.change_password_get)

router.post('/change/:linkid',
    body('password').isLength({min: 8, max: 36}).withMessage('Пароль должен быть длиной от 8 до 36 символов').custom(value => new RegExp(/^[\wа-яА-ЯёЁ\Q#$%|&\E]+$/).test(value)).withMessage('Пароль может содержать только русские или латинские буквы, цифры, специальные символы #, $, %, &, |'),
    body('repeat').custom((value, {req}) => value === req.body.password).withMessage('Пароли не совпадают'),
authController.change_password_post)

router.post('/change', 
    body('email').isEmail().withMessage('Электронная почта не корректна'),
authController.change_password_post_email)



module.exports = router