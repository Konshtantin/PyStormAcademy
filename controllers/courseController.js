const Module = require('../models/Module')
const {generateID} = require('../middleware/generateID')

function courses_get(req, res) {
    Module.find()
        .sort({number: 1})
        .then(mdls => {
            res.render('./course/courses', {modules: mdls})
        })
}

function lesson_get(req, res) {
    res.render('./course/singleLesson')
}

module.exports = {
    courses_get,
    lesson_get
}