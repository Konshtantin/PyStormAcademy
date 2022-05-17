const Task = require('../models/Task')
const Lesson = require('../models/Lesson')


function task_get(req, res) {
    Task.findOne({id: req.params.taskid})
        .then(task => {
            Lesson.findById(task.lesson)
                .then(lesson => {
                    res.render('./course/taskLayout', {task, lesson})
                })
        })
}

module.exports = {
    task_get
}