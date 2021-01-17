import webpack from 'webpack';

export default {
    mode: 'development',
    devtool: 'inline-cheap-module-source-map',
    module: {
        rules: [
            {
                test: /\.[je]s$/,
                exclude: /node_modules|lib/,
                include: /__tests__/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['@babel/preset-env', {
                                targets: {
                                    chrome: '58',
                                    ie: '10'
                                }
                            }]
                        ],
                        plugins: [
                            // '@babel/plugin-transform-runtime',
                            // '@babel/plugin-proposal-object-rest-spread',
                            // '@babel/plugin-transform-async-to-generator'
                        ]
                    }
                }
            }
        ]
    },
    externals: ['chai', 'sinon', 'mocha']
} as webpack.Configuration