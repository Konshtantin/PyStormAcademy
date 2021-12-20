const {Router} = require('express')
const codeRunController = require('../controllers/codeRunController')
const router = Router()

router.post('/cpid', codeRunController.cpid_post)

router.post('/', codeRunController.code_run_post)

module.exports = router