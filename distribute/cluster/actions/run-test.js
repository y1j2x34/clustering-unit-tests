const childProcess = require('child_process');
const status = require('../current-status');

module.exports = function(ctx, params, query){
    if(!query || !query.spec) {
        throw new Error('Missing test files!')
    }
    if(status.isRunning()) {
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
    child.on('message', console.log);
    child.on('close', () => {
        status.stop();
    });
    child.on('disconnect', () => {
        status.error('disconnected')
    });
    child.on('error', (error) => {
        status.error('error: ' + error.message + ', stack: ' + error.stack)
    });
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