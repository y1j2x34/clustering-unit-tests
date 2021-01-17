const childProcess = require('child_process');
module.exports = {
    method: 'get',
    description: '从git更新集群实例代码',
    handler: function(ctx, param, query) {
        setTimeout(() => {
            const branch = query.branch;
            exec('git stash')
            if(branch) {
                try {
                    exec('git checkout -t origin/' + branch)
                } catch (error) {
                    exec('git checkout ' + branch)
                }
            }
            exec('git pull --rebase')
        }, 100)
    }
};

function exec(command) {
    const out = childProcess.execSync(command)
    console.log(out.toString('utf-8'));
}