const Module = require('../models/Module')
const Lesson = require('../models/Lesson')
const Task = require('../models/Task')

function courses_get(req, res) {
    let LOM = req.cookies.LOM

    if(isNaN(LOM) || LOM < 1 || LOM > 4){
        LOM = 1
    }
    
    Module.find()
        .sort({number: 1})
        .then(mdls => {
            const lessonModule = mdls.find(mdl => mdl.number == LOM)
            Lesson.find({module: lessonModule._id})
                .sort({number: 1})
                .then(async (lessons) => {
                    if(res.locals.user) {
                        console.time('module_get > Module.find > Lesson.find > Prepare stats')
                        const lessonsCount = lessons.length
                        const lessonsIDS = lessons.map(lsn => lsn._id.toString())
                        const lessonsComplited = res.locals.user.complited_lessons.filter(lsn => lessonsIDS.includes(lsn.lesson.toString())).length
                        const tasks = await Task.find({module_number: lessonModule.number})
                        const tasksCount = tasks.length
                        const tasksIDS = tasks.map(tsk => tsk._id.toString())
                        const tasksComplited = res.locals.user.complited_tasks.filter(tsk => tasksIDS.includes(tsk.task.toString())).length
                        console.timeEnd('module_get > Module.find > Lesson.find > Prepare stats')
                        res.render('./course/courses', {modules: mdls, lessons, moduleName: lessonModule.name, lc: lessonsCount, lcp: lessonsComplited, tc: tasksCount, tcp: tasksComplited})
                        return
                    } else {
                        const tasks = await Task.find({module_number: lessonModule.number})
                        const tasksCount = tasks.length
                        res.render('./course/courses', {modules: mdls, lessons, moduleName: lessonModule.name, lc: lessons.length, tc: tasksCount})
                    }
                })
        })
}

function module_get(req, res) {
    console.time('module_get > Module.find')
    Module.find()
        .sort({number: 1})
        .then(mdls => {
            console.timeEnd('module_get > Module.find')
            console.time('module_get > Module.find > Lesson.find')
            const lessonModule = mdls.find(mdl => mdl.id == req.params.moduleID)
            if(!lessonModule) {
                res.redirect('/courses')
                return
            }
            Lesson.find({module: lessonModule._id})
                .sort({number: 1})
                .then(async (lessons) => {
                    console.timeEnd('module_get > Module.find > Lesson.find')
                    res.cookie('LOM', lessonModule.number, {httpOnly: true, maxAge: 1000*60*60*24*30}) // LastOpenedModule

                    if(res.locals.user) {
                        console.time('module_get > Module.find > Lesson.find > Prepare stats')
                        const lessonsCount = lessons.length
                        const lessonsIDS = lessons.map(lsn => lsn._id.toString())
                        const lessonsComplited = res.locals.user.complited_lessons.filter(lsn => lessonsIDS.includes(lsn.lesson.toString())).length
                        const tasks = await Task.find({module_number: lessonModule.number})
                        const tasksCount = tasks.length
                        const tasksIDS = tasks.map(tsk => tsk._id.toString())
                        const tasksComplited = res.locals.user.complited_tasks.filter(tsk => tasksIDS.includes(tsk.task.toString())).length
                        console.timeEnd('module_get > Module.find > Lesson.find > Prepare stats')
                        res.render('./course/courses', {modules: mdls, lessons, moduleName: lessonModule.name, lc: lessonsCount, lcp: lessonsComplited, tc: tasksCount, tcp: tasksComplited})
                        return
                    } else {
                        const tasks = await Task.find({module_number: lessonModule.number})
                        const tasksCount = tasks.length
                        res.render('./course/courses', {modules: mdls, lessons, moduleName: lessonModule.name, lc: lessons.length, tc: tasksCount})
                    }

                    
                })
            
        })
}

module.exports = {
    courses_get,
    module_get
}