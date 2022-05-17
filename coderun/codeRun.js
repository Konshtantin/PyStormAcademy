const fs = require('fs')
const {randomBytes} = require('crypto')
const {exec} = require('child_process')
const EventEmitter = require('events');

const pidEmitter = new EventEmitter()

pidEmitter.setMaxListeners(100000)


const cpidList = []


function appendPid(filename, pid) {
    cpidList.push({filename: filename, pid: Number(pid)})
    pidEmitter.emit('appanded')
    return 1
}

function createID() {
    return randomBytes(5).toString('hex')
}

function createFolder(id, source) {
    return new Promise((resolve, reject) => {
        fs.mkdir(`${source}/CodeZone/${id}`, err => {
            if(err) throw err
            resolve()
        })
    })
    
}

function createPFile(id, codeText, source) {
    return new Promise((resolve, reject) => {
        fs.writeFile(`${source}/CodeZone/${id}/${id}.py`, codeText, 'utf8', (err) => {
            if(err) throw err
            resolve()
        })
    })
    
}

function removeCodeZone(id, source) {
    fs.unlink(`${source}/CodeZone/${id}/${id}.py`, (err) => {
        if(err) throw err
        fs.rmdir(`${source}/CodeZone/${id}`, (err) => {
            if(err) throw err
        })
    })
}
function createErrorMessage(errStrings) {
    // первый элемент: берем строку, в которой содержится число линии, в которой ошибка > сплитим по ',' > выбираем последний элемент, где line <number> > сплитим по пробелу > убираем пустые строки > берем элемент с индексом 1(он последний) 
    errArray = [errStrings[errStrings.length-3].split(',')[1].split(' ').filter(item => item != '')[1], errStrings[errStrings.length-1]]

    if(errArray[0] == 8){
        errArray[0] = 'InputError'
        errArray[1] = 'InputError: Insufficient data entered for input function'
    } else {
        errArray[0] = errArray[0] - 11
    }
    return {error: {
        type: errArray[0] == 'InputError' ? 'InputError': 'InbuildError',
        errArray
    }}
    
}
function makeCodeZone(code, args, source) {
    return new Promise(async (resolve, reject) => {
        const id = createID()
        await createFolder(id, source)
        await createPFile(id, code, source)

        let processKiller = ''
        pidEmitter.on('appanded', () => {
            const pidIndex = cpidList.findIndex(item => item.filename === id)
            const pid = cpidList[pidIndex]
            if(pidIndex === -1) return
            processKiller = setTimeout(() => {
                exec(`kill ${pid.pid}`)
                cpidList.splice(pidIndex, 1)
                console.log(cpidList)
                resolve('Программа выполняется слишком долго) Оптимизируйте её пожалуйста))')
            }, 1500)
        })

        exec(`python3 ${source}/CodeZone/${id}/${id}.py "${args.join('" "')}"`, {encoding: 'UTF8', maxBuffer: 1024*512}, (error, stdout, stderr) => {
            if (error) {
                removeCodeZone(id, source)
                if(error.message === 'stdout maxBuffer length exceeded') {
                    resolve(error.message)
                    return
                }
                // сплитим по \r > соединяем > сплитим по \n > убираем лишние пробелы в элементах > фильтруем пустые строки и ^
                errStrings = error.message.split('\r').join('').split('\n').map(item => item.trim()).filter(item => item != '^' && item != '')
                if(errStrings.length >= 4) {
                    resolve(createErrorMessage(errStrings))
                }
                return
            }
            if (stderr) {
                clearTimeout(processKiller)
                removeCodeZone(id, source)
                resolve(stderr.toString())
                return
            }
            clearTimeout(processKiller)
            removeCodeZone(id, source)
            resolve(stdout.toString())
        })
    })
    
}

module.exports = {makeCodeZone, appendPid}
