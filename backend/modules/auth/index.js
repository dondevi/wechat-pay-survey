/*
 * =============================================================================
 *  Get Wechat User openId
 * =============================================================================
 *
 * @author dondevi
 * @create 2016-11-16
 *
 */

const path   = require("path");
const axios  = require("axios");

const cacher = require("../../caches/index.js")("auth/cache.json");
const logger = require("../../logs/index.js").getLogger("auth");

const { WXCONFIG } = require("../../configs/index.js");


/**
 * 获取微信用户的 openId
 * @param  {String}   wxcode   - 微信公众号代号
 * @param  {String}   url      - 用户访问的 URL
 * @param  {Object}   req      - 服务请求对象
 * @param  {Object}   res      - 服务响应对象
 * @param  {Function} callback - 成功回调
 */
function getOpenId (wxcode, url, req, res, callback) {

  console.log("[Loading] Fetch Wechat OpenId...");

  const STATE = "getAuthCode";
  const { APPID, SECRET, OPENID } = WXCONFIG[wxcode];

  if (/localhost/.test(url)) {
    console.log("[CONFIG] Fetch Wechat OpenId:", OPENID);
    return callback && callback(OPENID);
  }

  const refresh_token = cacher.get("refresh_token_" + APPID);
  if (refresh_token) {
    return refreshAuthAccessToken({ appid: APPID, refresh_token }, json => {
      console.log("[Success] Fetch Wechat OpenId:", json.openid);
      callback && callback(json.openid);
    });
  }

  if (STATE !== req.query.state || !req.query.code) {
    return getAuthCode({ url, appid: APPID, state: STATE }, authUrl => {
      res.redirect(authUrl);
    });
  }

  const code = req.query.code;
  console.log("[Success] Fetch Wechat Auth Code:", code);
  return getAuthAccessToken({ appid: APPID, secret: SECRET, code }, json => {
    console.log("[Success] Fetch Wechat OpenId:", json.openid);
    callback && callback(json.openid);
  });

}

/**
 * 获取微信网页授权 code
 * @param  {String}   url      - 用户访问的 URL
 * @param  {String}   appid    - 微信公众号 APPID
 * @param  {String}   scope    - 用户授权的作用域
 * @param  {String}   state    - 重定向后会带上 state 参数
 * @param  {Function} callback - 成功回调
 */
function getAuthCode (param, callback) {
  const { url, appid, scope, state } = param;
  const authUrl = `https://open.weixin.qq.com/connect/oauth2/authorize`
              + `?redirect_uri=${encodeURIComponent(url)}`
              + `&appid=${appid}`
              + `&response_type=code`
              + `&scope=${scope || "snsapi_base" || "snsapi_userinfo"}`
              + `&state=${state}`
              + `#wechat_redirect`;
  console.log("[Redirect] Getting Wechat Auth Code...", authUrl);
  callback && callback(authUrl);
}

/**
 * 获取微信网页授权 access_tocken
 * @param  {String}   appid    - 微信公众号 APPID
 * @param  {String}   secret   - 微信公众号 APPSECRET
 * @param  {String}   code     - 微信网页授权 code
 * @param  {Function} callback - 成功回调
 */
function getAuthAccessToken (param, callback) {

  const { appid , secret , code } = param;
  const url = `https://api.weixin.qq.com/sns/oauth2/access_token`
          + `?grant_type=authorization_code`
          + `&appid=${appid}`
          + `&secret=${secret}`
          + `&code=${code}`;

  console.log("[Loading] Fetch Wechat Auth Token...", url);
  axios.get(url).then(res => {
    logger.info(`Fetch Auth Token: ${JSON.stringify(res.data)}`);
    const { /*access_token,*/ refresh_token/*, expires_in*/ } = res.data;
    if (refresh_token) {
      // cacher.put("access_token_" + appid, access_token, expires_in);
      cacher.put("refresh_token_" + appid, refresh_token, 30 * 24 * 60 * 60);
      cacher.save();
      console.log("[Success] Fetch Wechat Auth Token:", JSON.stringify(res.data, null, 2));
    } else {
      console.log("[Failed] Fetch Wechat Auth Token:", JSON.stringify(res.data, null, 2));
    }
    callback && callback(res.data);
  }).catch(error => {
    console.log(error);
  });

}

/**
 * 刷新微信网页授权 access_tocken
 * @param  {String}   appid         - 微信公众号 APPID
 * @param  {String}   refresh_token - 微信网页授权 refresh_token
 * @param  {Function} callback      - 成功回调
 */
function refreshAuthAccessToken (param, callback) {

  const { appid, refresh_token } = param;
  const url = `https://api.weixin.qq.com/sns/oauth2/refresh_token`
          + `?grant_type=refresh_token`
          + `&appid=${appid}`
          + `&refresh_token=${refresh_token}`;

  console.log("[Loading] Refresh Wechat Auth Token...", url);
  axios.get(url).then(res => {
    logger.info(`Refresh Auth Token: ${JSON.stringify(res.data)}`);
    const { /*access_token,*/ refresh_token } = res.data;
    if (refresh_token) {
      console.log("[Success] Refresh Wechat Auth Token:", JSON.stringify(res.data, null, 2));
    } else {
      console.log("[Failed] Refresh Wechat Auth Token:", JSON.stringify(res.data, null, 2));
    }
    callback && callback(res.data);
  }).catch(error => {
    console.log(error);
  });

}

module.exports = { getOpenId };
