const {Router} = require('express')
const lessonController = require('../controllers/lessonController.js')
const {requireAuth} = require('../middleware/authMiddleware')

const router = Router()

router.get('/notfound', requireAuth, lessonController.notfound_lesson_get)

router.get('/:lessonID', requireAuth, lessonController.lesson_get)

module.exports = router