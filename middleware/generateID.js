const { randomBytes } = require('crypto')

function generateID(bytes) {
    return randomBytes(bytes).toString('hex')
}

module.exports = {
    generateID
}
