const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/send-message',
    createProxyMiddleware({
      target: 'http://localhost:3001', // your backend server address
      changeOrigin: true,
    })
  );
};
