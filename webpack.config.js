const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const environment = {
    development: "development",
    production: "production"
};

let config = {
    mode: environment.production,
    entry: {
        index: "./src/index.js",
        style: "./src/assets/_main.scss"
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "dist"),
        publicPath: "/"
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/, //.js or .jsx at the end
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            "@babel/preset-env",
                            "@babel/preset-react",
                        ],
                        plugins: [
                            "@babel/plugin-proposal-object-rest-spread",
                            "@babel/transform-react-jsx"
                        ]
                    }
                },
            },
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            modules: true,
                            sourceMap: true,
                        }
                    },
                    "css-loader",
                    "sass-loader"
                ]
            },
            {
                test: /\.less$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            modules: true,
                            sourceMap: true,
                        },
                    },
                    'css-loader',
                    'less-loader',
                ],
            },
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new webpack.DefinePlugin({
            PRODUCTION: JSON.stringify(process.env.NODE_ENV === environment.production),
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
            'PUBLIC_URL': "/"
        }),
        new HtmlWebpackPlugin({template: './public/index.html'}),
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: '[name].css',
            chunkFilename: '[id].css',
        }),
    ],
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        watchContentBase: true,
        compress: true,
        inline: true,
        hot: true,
        port: 3000,
    }
}

module.exports = (env, argv) => {
    if (argv.mode === environment.development) {
        config.mode = environment.development;
        config.devtool = "source-map";

        config.plugins.push(new webpack.DefinePlugin({
            PRODUCTION: JSON.stringify(false),
            'process.env.NODE_ENV': JSON.stringify(environment.development)
        }))

    } else if (argv.mode === environment.production) {
        config.mode = environment.production;
        config.plugins.push(new webpack.DefinePlugin({
            PRODUCTION: JSON.stringify(true),
            'process.env.NODE_ENV': JSON.stringify(environment.production)
        }));
    }

    return config;
}

