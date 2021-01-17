import karma from 'karma';
import 'karma-parallel';
import 'karma-webpack';

import webpackConfig from './webpack.test';
import os from 'os';

const cpuCount = os.cpus().length;

const configOptions = {

    basePath: '',

    frameworks: ['mocha', 'sinon-chai', 'chai', 'sinon'],

    files: [
        '../__tests__/prepare.js',
        '../__tests__/**/*.spec.js',
        {
            pattern: '../lib/**/*.*',
            served: true,
            included: false,
            watched: true
        }
    ],
    preprocessors: {
        '../__tests__/prepare.js': ['webpack'],
        '../__tests__/**/*.spec.js': ['webpack', 'sourcemap']
    },

    parallelOptions: {
        executors: cpuCount,
        shardStrategy: 'round-robin'
    },

    webpack: webpackConfig,
    webpackMiddleware: {},

    reporters: ['progress', 'mocha', 'coverage-istanbul'],
    
    coverageIstanbulReporter: {
        reports: ['html', 'json', 'text-summary'],
        dir: 'coverage',
        fixWebpackSourcePaths: true
    },

    port: 9876,

    colors: true,

    autoWatch: true,
    
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
        'karma-webpack'
    ],

} as karma.ConfigOptions;

export default function(config: karma.Config) {
    config.set(configOptions)
}