const {Router} = require('express')
const Lesson = require('../models/Lesson')
const Module = require('../models/Module')
const router = Router()
const {randomBytes} = require('crypto')


const modules = [
    {
        name: 'Условные конструкции',
        number: 2,
        id: randomBytes(3).toString('hex')
    }
    
]
async function addModule() {
    await Module.create(modules[0])
}
function rmModules() {
    Module.find()
        .then(mdls => {
            mdls.forEach(mdl => {
                Module.findByIdAndDelete(mdl._id, () => {})
            })
        })
}
const lessons = [
    {
        title: 'Вывод данных в консоль, функция print',
        filename: 'abcdef',
        module: '61bdf38537317556dac042c2',
        number: 1,
        id: randomBytes(3).toString('hex')
    }
]

async function addLesson() {
    await Lesson.create(lessons[0])
}


router.get('/addM', addModule)
// router.get('/addL', addLesson)

module.exports = router
