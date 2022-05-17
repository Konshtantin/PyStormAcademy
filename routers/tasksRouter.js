const {Router} = require('express')
const {requireAuth} = require('../middleware/authMiddleware')
const taskController = require('../controllers/taskController')

const router = Router()

router.get('/:taskid', requireAuth, taskController.task_get)

module.exports = router