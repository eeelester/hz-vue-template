const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin')
module.exports = env => {

    let pro = env.production == 'true';

    let frontendConfig = (()=>{
        let rootPath = './';
        return {
            rootPath,
            srcPrefix : `${rootPath}/src`
        }
    })();


    return {
        mode: 'development',
        entry: {
            app: `${frontendConfig.srcPrefix}/main.js`,  // 入口起点的对象语法，如果有多个入口增加多个对象就可以了
        },
        // 控制是否生成，以及如何生成source map
        devtool: 'cheap-module-eval-source-map',
        output: {
            filename: '[name].[hash].js', // [name]的占位符是为了对应入口起点对象的key，避免多个入口的filename相同
            chunkFilename: '[name].[hash].js',
            path: "/", // 输出路径
            publicPath: "/" // 浏览器引用的输出目录的公开URL，主要是影响资源加载的url
        },
        //代码分割,all代表对全部代码都生效
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
                    include: path.resolve(__dirname,'src'),
                    loader: "babel-loader?cacheDirectory=true"
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
                    ] // use:应用单个或多个loader和选项，loader:只能一个
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
        },
        plugins: [
            new VueLoaderPlugin(),
            new HtmlWebpackPlugin(
                {
                    filename: `index.html`,//相对output中path路径
                    template: `!!html-loader!${frontendConfig.rootPath}/index.html`,
                    inject: 'body',
                    // hash: true,
                }
            )
        ],
        devServer: {
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            proxy:{
                '/gti':{
                    target: 'http://192.192.184.16:9991',
                    logLevel:"debug",
                    ws:true
                }
            },
        },
    }
};