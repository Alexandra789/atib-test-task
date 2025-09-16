const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const devServer = (isDev) => !isDev ? {} : {
    devServer: {
        open: true,
        hot: true,
        port: 9000,
        static: {
            directory: path.join(__dirname, 'dist'),
        },
    }
};

module.exports = ({ develop }) => ({
    mode: develop ? 'development' : 'production',
    entry: './src/index.js',
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        alias: {
            '@': path.resolve(__dirname, 'src/'),
        }
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: develop ? '[name].js' : '[name].[contenthash].js',
        clean: true,
        assetModuleFilename: 'assets/[hash][ext][query]'
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            minify: false 
        }),
        new MiniCssExtractPlugin({
            filename: develop ? '[name].css' : '[name].[contenthash].css'
        })
    ],
    module: {
        rules: [
            {
                test: /\.(?:ico|png|jpg|jpeg|svg|gif|webp)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'images/[hash][ext][query]'
                }
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'fonts/[hash][ext][query]'
                }
            },
            {
                test: /\.html$/i,
                loader: 'html-loader'
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.css$/i,
                use: [
                    develop ? 'style-loader' : MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader'
                ]
            },
            {
                test: /\.scss$/i,
                use: [
                    develop ? 'style-loader' : MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                    'sass-loader'
                ]
            }
        ]
    },
    ...devServer(develop),
});