
const path = require('path');
const HtmlPlugin = require('html-webpack-plugin');
module.exports = {
    mode: 'development',
    entry: {
        main: './app.js',
    },
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: '[name].js',
        publicPath: '/'
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            use: [{ loader: 'babel-loader' }],
        },
        {
            test: /\.css$/i,
            use: ['style-loader', 'css-loader'],
          },
            {
              test: /\.s[ac]ss$/i,
              use: [
                "style-loader",
                "css-loader",
                // Compiles Sass to CSS
                "sass-loader",
              ],
            },]
    },
    plugins: [
        new HtmlPlugin({
            title: 'Test',
            filename: 'index.html',
            template: 'index.html',
        })
    ],
    devServer: {
        port: 9090,
        hot: true,
        inline: true,
        historyApiFallback: true,
        contentBase: path.resolve(__dirname, 'public'),
    }
}