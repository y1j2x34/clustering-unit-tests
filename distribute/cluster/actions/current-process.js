const status = require('../current-status')
module.exports = function() {
    return status.currentTest || {};
}