function index_get(req, res) {
    res.render('index')
}

function ide_get(req, res) {
    res.render('ide')
}
module.exports = {
    index_get,
    ide_get
}