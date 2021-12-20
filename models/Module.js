const {Schema, model} = require('mongoose')

const ModuleSchema = new Schema({
    name: {
        type: String,
        requied: true
    },
    number: {
        type: Number,
        required: true
    },
    id: {
        type: String,
        required: true
    }
})


module.exports = model('Module', ModuleSchema)