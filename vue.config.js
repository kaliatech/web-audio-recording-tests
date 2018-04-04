module.exports = {
  lintOnSave: true,
  devServer: {
    https: true,
    disableHostCheck: true,
    port: 8443
  },
  configureWebpack: {
    // entry: {
    //   polyfillstest: './src/polyfill-mediarecorder.js'
    // }
  },
  // tweak internal webpack configuration.
  // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
  chainWebpack: config => {
    // config.entryPoints.delete('app')
    // config
    //   .entry('polyfill-mediarecorder')
    //   .add('./src/polyfill-mediarecorder.js')
    //   .end()
    //   .entry('app')
    //   .add('./src/main.js')
    //   .end()

    // config.plugin('html')
    //   .tap(([options]) => [Object.assign(options, {
    //     excludeChunks: ['polyfill-mediarecorder']
    //   })])

    // // A, remove the plugin
    // config.plugins.delete('prefetch');

    // or:
    // B. Alter settings:
    // config.plugin('prefetch').tap(options => {
    //   options.fileBlackList.push([polyfill(.)+?\.js$/]);
    //   return options;
    // });
  }
}
