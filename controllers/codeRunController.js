const {makeCodeZone, appendPid} = require('../coderun/codeRun')
const {desinfectCode} = require('../middleware/codeDesinfection')
const Task = require('../models/Task')
const User = require('../models/User')

async function code_run_post(req, res) {
    const PORT = req.body.PORT
    const desinfectionResult = await desinfectCode(req.body.code)
    if(desinfectionResult) {
        res.json({derror: desinfectionResult})
        return
    }
    const args = req.body.args

    // arg_count = q7FoyXesQ5
    // argList = kxrOErK6AK
    // submit_pid = NN2E61KS1i

    const code = `import os \nimport requests \nimport sys \nq7FoyXesQ5 = 0 \nkxrOErK6AK = sys.argv[1:] \ndef input(*args): \n    global q7FoyXesQ5 \n    arg = kxrOErK6AK[q7FoyXesQ5] \n    q7FoyXesQ5 += 1 \n    return arg \ndef userProgram(): \n${req.body.code.split('\n').map(item => '    ' + item).join('\n')} \n\ndef NN2E61KS1i(): \n    obj = {'cpid': [os.path.basename(sys.argv[0])[:-3], os.getpid()]} \n    response = requests.post('http://localhost:${PORT}/run/cpid', data = obj) \n    if(response.status_code == 200): \n        userProgram() \n\nNN2E61KS1i()`
    const result = await makeCodeZone(code, args, './coderun')
    res.json({result})
}

function cpid_post(req, res) {
    const pidStatus = appendPid(req.body.cpid[0], req.body.cpid[1])
    if(pidStatus === 1) {
        res.status(200)
    }
    res.send()
}

function allIncluded(code, include_code) {
    let code_to_check = code

    for(let pattern of include_code) {
        if(code_to_check.includes(pattern)) {
            let item = code_to_check.split(pattern)
            if(item.length === 1) {
                code_to_check = item[0]
            } else {
                code_to_check = item.slice(1).join(pattern)
            }
        } else {
            return false
        }
    }
    return true
}
async function code_check_post(req, res) {

    if(!req.body.code) {
        res.json({result: '', emptyCode: true})
        return
    }

    if(req.body.path.split('/')[1] != 'task') {
        res.json({pathError: 'Incorrect path'})
        return
    }
    const tasks = await Task.find().populate('lesson')
    const task = tasks.find(tsk => tsk.id == req.body.path.split('/')[2])

    if(!task) {
        res.json({pathError: 'Incorrect path'})
        return
    }

    const PORT = req.body.PORT
    const desinfectionResult = await desinfectCode(req.body.code)

    if(desinfectionResult) {
        res.json({derror: desinfectionResult})
        return
    }

    const args = req.body.args

    // arg_count = q7FoyXesQ5
    // argList = kxrOErK6AK
    // submit_pid = NN2E61KS1i
    if(task.add_code_after) {
        req.body.code = req.body.code + '\n' + task.add_code_after.split('|').join('\n')
    }
    if(task.add_code_before) {
        req.body.code = task.add_code_before.split('|').join('\n') + '\n' + req.body.code
    }

    const code = `import os \nimport requests \nimport sys \nq7FoyXesQ5 = 0 \nkxrOErK6AK = sys.argv[1:] \ndef input(*args): \n    global q7FoyXesQ5 \n    arg = kxrOErK6AK[q7FoyXesQ5] \n    q7FoyXesQ5 += 1 \n    return arg \ndef userProgram(): \n${req.body.code.split('\n').map(item => '    ' + item).join('\n')} \n\ndef NN2E61KS1i(): \n    obj = {'cpid': [os.path.basename(sys.argv[0])[:-3], os.getpid()]} \n    response = requests.post('http://localhost:${PORT}/run/cpid', data = obj) \n    if(response.status_code == 200): \n        userProgram() \n\nNN2E61KS1i()`
    
    const user = res.locals.user

    const result = await makeCodeZone(code, args, './coderun')

    if(result.error) {
        res.json(result)
        return
    }
    let shortedResult 

    const splitedResult = result.split('\n') // сплитим по переносу, чтоб убрать лишний перенос для проверки

    if(splitedResult[splitedResult.length - 1] == '') {
        shortedResult = splitedResult.slice(0, -1).join('\n')
    } else {
        shortedResult = result  
    }
    if(task.answer.split('\\n').toString() == shortedResult.split('\n').toString() || task.answer == '*') {
		// проверка на требуемый формат
		if(task.include_code) {
            if (!allIncluded(req.body.code, task.include_code.split('|'))) {
                res.json({formatError: 'Ответ правильный, но код не соответствует требуемому формату!'})
                return
            }
        }
        
        const taskIndex = user.complited_tasks.findIndex(item => item.task.toString() === task._id.toString())
        if(taskIndex === -1) {
            user.complited_tasks.push({
                task: task._id.toString(),
                completion_code: req.body.code,
                completion_date: req.body.date
            })
			const currentLessonTasksIDS = tasks.filter(tsk => tsk.lesson.toString() === task.lesson.toString()).map(tsk => tsk._id.toString())
            const userTasks = user.complited_tasks.filter(tsk => currentLessonTasksIDS.includes(tsk.task.toString()))
            if(currentLessonTasksIDS.length === userTasks.length) {
                user.complited_lessons.push({
                    lesson: task.lesson,
                    completion_date: req.body.date
                })
                await User.findByIdAndUpdate(user._id, user)
                res.json({result, check_result: true, notifications: {task: 'Задание выполнено!', lesson: task.lesson.title}})
                return
            }
            await User.findByIdAndUpdate(user._id, user)
			res.json({result, check_result: true, notifications: {task: 'Задание выполнено!'}})
            return
        }
        res.json({result, check_result: true, notifications: {task: 'Задание выполнено!'}})
        return
    }
    res.json({result, check_result: false, notifications: {task: 'Твой код вывел неверный ответ!'}})
}

module.exports =  {
    code_run_post,
    cpid_post,
    code_check_post
}