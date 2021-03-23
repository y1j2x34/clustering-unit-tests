import os from 'os';

import karma from 'karma';
import 'karma-parallel';
import 'karma-webpack';
import 'yargs'
import webpackConfig from './webpack.test';
import yargs from 'yargs';

const cpuCount = os.cpus().length;


yargs.option('spec', {
    type: 'array',
    description: '测试用例文件列表',
    default: '**/*.spec.js'
})

const specs = (yargs.argv.spec as string[]).map(it => '../__tests__/' + it);

const extPreprocessors = specs.reduce((map, specfile) => {
    map[specfile] = ['webpack', 'sourcemap']
    return map;
}, {} as Record<string, string[]>)


const configOptions = {

    basePath: '',

    frameworks: ['mocha', 'sinon-chai', 'chai', 'sinon'],

    files: [
        '../__tests__/prepare.js',
        {
            pattern: '../lib/**/*.*',
            served: true,
            included: false,
            watched: true
        }
    ].concat(specs).concat(
        '../__tests__/launcher.js'
    ),
    preprocessors: Object.assign({
        '../__tests__/prepare.js': ['webpack']
    }, extPreprocessors),

    parallelOptions: {
        executors: cpuCount,
        shardStrategy: 'round-robin'
    },

    webpack: webpackConfig,
    webpackMiddleware: {},

    reporters: ['progress', 'mocha', 'coverage-istanbul', 'json-result'],
    
    client: {
        mocha: {
            reporter: 'html'
        }
    },

    coverageIstanbulReporter: {
        reports: ['json'],
        dir: 'coverage',
        fixWebpackSourcePaths: true
    },
    jsonResultReporter: {
        outputFile: 'unit-report/karma-result.json',
        isSynchronous: true
    },
    port: 9876,

    colors: true,

    autoWatch: true,

    customContextFile: './statics/karma-context.html',
    customDebugFile: './statics/karma-debug.html',

    customLaunchers: {
        HeadlessChrome: {
            base: 'ChromeHeadless',
            flags: ['--no-sandbox', '--headless', '--disable-translate', '--disable-extensions']
        },
        ConfiguredChrome: {
            base: 'Chrome',
            flags: ['--no-sandbox', '--disable-translate', '--disable-extensions']
        },
    },
    
    singleRun: false,

    plugins: [
        'karma-parallel',
        'karma-chrome-launcher',
        'karma-mocha',
        'karma-chai',
        'karma-sinon',
        'karma-sinon-chai',
        'karma-mocha-reporter',
        'karma-coverage-istanbul-reporter',
        'karma-sourcemap-loader',
        'karma-webpack',
        'karma-structured-json-reporter'
    ],

} as karma.ConfigOptions;

export default function(config: karma.Config) {
    config.set(configOptions)
}