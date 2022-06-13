// vue.config.js
module.exports = {
  parallel: false,
  // filenameHashing: false,
  configureWebpack: {
    devtool: 'source-map',
    performance: {
      maxEntrypointSize: 1000000,
      maxAssetSize: 512000,
      hints: false,
    },
  },
  pages: {
    index: {
      entry: 'src/script/main.ts',
      template: 'src/html-template/default.html',
      filename: 'index.html',
      title: 'Designer',
      chunks: ['chunk-vendors', 'chunk-common', 'index'],
    },
  },
  outputDir: 'dist', 
  css: {
    sourceMap: true,
    loaderOptions: {
      sass: {
        sourceMap: true,
      },
    },
  },
  devServer: {
    port: 8888,
    liveReload: true,
    open: ['http://localhost:8888/'],
    client: {
      logging: 'info',
      overlay: {
        errors: true,
        warnings: false,
      },
    },
    historyApiFallback: {
      rewrites: [
        { from: /^\/$/, to: '/index.html' },
      ],
    },
    proxy: {
    },
    watchFiles: {
      paths: ['src/**/*', 'public/**/*'],
      options: {
        usePolling: false,
      },
    },
  },
  chainWebpack: (config) => {
    config.module.rules.delete('eslint');
  },
};
