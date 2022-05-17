const Module = require('../models/Module')
const Lesson = require('../models/Lesson')
const Task = require('../models/Task')

function lesson_get(req, res) {

    console.time('lesson_get > Lesson.find')

    Lesson.find({id: req.params.lessonID})
        .then(lesson => {

            lesson = lesson[0]
            if(!lesson) {
                res.redirect('/lesson/notfound')
                return
            }

            console.timeEnd('lesson_get > Lesson.find')
            console.time('lesson_get > Lesson.find > Module and Tasks')

            Promise.all([
                Module.findById(lesson.module),
                Task.find({lesson: (lesson._id).toString()})
            ])
                .then(responses => {
                    
                    console.timeEnd('lesson_get > Lesson.find > Module and Tasks')

                    res.render('./course/lessonLayout', {lesson: lesson, lesson_module: responses[0], tasks: responses[1]}) // lesson - объект урока; number - номер модуля, в который входит урок; tasks - массив объектов заданий текущего урока
                })
        })    
}

function notfound_lesson_get(req, res) {
    res.render('./course/lesson404.ejs')
}
module.exports = {
    lesson_get,
    notfound_lesson_get
}