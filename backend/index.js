/**
 * =============================================================================
 *  Webpack DevServer Setup
 * =============================================================================
 *
 * @author dondevi
 * @create 2016-11-24
 *
 * @update 2017-09-07 dondevi
 */

// Set all to root path
// process.env.NODE_PATH = __dirname;
// require("module").Module._initPaths();

const { PROXY_HOST, PROXY_PATH } = require("./configs/index.js");

const axios = require("axios");
const jssdk = require("./modules/jssdk/index.js");
const auth  = require("./modules/auth/index.js");
const pay   = require("./modules/pay/index.js");

const openIds = {};

/**
 * Webpack dev server 服务设置
 * @param  {Object} app - Express.js 对象
 */
function devSetup (app) {

  initAPP(app);

  app.get(PROXY_PATH + "/", (req, res, next) => {
    // var host = req.protocol + "://" + req.headers.host;
    var host = req.protocol + "://" + PROXY_HOST;
    var url  = host + req.originalUrl;
    const wxcode = req.query.wxcode || "example";
    auth.getOpenId(wxcode, url, req, res, openId => {
      openIds[req.sessionID + wxcode] = openId;
      jssdk.getWxJSSDKConfig(wxcode, url, config => {
        if (config) {
          res.append("Set-Cookie", `wxcode=${wxcode}`);
          res.append("Set-Cookie", `wxjssdk=${JSON.stringify(config)}`);
        }
        next();
      });
    });
  });

  app.post(PROXY_PATH + "/pay", (req, res) => {
    const wxcode = "undefined" !== req.query.wxcode && req.query.wxcode || "example";
    const openid = openIds[req.sessionID + wxcode];
    pay.getWxPayConfig(wxcode, openid, json => {
      res.send(json);
    }, req.query.sandbox).catch(error => {
      res.send({ success: false, exception: error });
    });
  });

  app.get(PROXY_PATH + "/payCallback", (req, res) => {
    res.send("[Success] Pay Callback");
  });

}

function initAPP (app) {
  const session = require("express-session");
  app.use(session({
    secret: "wechat pay test",
    // name:   "connect.id",
    // cookie: {},
    resave: true,
    proxy:  true,
    saveUninitialized: true,
  }));
  app.set("trust proxy");
}


module.exports = devSetup;
