const {Router} = require('express')
const indexController = require('../controllers/indexController')
const {requireAuth, checkUser, checkConfirm} = require('../middleware/authMiddleware')

const router = Router()

router.get('/', indexController.index_get)
router.get('/ide', requireAuth, indexController.ide_get)

module.exports = router