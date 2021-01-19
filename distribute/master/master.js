const path = require('path');
const childProcess = require('child_process');
const fetch = require('node-fetch')


const yargs = require('yargs');
const glob = require('glob');

yargs.option('cluster', {
    type: 'array',
    default: ['http://127.0.0.1:9888']
})
.option('args', {
    type: 'string',
    default: '--singleRun true --browsers Chrome'
})
.option('spec', {
    type: 'array',
    default: '**/*.spec.js'
})

const clusters = yargs.argv.cluster ;
const testArgs = yargs.argv.args.split(' ');
const specs = yargs.argv.spec;

console.info(yargs.argv)

if(clusters.length === 0) {
    runTest(testArgs);
} else {
    let specfiles = glob.sync(specs.map(it => path.resolve(__dirname, `../../__tests__/`, it)).join(','))
    const TESTS = '__tests__';
    specfiles = specfiles.map(it => {
        const index = it.indexOf(TESTS);
        return it.substring(index + TESTS.length);
    })
    const eachClusterCount = Math.floor(specfiles.length / clusters.length)

    let leftSpecFiles = specfiles;

    clusters.some(cluster => {
        if(leftSpecFiles.length === 0) {
            return true;
        }
        const specFiles = leftSpecFiles.slice(0, eachClusterCount)
        leftSpecFiles = leftSpecFiles.slice(eachClusterCount);
        const url = new URL('/action/run-test', cluster)
        specFiles.forEach(f => {
            url.searchParams.append('spec', f)
        });
        console.log('cluster:', url.href)
        fetch(url).then(response => {
            return response.json()
        }).then(result => {
            console.log(`============== cluster(${cluster}) log start ======================`)
            console.log(result.data.log)
            console.log(result.data.coverage)
            console.log(`============== cluster(${cluster}) log end ======================`)
        })
        return false;
    });
}



function runTest(testArgs) {
    const stream = childProcess.spawn('npm', ['run', 'test', '--', ...testArgs])

    stream.stdout.on('data', (data) => {
        console.log(data.toString('utf8'))
    });
    stream.stderr.on('data', data => {
        console.error(data.toString('utf8'));
    });
    return new Promise((resolve, reject) => {
        stream.on('error', function(error) {
            console.error(error);
            reject(error);
        });
        stream.on('close', function(code) {
            console.info('The test process closed with code:', code)
            resolve()
        })
    })
}