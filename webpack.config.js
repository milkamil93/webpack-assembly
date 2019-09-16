const
    PATH = require('path'), // путь до корня

    glob = require('glob'), // получаем список файлов из дериктории
    CopyPlugin = require('copy-webpack-plugin'), // копирование файлов
    HtmlWebpackPlugin = require('html-webpack-plugin'), // шаблонизация html
    HtmlBeautifyPlugin = require('html-beautify-webpack-plugin'), // форматируем html на выходе, чтобы он красиво смотрелся (:
    TerserPlugin = require('terser-webpack-plugin'), // сжатие JS в production
    MiniCssExtractPlugin = require('mini-css-extract-plugin'), // собирает все CSS в один
    OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin'), //  сжимает CSS в production
    ImageminPlugin = require('imagemin-webpack-plugin').default, // оптимизация изображений
    ImageminMozjpeg = require('imagemin-mozjpeg'), // плагин для оптимизатора изображений
    SVGSpritemapPlugin = require('svg-spritemap-webpack-plugin'), // SVG спрайт
    VueLoaderPlugin = require('vue-loader/lib/plugin')
;

module.exports = (env, argv) => {
    return {
        // точка входа
        entry: [
            'webpack-dev-server/client?http://0.0.0.0:8080',
            'webpack/hot/only-dev-server',
            '@babel/polyfill',
            './src/js/common.js'
        ],

        // точка выхода
        output: {
            filename: './js/main.js'
        },

        // режим запуска по умолчанию
        mode: argv.mode || 'development',

        // режим генерации sourcemap
        devtool: argv.mode === 'development' ? false : 'source-map',

        // сервер для разработки http://localhost:8080/
        devServer: {
            hot: true,
            //open: true,
            overlay: true,
            host: '0.0.0.0',
            contentBase: argv.mode === 'production' ? PATH.join(__dirname, 'dist') : PATH.join(__dirname, 'src/twig'),
            watchContentBase: true
        },

        optimization: {
            minimizer: [new TerserPlugin(), new OptimizeCssAssetsPlugin()],
        },

        module: {
            rules: [

                // шаблонизация html
                {
                    test: /\.html$/,
                    use: [
                        'html-loader',
                    ]
                },
                {
                    test: /\.twig$/,
                    use: [
                        'raw-loader',
                        'twig-html-loader'
                    ]
                },

                // js обработка
                {
                    test: /\.js$/,
                    exclude: /\.node_modules$/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env'],
                            env: {
                                development: {
                                    compact: false
                                }
                            }
                        }
                    }
                },
                {
                    test: /\.vue$/,
                    loader: 'vue-loader'
                },

                // css обработка
                {
                    test: /\.css$/,
                    use: [
                        'css-hot-loader',
                        argv.mode !== 'production'
                            ? 'vue-style-loader'
                            : MiniCssExtractPlugin.loader,
                        'css-loader',
                        'postcss-loader'
                    ]
                },
                {
                    test: /\.styl(us)?$/,
                    use: [
                        'css-hot-loader',
                        argv.mode !== 'production'
                            ? 'vue-style-loader'
                            : MiniCssExtractPlugin.loader,
                        'css-loader',
                        'postcss-loader',
                        {
                            loader: 'stylus-loader',
                            options: {
                                use: [require('nib')(),require('rupture')()],
                                import: [
                                    '~rupture/rupture/index.styl',
                                    '~nib/lib/nib/index.styl',
                                    PATH.join(__dirname, 'src/styl/mixins.styl')
                                ]
                            }
                        }
                    ]
                },

                // обработка изображений
                {
                    test: /\.(jpe?g|png|gif|svg|eot|ttf|woff|woff2)$/,
                    loader: 'file-loader',
                    options: {
                        name: '[path][name].[ext]?[hash]',
                        //publicPath: 'images/',
                    }
                }
            ]
        },

        plugins: [
            // vue js
            new VueLoaderPlugin(),

            // перекедыватель всяких файлов которые сами не умеют это делать (:
            new CopyPlugin([
                { from: './src/images', to: 'images' }
            ]),

            // сборка CSS
            new MiniCssExtractPlugin({
                filename: 'css/main.css'
            }),

            // шаблонизация html
            ...glob.sync('src/tpl/*.twig')
                .map(twig => {
                    return new HtmlWebpackPlugin({
                        filename: PATH.basename(twig,'.twig') + '.html',
                        template: twig
                    })
                }),
            new HtmlBeautifyPlugin({
                config: {
                    html: {
                        preserve_newlines: false,
                        unformatted: ['p','i','b','strong']
                    }
                },
                replace: [' type="text/javascript"']
            }),

            // обработка изображений
            // JPG, JPEG
            new ImageminPlugin({
                test: /images\/([a-z_\-\s0-9]+)\.jpe?g$/i,
                disable: argv.mode !== 'production',
                jpegtran: {
                    progressive: true,
                    arithmetic : false,
                },
                plugins: [
                    ImageminMozjpeg({
                        quality: 85,
                        progressive: true,
                        targa: false,
                        revert: false,
                        dcScanOpt: 1,
                        notrellis: false,
                        notrellisDC: false,
                        tune: 'hvs-psnr',
                        noovershoot: false,
                        arithmetic: false,
                        smooth: 0
                    }),
                ],
            }),
            // PNG
            new ImageminPlugin({
                test: /images\/([a-z_\-\s0-9]+)\.png$/i,
                disable: argv.mode !== 'production',
                optipng: {
                    optimizationLevel: 7,
                    bitDepthReduction: true,
                    colorTypeReduction: true,
                    paletteReduction: true,
                },
            }),
            // SVG sprite
            new SVGSpritemapPlugin('src/svgSprite/*.svg', {
                output: {
                    filename: 'images/sprite.svg',
                    svg4everybody: true
                },
                sprite: {
                    generate: {
                        title: false
                    }
                }
            })

        ]
    }
};