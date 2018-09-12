const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

var isProd = process.env.NODE_ENV === "production";
var cssDev = ["style-loader", "css-loader", "sass-loader"];
var cssProd = ExtractTextPlugin.extract({ 
    fallback:'style-loader',
    use:['css-loader','sass-loader'],
});


var cssConfig = isProd ? cssProd : cssDev;

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        filename: 'app.bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        stats: "errors-only",
    },
    plugins: [
        new HtmlWebpackPlugin(),
        new ExtractTextPlugin({
            filename:'app.bundle.css',
            disable: !isProd,
        }),
    ],
    module: {
        rules: [
            {
                test: /\.(html)$/,
                use: {
                    loader: 'html-loader',
                    options: {
                        attrs: [':data-src']
                    }
                }
            },
            {
                test:/\.(s*)css$/,
                use: cssConfig
                //use:['style-loader','css-loader', 'sass-loader']
            },
        ]
    },
};