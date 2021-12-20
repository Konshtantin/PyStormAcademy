const {makeCodeZone, appendPid} = require('../coderun/codeRun')
const {desinfectCode} = require('../middleware/codeDesinfection')

async function code_run_post(req, res) {
    const PORT = req.body.PORT
    const desinfectionResult = await desinfectCode(req.body.code)
    if(desinfectionResult) {
        res.json({response: {derror: desinfectionResult}})
        return
    }
    const args = req.body.args
    // arg_count = q7FoyXesQ5
    // argList = kxrOErK6AK
    // submit_pid = NN2E61KS1i
    const code = `import os \nimport requests \nimport sys \nq7FoyXesQ5 = 0 \nkxrOErK6AK = sys.argv[1:] \ndef input(): \n    global q7FoyXesQ5 \n    arg = kxrOErK6AK[q7FoyXesQ5] \n    q7FoyXesQ5 += 1 \n    return arg \ndef userProgram(): \n${req.body.code.split('\n').map(item => '    ' + item).join('\n')} \n\ndef NN2E61KS1i(): \n    obj = {'cpid': [os.path.basename(sys.argv[0])[:-3], os.getpid()]} \n    response = requests.post('http://localhost:${PORT}/run/cpid', data = obj) \n    if(response.status_code == 200): \n        userProgram() \n\nNN2E61KS1i()`
    const result = await makeCodeZone(code, args, './coderun')
    
    res.json({response: result})
}

function cpid_post(req, res) {
    const pidStatus = appendPid(req.body.cpid[0], req.body.cpid[1])
    if(pidStatus === 1) {
        res.status(200)
    }
    res.send()
}

module.exports =  {
    code_run_post,
    cpid_post
}