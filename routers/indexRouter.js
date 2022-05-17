const {Router} = require('express')
const indexController = require('../controllers/indexController')
const {requireAuth} = require('../middleware/authMiddleware')

const router = Router()

router.get('/', indexController.index_get)

router.get('/main', requireAuth, indexController.main_get)

module.exports = router