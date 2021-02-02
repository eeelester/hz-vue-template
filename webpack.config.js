const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const  CleanWebpackPlugin  = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");

const smp = new SpeedMeasurePlugin();
module.exports = smp.wrap(env => {

    let frontendConfig = (()=>{
        let rootPath = './';
        return {
            rootPath,
            srcPrefix : `${rootPath}/src`,
            distPath : path.resolve(__dirname, `${rootPath}/public/dist`)
        }
    })();


    return {
        mode:'production',
        entry: {
            app: `${frontendConfig.srcPrefix}/main.js`,  // 入口起点的对象语法，如果有多个入口增加多个对象就可以了
        },
        // 控制是否生成，以及如何生成source map
        devtool: 'none',
        plugins: [
            new VueLoaderPlugin(),
            new BundleAnalyzerPlugin(), // 打包分析
            new CleanWebpackPlugin([`${frontendConfig.distPath}/*`]), // 每次构建时清理旧的dist文件夹
            new HtmlWebpackPlugin(
                {
                    filename: `index.html`,//相对output中path路径
                    template: `!!html-loader!${frontendConfig.rootPath}/index.html`,
                    inject: 'body',
                    // hash: true,
                }
            ),
            new CopyWebpackPlugin([
                {
                    from: path.resolve(__dirname, './static'),
                    to: 'static',
                    ignore: [".*"],
                }
            ]),
        ],
        output: {
            path: frontendConfig.distPath , // 输出路径
            filename: '[name].[chunkhash].js', // [name]的占位符是为了对应入口起点对象的key，避免多个入口的filename相同
            chunkFilename: '[name].[chunkhash].js',
            publicPath: ""  // 浏览器引用的输出目录的公开URL，主要是影响资源加载的url，如果资源是相对路径，则为
        },
        //提取各个入口公共模块
        optimization: {
            splitChunks: {
                chunks: 'all'
            }
        },
        // 解析模块请求的选项，用于帮助模块找到相应的路径
        resolve: {
            extensions: ['.js', '.vue', '.json'],
            // 来创建import或require的别名，来确保模块引入变得更简单
            alias: {
                '@': path.resolve(__dirname, frontendConfig.srcPrefix),
                vue$: 'vue/dist/vue.runtime.esm.js'
            },
        },
        // 防止将某些import的包打包到bundle中，而是在运行时（runtime）再去从外部获取这些拓展依赖，比如从cdn或者其他文件夹内
        externals: {
            echarts: 'echarts'
        },
        module: {
            rules: [
                {
                    test: /\.vue$/,
                    use: ['vue-loader']
                },
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use:[
                        'thread-loader',
                        'babel-loader'
                    ]
                },
                {
                    test: /\.styl(us)?$/,
                    exclude: /node_modules/, // 不匹配node_modules文件夹里面的
                    use: [
                        'vue-style-loader',
                        'css-loader',
                        'postcss-loader',
                        'stylus-loader'
                    ]
                },
                {
                    test: /\.css$/,
                    // exclude: /node_modules/,
                    use: [
                        'vue-style-loader',
                        'css-loader',
                        'postcss-loader'
                    ] // use:应用单个或多个loader和选项，最后的最先调用，第一个接收前面的值，期望传出css和sourcemap（可选），
                    // loader:只能一个
                },
                {
                    test: /\.(png|jpe?g|gif|webp|svg)(\?.*)?$/,
                    use: [
                        /* config.module.rule('images').use('url-loader') */
                        {
                            loader: 'url-loader',
                            options: {
                                limit: 4096,
                                fallback: {
                                    loader: 'file-loader',
                                    options: {
                                        name: 'img/[name].[hash:8].[ext]'
                                    }
                                }
                            }
                        }
                    ]
                },
                {
                    test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
                    use: [
                        /* config.module.rule('fonts').use('url-loader') */
                        {
                            loader: 'url-loader',
                            options: {
                                limit: 4096,
                                fallback: {
                                    loader: 'file-loader',
                                    options: {
                                        name: 'fonts/[name].[hash:8].[ext]'
                                    }
                                }
                            }
                        }
                    ]
                },
            ]
        }
    }
});