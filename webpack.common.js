const path = require('path')

const version = '0.0.1'

module.exports = {
    entry: './js/main.js',
    output: {
        path: path.resolve(__dirname, './public/js'),
        filename: 'app-v' + version + '.js'
    }
}
