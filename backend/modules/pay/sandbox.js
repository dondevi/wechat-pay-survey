/**
 * =============================================================================
 *  微信支付沙箱
 * =============================================================================
 *
 * @author dondevi
 * @create 2017-09-14
 */

const axios = require("axios");

const { jsonToXml, xmlToJson } = require("../xml/index.js");
const { createSignature, createNonceStr } = require("./sign.js");

/**
 * 获取验签秘钥
 * @param  {String}   mchid    - 微信支付商户 ID
 * @param  {String}   mchkey   - 微信支付商户密钥
 * @param  {Function} callback - 回调
 * @return {Promise}
 */
function getSignKey (param, callback) {

  const { mchid, mchkey } = param;
  const url = "https://api.mch.weixin.qq.com/sandboxnew/pay/getsignkey";
  var config = {
    mch_id:    mchid,
    nonce_str: createNonceStr(),
  };
  config["sign"] = createSignature(config, mchkey);
  console.log("[Loading] Fetch Wechat Pay Sandbox Key...", JSON.stringify(config, null, 2));
  return axios.post(url, jsonToXml(config)).then(res => {
    xmlToJson(res.data, json => {
      if ("SUCCESS" === json.return_code) {
        console.log("[Success] Fetch Wechat Pay Sandbox Key:", JSON.stringify(json, null, 2));
      } else {
        console.log("[Failed] Fetch Wechat Pay Sandbox Key:", JSON.stringify(json, null, 2));
      }
      callback && callback(json);
    });
  }).catch(error => {
    console.log(error);
  });
}

module.exports = { getSignKey };
