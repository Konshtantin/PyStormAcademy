const {Router} = require('express')
const courseController = require('../controllers/courseController')
const {requireAuth, checkUser, checkConfirm} = require('../middleware/authMiddleware')

const router = Router()

router.get('/', courseController.courses_get)

router.get('/lesson/:id', requireAuth, courseController.lesson_get)

module.exports = router