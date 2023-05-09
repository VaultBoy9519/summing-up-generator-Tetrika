// proxy.js

const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function(app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "https://tetrika-school.ru",
      changeOrigin: true,
      secure: false,
      auth: "vadim.bykadorov@tetrika.school:c9UkJmdL"
    })
  );
};

// "vadim.bykadorov@tetrika.school:c9UkJmdL";