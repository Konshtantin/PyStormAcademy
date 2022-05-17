const {Schema, model} = require('mongoose')

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    email_confirmed: {
        type: Boolean,
        required: true,
        default: false
    },
    password: {
        type: String,
        required: true
    },
    previous_password: {
        type: String
    },
    total_emails: {
        type: Number,
        required: true,
        default: 1
    },
    last_email_send: {
        type: Date
    },
    settings: [{
        name: {
            type: String,
            required: true
        },
        value: {
            type: String,
            required: true
        }
    }],
    complited_lessons: [{
        lesson: {
            type: Schema.ObjectId,
            ref: 'Lesson',
            required: true
        },
        completion_date: {
            type: Date,
            required: true
        }
    }],
    complited_tasks: [{
        task: {
            type: Schema.ObjectId,
            ref: 'Task',
            required: true
        },
        completion_code: {
            type: String,
            required: true
        },
        completion_date: {
            type: Date,
            required: true
        }
    }],
    last_theme: {
        type: Schema.ObjectId,
        ref: 'Theme'
    },
    last_task: {
        type: Schema.ObjectId,
        ref: 'Task'
    }
})

module.exports = model('User', UserSchema)
