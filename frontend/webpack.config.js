const path = require("path");
const { VueLoaderPlugin } = require("vue-loader");

module.exports = {
    entry: "./src/main.js",
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist"),
    },
    resolve: {
        extensions: [".ts", ".js", ".vue"],
        alias: {
            "@": path.resolve(__dirname, "src"),
        },
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.vue$/,
                loader: "vue-loader",
            },
            // {
            //     test: /\.(mp3|wav)$/,
            //     loader: 'file-loader',
            //     use: [
            //         {
            //             loader: 'file-loader',
            //             options: {
            //                 name: 'assets/music/[name].[ext]',
            //             }
            //         }
            //     ]
            // }
        ],
    },
    plugins: [new VueLoaderPlugin()],
};
