const childProcess = require('child_process');

let isRunning = false;

module.exports = function(ctx, params, query){
    console.info('run test', query);

    if(!query || !query.spec) {
        throw new Error('Missing test files!')
    }
    if(isRunning) {
        throw new Error('The previous process is not completed!')
    }
    const specs = passingArrayQuery(query, 'spec');
    if(!specs) {
        throw new Error('Missing valid test files!')
    }
    const specsArg = specs.map(it => "--spec="+it).join(' ');

    const browsers = passingArrayQuery(query, 'browsers') || ['HeadlessChrome'];

    const browsersArg = browsers.map(it => '--browsers '+it).join(' ')

    const moreArgs = query['cli-args'] || '';

    const command = 'run test -- --singleRun true ' + specsArg + ' ' + browsersArg + ' ' + moreArgs;

    const child = childProcess.spawn('npm', command.split(' '))
    return new Promise((resolve, reject) => {
        let messages = [];
        child.stdout.on('data', data => {
            messages.push(data.toString('utf8'));
        });
        child.stderr.on('error', error => {
            messages.push(error.message, error.stack);
        })
        child.on('close', () => {
            isRunning = false;
            resolve({
                log: messages.join('\n'),
                coverage: require('../../../coverage/coverage-final.json')
            })
        });
        child.on('error', (error) => {
            isRunning = false;
            messages.push(error.message, error.stack);
            reject({
                log: messages.join('\n'),
                coverage: require('../../../coverage/coverage-final.json')
            })
        });
    })
};

function passingArrayQuery(queries, name) {
    const value = queries[name];
    const result = [];
    if(typeof value === 'string') {
        result.push(value);
    } else if(Array.isArray(value)) {
        result.push.apply(result, value);
    }
    if(result.length === 0) {
        return null;
    }
    return result;
}