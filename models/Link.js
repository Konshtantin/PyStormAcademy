const {Schema, model} = require('mongoose')
const { randomBytes } = require('crypto')

const LinkSchema = new Schema({
    user: {
        type: Schema.ObjectId,
        ref: 'User',
        required: true
    },
    created: {
        type: Date,
        required: true
    },
    type: {
        type: String,
        enum: ['confirm', 'change'],
        required: true
    }
})

LinkSchema.pre('save', function(next) {
    if(this.isNew) {
        this._id = randomBytes(10)
    }
    next()
})

module.exports = model('Link', LinkSchema)