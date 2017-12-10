/**
 * =============================================================================
 *  Get Wechat JSSDK Signature
 * =============================================================================
 *
 * @example {
 *   url:          "http://example.com",
 *   nonceStr:     "82zklqj7ycoywrk",
 *   timestamp:    "1415171822",
 *   signature:    "1316ed92e0827786cfda3ae355f33760c4f70c1f"
 *   jsapi_ticket: "jsapi_ticket",
 * }
 *
 * @author dondevi
 * @create 2017-09-07
 *
 */

const path   = require("path");
const axios  = require("axios");

const cacher = require("../../caches/index.js")("jssdk/cache.json");
const logger = require("../../logs/index.js").getLogger("jssdk");

const { WXCONFIG } = require("../../configs/index.js");

const { createSignature, createNonceStr, getTimestamp } = require("./sign.js");


/**
 * 获取微信 JSSDK 签名
 * @param  {String}   wxcode   - 微信公众号代号
 * @param  {String}   url      - 用户访问的 URL
 * @param  {Function} callback - 成功回调
 */
function getWxJSSDKConfig (wxcode, url, callback) {
  const { APPID, SECRET } = WXCONFIG[wxcode];
  console.log("[Loading] Fetch Wechat JSSDK Signature...");
  return getJsapiTicket({ appid: APPID, secret: SECRET }, ticket => {
    if (!ticket) { return callback && callback(); }
    var config = {
      url:          url,
      nonceStr:     createNonceStr(),
      timestamp:    getTimestamp(),
      jsapi_ticket: ticket,
    };
    config["signature"] = createSignature(config);
    config["appId"] = APPID;
    console.log("[Success] Fetch Wechat JSSDK Signature:", JSON.stringify(config, null, 2));
    delete config.url;
    delete config.jsapi_ticket;
    callback && callback(config);
  });
}

/**
 * 获取微信 JSSDK 票据
 * @param  {String}   appid    - 微信公众号 APPID
 * @param  {String}   secret   - 微信公众号 APPSECRET
 * @param  {Function} callback - 成功回调
 */
function getJsapiTicket (param, callback) {
  const { appid } = param;
  const ticket = cacher.get("jsapi_ticket_" + appid);
  if (ticket) {
    console.log("[Cache] Wechat JSAPI Ticket:", ticket);
    return callback && callback(ticket);
  }
  return getAccessToken(param, access_token => {
    if (!access_token) { return callback && callback(); }
    fetchJsapiTicket({ appid, access_token }, callback);
  });
}

/**
 * 获取微信 access_token
 * @param  {String}   appid    - 微信公众号 APPID
 * @param  {String}   secret   - 微信公众号 APPSECRET
 * @param  {Function} callback - 成功回调
 */
function getAccessToken (param, callback) {
  const access_token = cacher.get("access_token_" + param.appid);
  if (access_token) {
    console.log("[Cache] Wechat Access Token:", access_token);
    return callback && callback(access_token);
  }
  fetchAccessToken(param, callback);
}

/**
 * 远程获取微信 JSSDK 票据
 * @param  {String}   appid        - 微信公众号 APPID
 * @param  {String}   access_token - 微信 access_token
 * @param  {Function} callback     - 成功回调
 */
function fetchJsapiTicket (param, callback) {

  const { appid, access_token } = param;
  const url = `https://api.weixin.qq.com/cgi-bin/ticket/getticket`
            + `?type=jsapi&access_token=${access_token}`;

  console.log("[Loading] Fetch Wechat JSAPI Ticket...");
  return axios.get(url).then(res => {
    logger.info(`Fetch Ticket: ${JSON.stringify(res.data)}`);
    const { ticket, expires_in } = res.data;
    if (ticket) {
      cacher.put("jsapi_ticket_" + appid, ticket, expires_in);
      cacher.save();
      console.log("[Success] Fetch Wechat JSAPI Ticket:", ticket);
    } else {
      console.log("[Failed] Fetch Wechat JSAPI Ticket");
    }
    callback && callback(ticket);
  }).catch(error => {
    console.log(error);
  });

}

/**
 * 远程获取微信 access_token
 * @param  {String}   appid    - 微信公众号 APPID
 * @param  {String}   secret   - 微信公众号 APPSECRET
 * @param  {Function} callback - 成功回调
 */
function fetchAccessToken (param, callback) {

  const { appid, secret } = param;
  const url = `https://api.weixin.qq.com/cgi-bin/token`
          + `?grant_type=client_credential`
          + `&appid=${appid}`
          + `&secret=${secret}`;

  console.log("[Loading] Fetch Wechat Access Token...", url);
  return axios.get(url).then(res => {
    logger.info(`Fetch Token: ${JSON.stringify(res.data)}`);
    const { access_token, expires_in } = res.data;
    if (access_token) {
      cacher.put("access_token_" + appid, access_token, expires_in);
      cacher.save();
      console.log("[Success] Fetch Wechat Access Token:", access_token);
    } else {
      console.log("[Failed] Fetch Wechat Access Token:", JSON.stringify(res.data, null, 2));
    }
    callback && callback(access_token);
  }).catch(error => {
    console.log(error);
  });

}


module.exports = { getWxJSSDKConfig };
