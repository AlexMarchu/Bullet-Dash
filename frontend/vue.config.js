module.exports = {
    publicPath: "./",
    pluginOptions: {
        electronBuilder: {
            nodeIntegration: true,
        },
    },
    chainWebpack: (config) => {
        config.module
            .rule("ts")
            .test(/\.ts$/)
            .use("ts-loader")
            .loader("ts-loader")
            .tap((options) => {
                return {
                    ...options,
                    appendTsSuffixTo: [/\.vue$/],
                };
            })
            .end();
    },
};
