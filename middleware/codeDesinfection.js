function detectModules(code) {
    if(code.toLowerCase().includes('import')){
        return true
    }
    if(code.includes('os')) {
        return true
    }
    if(code.includes('sys')) {
        return true
    }
    if(code.includes('requests')) {
        return true
    }
    return false
}
function detectDangers(code) {

    if(code.includes('eval')) {
        return 'eval'
    }
    if(code.includes('exec')) {
        return 'exec'
    }
    if(code.includes('compile')) {
        return 'compile'
    }
    if(code.includes('globals')) {
        return 'globals'
    }
    if(code.includes('open')) {
        return 'open'
    }
    return false
}

function cutStrings(code) {
    let lump = code
    if(lump.includes(`'`)) {
        lump = lump.split(`'`).filter((item, index) => index%2 == 0).join('')
    } 
    if(lump.includes(`"`)) {
        lump = lump.split(`"`).filter((item, index) => index%2 == 0).join('')
    }
    return lump
}

function desinfectCode(codeString) {
    return new Promise((resolve, reject) => {
        let code = cutStrings(codeString)
        const detectedModule = detectModules(code)
        if(detectedModule) {
            resolve('Использование модулей запрещено в целях безопасности')
        }
        const detectedDanger = detectDangers(code)
        if(detectedDanger) {
            resolve(`Использование функции "${detectedDanger}" запрещено в целях безопасности`)
        }
        resolve(false)
    })
    
}

module.exports = {
    desinfectCode
}