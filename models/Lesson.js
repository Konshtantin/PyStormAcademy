const {Schema, model} = require('mongoose')

const LessonSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    filename: {
        type: String,
        required: true
    },
    module: {
        type: Schema.ObjectId,
        ref: 'Module',
        required: true
    },
    number: {
        type: Number,
        required: true
    },
	tasks_count: {
        type: Number,
        required: true
    },
    id: {
        type: String,
        required: true
    }
})
module.exports = model('Lesson', LessonSchema)