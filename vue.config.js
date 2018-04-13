var GitRevisionPlugin = require('git-revision-webpack-plugin')

let gitRevisionPlugin = new GitRevisionPlugin()

module.exports = {
  lintOnSave: true,
  devServer: {
    https: true,
    disableHostCheck: true,
    port: 8443
  },
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      config.output.publicPath = ''
    }
    // config.plugins.push(new DefinePlugin({
    //   'VERSION': JSON.stringify(gitRevisionPlugin.version()),
    //   'COMMITHASH': JSON.stringify(gitRevisionPlugin.commithash()),
    //   'BRANCH': JSON.stringify(gitRevisionPlugin.branch()),
    // }))
  },
  // configureWebpack: {
  //   entry: {
  //      polyfillstest: './src/polyfill-mediarecorder.js'
  //   }
  // },
  // tweak internal webpack configuration.
  // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
  chainWebpack: config => {
    config.plugin('define').tap(options => {
      Object.assign(options[0], {
        'WEBPACK_VERSION': JSON.stringify(gitRevisionPlugin.version()),
        'WEBPACK_COMMITHASH': JSON.stringify(gitRevisionPlugin.commithash()),
        'WEBPACK_BRANCH': JSON.stringify(gitRevisionPlugin.branch()),
        'WEBPACK_TIMESTAMP': JSON.stringify(new Date())
      })

      // There has got to be a better way...
      // Currently need this for loading the webworkers which have different rules and restrictions
      if (process.env.NODE_ENV === 'production') {
        Object.assign(options[0], {
          'BASE_URL': JSON.stringify('https://kaliatech.github.io/web-audio-recording-tests/dist'),
        })
      }
      else {
        Object.assign(options[0], {
          //'BASE_URL': JSON.stringify('https://localhost:8443'),
          'BASE_URL': JSON.stringify('https://10.9.22.161:8443'),
        })
      }
      return options
    })
    //# worker-loaded webified the workers and allowed use of ES6 imports inside the workers. However, that workers were
    // never reloaded from cache. Webpack service had to be stopped, and cache directory deleted, before getting changes.
    // Also, the encoders are large, so probably not good to load in to the main bundle anyways.
    // config.module
    //   .rule('worker')
    //     .test(/-worker\.js$/)
    //     .use('worker-loader')
    //       .loader('worker-loader')
    //     .options({inline: true})


    // config.loaders.push(new )

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
