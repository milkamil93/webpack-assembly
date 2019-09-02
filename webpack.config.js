const
    PATH = require('path'), // путь до корня
    DIST_PATH = PATH.join(__dirname, 'dist'), // путь до собранных файлов

    glob = require('glob'), // получаем список файлов из дериктории
    CopyPlugin = require('copy-webpack-plugin'), // копирование файлов
    HtmlWebpackPlugin = require('html-webpack-plugin'), // шаблонизация html
    HtmlBeautifyPlugin = require('html-beautify-webpack-plugin'), // форматируем html на выходе, чтобы он красиво смотрелся (:
    TerserPlugin = require('terser-webpack-plugin'), // сжатие JS в production
    MiniCssExtractPlugin = require('mini-css-extract-plugin'), // собирает все CSS в один
    OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin'), //  сжимает CSS в production
    ImageminPlugin = require('imagemin-webpack-plugin').default, // оптимизация изображений
    ImageminMozjpeg = require('imagemin-mozjpeg'), // плагин для оптимизатора изображений
    SVGSpritemapPlugin = require('svg-spritemap-webpack-plugin') // SVG спрайт
;

module.exports = (env, argv) => {
    return {
        // точка входа
        entry: [
            './src/js/index.js'
        ],

        // точка выхода
        output: {
            path: DIST_PATH,
            filename: './js/main.js'
        },

        // режим запуска по умолчанию
        mode: argv.mode || 'development',

        // режим генерации sourcemap
        devtool: argv.mode === 'development' ? false : 'inline-source-map',

        // сервер для разработки http://localhost:8080/
        devServer: {
            open: true,
            overlay: true,
            compress: true,
            contentBase: DIST_PATH,
            watchContentBase: true
        },

        optimization: {
            minimizer: [new TerserPlugin(), new OptimizeCssAssetsPlugin()],
        },

        resolve: {
            extensions: ['.js','.jsx'],
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
                    test: /\.(js|jsx)$/,
                    exclude: /\.node_modules$/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env','@babel/preset-react'],
                            env: {
                                development : {
                                    compact: false
                                }
                            }
                        }
                    }
                },

                // css обработка
                {
                    test: /\.css$/,
                    use: [
                        'style-loader',
                        MiniCssExtractPlugin.loader,
                        'css-loader',
                        'postcss-loader',
                    ]
                },
                {
                    test: /\.styl$/,
                    use: [
                        'style-loader',
                        MiniCssExtractPlugin.loader,
                        'css-loader',
                        'postcss-loader',
                        'stylus-loader'
                    ]
                },

                // обработка изображений
                {
                    test: /\.(jpe?g|png|svg)$/,
                    use: ['file-loader']
                }
            ]
        },

        plugins: [
            // перекедыватель всяких файлов которые сами не умеют это делать (:
            new CopyPlugin([
                { from: './src/images', to: 'images' }
            ]),

            // сборка CSS
            new MiniCssExtractPlugin({
                filename: 'css/main.css'
            }),

            // шаблонизация html
            ...glob.sync('src/twig/*.twig')
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
                        unformatted: ['p','i','b','span','strong','a']
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
                    filename: 'images/sprite.svg'
                }
            })

        ]
    }
};