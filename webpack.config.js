// ============================
// Dependencies
// ============================
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

var isProd = process.env.NODE_ENV === "production";

// ============================
// CSS configuration
// ============================
var cssDev = ["style-loader", "css-loader", "sass-loader"];
var cssProd = ExtractTextPlugin.extract({ 
    fallback:'style-loader',
    use:['css-loader','sass-loader'],
});
var cssConfig = isProd ? cssProd : cssDev;

// ============================
// Webpack configuration
// ============================
module.exports = {
    mode: 'development',
    entry: {
        app: './src/index.js',
        contact: './src/contact.js',
    },
    output: {
        //filename: 'app.bundle.js',
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: false,
        stats: "errors-only",
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "A Star Algorithm",
            minify: {
                collapseWhitespace: isProd,
            },
            hash: isProd,
            template: "./src/templates/index.ejs",
            filename: "index.html",
        }),
        new HtmlWebpackPlugin({
            title: "Contact",
            minify: {
                collapseWhitespace: isProd,
            },
            hash: isProd,
            template: "./src/templates/contact.ejs",
            filename: "contact.html",
        }),
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