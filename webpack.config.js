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
    entry: './src/index.js',
    output: {
        filename: 'app.bundle.js',
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
        new ExtractTextPlugin({
            filename:'app.bundle.css',
            disable: !isProd,
        }),
    ],
    module: {
        rules: [
            // HTML
            {
                test: /\.(html)$/,
                use: {
                    loader: 'html-loader',
                    options: {
                        attrs: [':data-src']
                    }
                }
            },
            // CSS
            {
                test:/\.(s*)css$/,
                use: cssConfig,
            },
            // TSC
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            // IMAGES
            {
                test: /\.(png|jp(e*)g|svg)$/,  
                use: [{
                    loader: 'url-loader',
                    options: { 
                        limit: 8000, // Convert images < 8kb to base64 strings
                        name: './img/[hash]-[name].[ext]',
                    }
                }]
            }
        ]
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ]
    },
};