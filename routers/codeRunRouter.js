const {Router} = require('express')
const codeRunController = require('../controllers/codeRunController')
const {requireAuth} = require('../middleware/authMiddleware')
const router = Router()

router.post('/cpid', codeRunController.cpid_post)

router.post('/', requireAuth, codeRunController.code_run_post)

router.post('/check', requireAuth, codeRunController.code_check_post)

module.exports = router