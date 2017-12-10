/**
 * =============================================================================
 *  Wechat Pay Signature
 * =============================================================================
 *
 * @author dondevi
 * @create 2017-09-08
 *
 */

/**
 * 签名算法
 * @param {Object} param - 签名参数
 * @param {String} key   - 商户密钥
 * @param {String} type  - 签名算法类型
 */
function createSignature (param, key, type) {
  const string = serialze(param) + "&key=" + key;
  return encrypt(string, key, type);
}

/**
 * 创建 32 位随机字符串
 * @return {String}
 */
function createNonceStr () {
  return new Array(3).fill(0).map(() => {
    return Math.random().toString(36).substr(2);
  }).join("").substr(0, 32);
}

/**
 * 序列化参数
 * @param  {Object} param - 参数
 * @return {String}
 */
function serialze (param) {
  return Object.keys(param).sort().map(key => {
    // 空值 不参与签名
    if ("" === param[key]) { return ""; }
    return key + "=" + param[key];
  }).join("&").replace(/&+/g, "&");
};

/**
 * 加密字符串
 * @param  {String} string - 字符串
 * @param  {String} type   - 加密方式
 * @return {String}
 */
function encrypt (string, key, type = "MD5") {
  const crypto = require("crypto");
  switch (type) {
    case "MD5":
      return crypto.createHash("md5").update(string)
                   .digest("hex").toUpperCase();
    case "HMAC-SHA256":
      return crypto.createHmac("sha256", key).update(string)
                   .digest("hex").toUpperCase();
  }
}


module.exports = { createSignature, createNonceStr };
