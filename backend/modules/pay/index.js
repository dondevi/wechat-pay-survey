/**
 * =============================================================================
 *  微信支付
 * =============================================================================
 *
 * @author dondevi
 * @create 2017-09-06
 *
 * @update 2017-09-14 dondevi
 *   1.Add: sandbox logic
 */

const axios = require("axios");

const { PROXY_ADDR, WXCONFIG } = require("../../configs/index.js");

const { jsonToXml, xmlToJson } = require("../xml/index.js");
const { createSignature, createNonceStr } = require("./sign.js");
const { getSignKey } = require("./sandbox.js");


/**
 * 获取微信 H5 支付参数
 * @param  {String}   wxcode    - 微信公众号代号
 * @param  {String}   openid    - 微信公众号用户 ID
 * @param  {Function} callback  - 回调
 * @param  {Function} isSandbox - 是否沙箱模式
 * @return {Promise}
 */
function getWxPayConfig (wxcode, openid, callback, isSandbox) {
  const { APPID, MCHID, MCHKEY } = WXCONFIG[wxcode];
  console.log("[Loading] Fetch Wechat Pay Config...");
  const param = { appid: APPID, mchid: MCHID, mchkey: MCHKEY, openid };
  const createWxOrderFunc = isSandbox ? createWxOrderBySandbox : createWxOrder;
  return createWxOrderFunc(param, json => {
    if ("SUCCESS" !== json.return_code) {
      console.log("[Failed] Fetch Wechat Pay Config");
      return callback && callback({ success: false, exception: json });
    }
    var config = {
      appId:     json.appid,
      timeStamp: (Date.now() / 1000).toFixed(0),
      nonceStr:  createNonceStr(),
      package:   `prepay_id=${json.prepay_id}`,
      signType:  "MD5",
    };
    config.paySign = createSignature(config, MCHKEY);
    console.log("[Success] Fetch Wechat Pay Config:", JSON.stringify(config, null, 2));
    callback && callback({ success: true, data: config });
  }).catch(error => {
    console.log(error);
  });
}


/**
 * 微信统一下单
 * @param  {String}   appid    - 微信公众号 APPID
 * @param  {String}   mchid    - 微信支付商户 ID
 * @param  {String}   mchkey   - 微信支付商户密钥
 * @param  {String}   openid   - 微信公众号用户 ID
 * @param  {Function} callback - 回调
 * @return {Promise}
 */
function createWxOrder (param, callback) {

  const { appid, mchid, mchkey, openid } = param;
  const url = "https://api.mch.weixin.qq.com/pay/unifiedorder";
  var config = {
    /* 公众账号ID */   appid:            appid,
    /* 商户号 */       mch_id:           mchid,
    /* 签名类型 */     sign_type:        "MD5",             // 非必填
    /* 随机字符串 */   nonce_str:        createNonceStr(),
    /* 商品描述 */     body:             "商品描述",
    // /* 商品详情 */     detail:           "商品详细描述",    // 非必填
    // /* 附加数据 */     attach:           "附加数据",        // 非必填
    /* 商户订单号 */   out_trade_no:     Date.now().toString(),
    // /* 标价币种 */     fee_type:         "CNY",             // 非必填
    /* 标价金额 */     total_fee:        1,
    /* 终端IP */       spbill_create_ip: "123.12.12.123",
    // /* 交易起始时间 */ time_start:       "20091225091010",  // 非必填
    // /* 交易结束时间 */ time_expire:      "20181227091010",  // 非必填
    /* 通知地址 */     notify_url:       PROXY_ADDR + "payCallback",
    /* 交易类型 */     trade_type:       "JSAPI",
    /* 用户标识 */     openid:            openid,
  };
  config["sign"] = createSignature(config, mchkey);
  console.log("[Loading] Create Wechat Pay Order...", JSON.stringify(config, null, 2));
  return axios.post(url, jsonToXml(config)).then(res => {
    xmlToJson(res.data, json => {
      if (json.return_msg) {
        console.log("[Failed] Create Wechat Pay Order:", JSON.stringify(json, null, 2));
      } else {
        console.log("[Success] Create Wechat Pay Order:", JSON.stringify(json, null, 2));
      }
      callback && callback(json);
    });
  }).catch(error => {
    console.log(error);
  });
}

/**
 * 微信统一下单（沙箱）
 * @param  {String}   appid    - 微信公众号 APPID
 * @param  {String}   mchid    - 微信支付商户 ID
 * @param  {String}   mchkey   - 微信支付商户密钥
 * @param  {String}   openid   - 微信公众号用户 ID
 * @param  {Function} callback - 回调
 * @return {Promise}
 */
function createWxOrderBySandbox (param, callback) {
  const { appid, mchid, openid } = param;
  const url = "https://api.mch.weixin.qq.com/sandboxnew/pay/unifiedorder";
  var config = {
    appid:            appid,
    mch_id:           mchid,
    sign_type:        "MD5",             // 非必填
    nonce_str:        createNonceStr(),
    body:             "商品描述",
    out_trade_no:     Date.now().toString(),
    total_fee:        101,
    spbill_create_ip: "123.12.12.123",
    notify_url:       PROXY_ADDR + "payCallback",
    trade_type:       "JSAPI",
    openid:           openid,
  };
  return getSignKey(param, json => {
    if ("SUCCESS" !== json.return_code) {
      return callback && callback(json);
    }
    config["sign"] = createSignature(config, json.sandbox_signkey);
    console.log("[Loading] Create Wechat Pay Order (sandbox)...", JSON.stringify(config, null, 2));
    return axios.post(url, jsonToXml(config)).then(res => {
      xmlToJson(res.data, json => {
        if ("SUCCESS" !== json.return_code) {
          console.log("[Failed] Create Wechat Pay Order (sandbox):", JSON.stringify(json, null, 2));
        } else {
          console.log("[Success] Create Wechat Pay Order (sandbox):", JSON.stringify(json, null, 2));
        }
        callback && callback(json);
      });
    }).catch(error => {
      console.log(error);
    });
  });
}


module.exports = { getWxPayConfig };
