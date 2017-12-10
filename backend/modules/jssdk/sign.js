/**
 * =============================================================================
 *  Wechat JSSDK Signature
 * =============================================================================
 *
 * @author dondevi
 * @create 2017-09-07
 *
 */

/**
 * 签名算法
 * @param {Object} param - 签名参数
 */
function createSignature (param) {
  const string = serialze(param);
  return encrypt(string);
}

function createNonceStr () {
  return Math.random().toString(36).substr(2, 15);
}

function getTimestamp () {
  return (Date.now() / 1000).toFixed(0);
}

function serialze (param) {
  return Object.keys(param).sort().map(key => {
    return key.toLowerCase() + "=" + param[key];
  }).join("&");
};

function encrypt (string) {
  const crypto = require("crypto");
  return crypto.createHash("sha1").update(string).digest("hex");
}

// function getTimestamp () {
//   return parseInt(new Date().getTime() / 1000) + "";
// }

// function raw (args) {
//   var keys = Object.keys(args);
//   keys = keys.sort();
//   var newArgs = {};
//   keys.forEach(function (key) {
//     newArgs[key.toLowerCase()] = args[key];
//   });
//   var string = "";
//   for (var k in newArgs) {
//     string += "&" + k + "=" + newArgs[k];
//   }
//   string = string.substr(1);
//   return string;
// };

module.exports = { createSignature, createNonceStr, getTimestamp };





/**
 * Get signature form Access Server
 * To Avoid conflict of Access Token's expiry
 *
 * @author dondevi
 * @create 2016-11-21
 */

// var axios  = require('axios');
// var querystring = require('querystring');

// function getSignature (requestUrl, callback) {
//   console.log('\nGetting Wechat JSSDK Signature..');
//   console.log('url: ', requestUrl, '\n');
//   var url = 'http://192.168.0.164:8098/_dev/getSignatureInfo';
//   var data = querystring.stringify({ requestUrl: requestUrl });
//   return axios.post(url, data, {
//     headers: {
//       'Content-Type': 'application/x-www-form-urlencoded',
//     },
//   }).then(function (res) {
//     console.log('Get Wechat JSSDK Signature Success!');
//     console.log('signature: ', res.data, '\n');
//     callback(res.data);
//   }).catch(function (error) {
//     callback(false);
//     console.log('Get Wechat JSSDK Signature Failed:', error.response.status, error.response.statusText, '\n');
//   });
// }


// module.exports = getSignature
