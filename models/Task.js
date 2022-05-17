const {Schema, model} = require('mongoose')

const TaskSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    filename: {
        type: String,
        required: true
    },
    lesson: {
        type: Schema.ObjectId,
        ref: 'Lesson',
        required: true
    },
    module_number: {
        type: Number,
        required: true
    },
    answer: {
        type: String
    },
    number: {
        type: Number,
        required: true
    },
    id: {
        type: String,
        required: true
	},
    include_code: {
        type: String
    },
    add_code_before: {
        type: String
    },
    add_code_after: {
        type: String
    },
    test_input: {
        type: String
    }
})
module.exports = model('Task', TaskSchema)