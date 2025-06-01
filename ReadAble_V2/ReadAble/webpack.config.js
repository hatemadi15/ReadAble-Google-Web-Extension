module.exports = {
    mode: 'development',
    entry: {
        background: './src/background/background.js',
        content: './src/content/textCustomization.js',
        aiSimplification: './src/content/aiSimplification.js',
        textToSpeech: './src/content/textToSpeech.js',
        vocabularyHelper: './src/content/vocabularyHelper.js',
        popup: './src/popup/popup.js',
        options: './src/options/options.js'
    },
    output: {
        filename: '[name].bundle.js',
        path: __dirname + '/dist'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(otf|ttf|woff|woff2)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'fonts/'
                    }
                }
            }
        ]
    },
    resolve: {
        extensions: ['.js']
    },
    devtool: 'source-map'
};