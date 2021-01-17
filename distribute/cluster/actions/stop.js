const childProcess = require('child_process')

module.exports = function() {
    childProcess.exec('npm run test:stop-cluster')
};