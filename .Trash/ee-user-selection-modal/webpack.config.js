const webpack = require('webpack');
const { merge } = require('webpack-merge');
const singleSpaDefaults = require('webpack-config-single-spa-react-ts');
const pkg = require('./package.json');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// const SentryCliPlugin = require('@sentry/webpack-plugin');
const path = require('path');

module.exports = (webpackConfigEnv, argv) => {
    const defaultConfig = singleSpaDefaults({
        orgName: 'jd',
        projectName: 'ee-user-selection-modal',
        // optional
        // This changes whether package names that start with @your-org-name are
        // treated as webpack externals or not. Defaults to true
        orgPackagesAsExternal: false,
        webpackConfigEnv,
        argv,
    });

    // 定制功能
    // 目标名字
    let outputBundleName = 'bundle.js';
    let devtool = 'inline-source-map';
    const plugins = [
        //     new webpack.DefinePlugin({
        //         'process.env.WEBSOCKET_ENDPOINT': JSON.stringify(process.env.WEBSOCKET_ENDPOINT || '9618'),
        //         'process.env.HTTP_ENDPOINT': JSON.stringify(process.env.HTTP_ENDPOINT || '9618'),
        //     }),
    ];
    // // bundle 分析
    const isAnalyzer = argv.analyze;
    if (isAnalyzer) {
        plugins.push(new BundleAnalyzerPlugin());
    }
    // 生产环境
    const isProd = argv.mode === 'production';
    const isPublish = process.env.NPM_PUBLISH === 'true';
    if (isProd) {
        if (isPublish) {
            outputBundleName = `index.js`;
        } else {
            outputBundleName = `${pkg.name.replace(/@/, '').replace('/', '_')}-${pkg.version}-[fullhash:8].js`;
        }

        devtool = 'source-map';
        // plugins.push(
        //     new SentryCliPlugin({
        //         release: `${process.env.SENTRY_PROJECT_VERSION || pkg.version}`,
        //         include: path.resolve(__dirname, './dist'),
        //         urlPrefix: `~/${process.env.SENTRY_PROJECT_ENV || 'jsmf-prod'}/j-test/`,
        //         project: process.env.SENTRY_PROJECT || 'joyspace',
        //     }),
        // );
    }

    return merge(defaultConfig, {
        // modify the webpack config however you'd like to by adding to this object
        entry: path.resolve(__dirname, './src/jsmf'),
        // 输出
        output: {
            clean: true,
            filename: outputBundleName,
            // libraryTarget: 'umd',
        },
        devtool,
        module: {
            rules: [
                {
                    test: /\.jsx?$/,
                    use: ['babel-loader'],
                    exclude: /node_modules/, // 排除 node_modules 目录
                },
                {
                    test: /\.(le|c)ss$/,
                    use: [
                        'style-loader',
                        'css-loader',
                        'postcss-loader',
                        // {
                        // loader: 'postcss-loader',
                        // options: {
                        //     postcssOptions: { config: false },
                        //     sourceMap: false,
                        // },
                        // },
                        {
                            loader: 'less-loader',
                            options: {
                                sourceMap: false,
                            },
                        },
                        {
                            loader: 'style-resources-loader',
                            options: {
                                patterns: [
                                    path.resolve(__dirname, `./src/assets/less/vars.less`),
                                    path.resolve(__dirname, `./src/assets/less/theme.less`),
                                ],
                            },
                        },
                    ],
                    exclude: /node_modules/,
                },
                {
                    test: /\.(png|jpg|gif|jpeg|webp|svg|eot|ttf|woff|woff2)$/,
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                limit: 10240, // 10K
                                esModule: false,
                                outputPath: 'assets',
                            },
                        },
                    ],
                    exclude: /node_modules/,
                },
                {
                    test: /.html$/,
                    use: 'html-withimg-loader',
                },
            ],
        },
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
            },
        },
        externals: ['react', 'react-dom', 'antd', /^@jd\/jsmf.+/],
        // 定制插件
        plugins,
        devServer: {
            allowedHosts: 'all',
            port: 9618,
        },
    });
};
