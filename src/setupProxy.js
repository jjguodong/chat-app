
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(createProxyMiddleware('/api', {
    target: 'http://10.0.8.100:3000',
    changeOrigin: true,
    pathRewrite: {
      '^/api/': '/'
    },
  }));
};