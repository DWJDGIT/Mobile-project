const { resolve } = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin')
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const dev = process.env.NODE_ENV != 'production';

module.exports = {
  mode: dev ? 'development' : "production",
  entry: {
    index: resolve(__dirname, './src/ts/index.ts'),
    detail: resolve(__dirname, './src/ts/detail.ts'),
    collections: resolve(__dirname, './src/ts/collections.ts')
  },
  output: {
    path: resolve(__dirname, 'dist'),
    filename: 'js/[name].js'
  },
  // 指定打包模块，用什么模块处理文件
  module: {
    rules: [
      // 制定规则生效的文件
      {
        test: /\.ts$/,
        use: [
          // 配置Babel
          {
            // 缓存之前构建过的js
            loader: "babel-loader?cacheDirectory=true",
            options: {
              // 设置预定义环境
              // polyfill方案
              presets: [
                [
                  // 指定环境插件
                  "@babel/preset-env",
                  // 配置信息
                  {
                    // 要兼容的浏览器
                    targets: {
                      chrome: '68',
                      ie: '11'
                    },
                    corejs: '3', //corejs才是api兼容实现的提供者！
                    useBuiltIns: 'usage'// 按需加载polyfill方法
                  }
                ]
              ],
              // 禁用了 Babel 自动对每个文件的 runtime 注入,避免辅助函数重复引入
              // 解决转译语法层时出现的代码冗余
              // 解决转译api层出现的全局变量污染
              // runtime拟替换api方案，同时有polyfill的方案，会优先采用runtime方案
              plugins: ['@babel/plugin-transform-runtime']
            }
          },
          { loader: 'ts-loader', options: { allowTsInNodeModules: true } }
        ],
        include: [resolve('src')],
        exclude: /node_modules/
      },
      {
        test: /\.less$/,
        use: [
          // 注入到DOM style-loader 开发环境
          // 将样式提取到单独的文件 MiniCssExtractPlugin.loader 生产环境
          dev ? 'style-loader' : {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../'
            }
          },
          {
            loader: 'css-loader',
            options: {
              url: false
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  [
                    'postcss-preset-env',
                    {
                      browser: 'last 2 version'
                    }
                  ]
                ]
              }
            }
          },
          'less-loader'
        ]
      },
      {
        test: /\.(png|jpg|jpeg|gif|ico|woff|eot|svg|ttf)$/i,
        loader: 'asset',
      },
      {
        test: /\.svg$/,
        loader: 'svg-sprite-loader',
        include: [resolve('src/icons')]
      },
      {
        test: /\.tpl$/,
        loader: 'ejs-loader',
        options: {
          // enable a CommonJS module syntax using
          esModule: false
        }
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: resolve(__dirname, 'src/html/index.html'),
      title: '新闻头条',
      chunks: ['index'],
      chunksSortMode: 'manual',
      excludeChunks: ['node_modules'],
      hash: true,
      minif: {
        removeComments: true,
        collaspseWhitespace: true
      }
    }),
    new HtmlWebpackPlugin({
      filename: 'detail.html',
      template: resolve(__dirname, 'src/html/detail.html'),
      title: '新闻详情',
      chunks: ['detail'],
      chunksSortMode: 'manual',
      excludeChunks: ['node_modules'],
      hash: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true
      }
    }),
    new HtmlWebpackPlugin({
      filename: 'collections.html',
      template: resolve(__dirname, 'src/html/collections.html'),
      title: '我的新闻',
      chunks: ['collections'],
      chunksSortMode: 'manual',
      excludeChunks: ['node_modules'],
      hash: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true
      }
    }),
    new MiniCssExtractPlugin({
      filename: dev ? "css/[name].css" : "css/[name].[contenthash].css",
      chunkFilename: dev ? "[id].css" : "[id].[contenthash].css"
    }),
    /**
     * 1. 解决url-loader，mini-css-excat-plugin分离图片文件后不能访问的问题
     * 2. css文件里不处理使用到的url ，在css-loader里面设置了
     * 3. 采用文件拷贝的方式将图片文件等拷贝到静态资源文件夹
     * 4. 不压缩成base64
     */
    new CopyWebpackPlugin({
      patterns: [
        {
          from: resolve(__dirname, "./src/assets"),
          to: resolve(__dirname, "dist/assets/[name][ext]")
        }
      ]
    })

  ],
  // 设置引用模块
  resolve: {
    alias: {
      "@": resolve('src')
    },
    extensions: ['.ts', '.js']
  },
  devServer: {
    port: 3000,
    open: true,
    host: 'localhost',
    client: {
      logging: 'error',
      overlay: true,
      progress: true
    },
  },
  optimization: {
    emitOnErrors: true,
    minimize: true,
    minimizer: [
      // webpack5的默认压缩工具，不使用的话会生成LICENSE.txt文件
      new TerserPlugin({
        extractComments: false
      }),
      new CssMinimizerWebpackPlugin()
    ],
    // 此设置保证有新增的入口文件时,原有缓存的chunk文件仍然可用
    chunkIds: "deterministic",
    // 创建一个在所有生成chunk之间共享的运行时文件
    runtimeChunk: "single",
    splitChunks: {
      // 设置为all, chunk可以在异步和非异步chunk之间共享
      chunks: 'all',
      cacheGroups: {
        libs: function () {
          return {
            name: 'chunk-libs',
            minSize: 0,      // 提取公共部分最小的大小
            minChunks: 2,    // 被提取的模块必须被引用2次
            // priority: 10,    // 优先级
            chunks: 'inital' // 提取入口文件的公共部分
          }
        },
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
        }
      }
    }
  },
  cache: {
    type: 'filesystem',
    buildDependencies: {
      defaultWebpack: ["webpack/lib/"],
      config: [__filename]
    },
    name: `${process.env.NODE_ENV}-cache`
  },
  // 控制台只输出错误信息
  stats: "errors-only"
}