const {Router} = require('express')
const courseController = require('../controllers/courseController')

const router = Router()

router.get('/', courseController.courses_get)

router.get('/:moduleID', courseController.module_get)

module.exports = router
