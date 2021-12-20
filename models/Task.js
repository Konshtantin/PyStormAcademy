const {Schema, model} = require('mongoose')

const TaskSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    solution: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard']
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
module.exports = model('Task', TaskSchema)