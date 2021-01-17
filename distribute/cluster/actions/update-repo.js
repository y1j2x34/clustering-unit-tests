const childProcess = require('child_process')
module.exports = {
    method: 'get',
    description: '从git更新集群实例代码',
    handler: function(ctx, param, query) {
        const branch = query.branch;
        childProcess.execSync('git stash')
        if(branch) {
            try {
                childProcess.execSync('git checkout -t origin/' + branch)
            } catch (error) {
                childProcess.execSync('git checkout ' + branch)
            }
        }
        childProcess.execSync('git pull --rebase')
    }
};