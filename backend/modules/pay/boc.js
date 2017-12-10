/**
 * =============================================================================
 *  中国银行提供的接口
 * =============================================================================
 *
 * @author dondevi
 * @create 2017-09-06
 */


// 商户号
const MERCHANTID = "104480950940141";
// 终端号
const TERMINALID = "50940000";
// 授权码
const AUTHKEY = "12345678123456781234567812345678";
// 支付类型
const BIZTYPE = {
  WX_SCAN:  11002,  // 微信扫码支付
  WX_APP:   11003,  // 微信APP支付
  WX_MP:    11004,  // 微信公众号支付
  ALI_SCAN: 12002,  // 支付宝扫码支付
  ALI_APP:  12003,  // 支付宝APP支付
  ALI_H5:   12004,  // 支付宝H5支付
  REVOKE:   13001,  // 撤销
  REFUND:   13002,  // 退款
  QUERY:    13003,  // 查询

};


export function createBill (orderNo) {
  var param = {
    merchantId:  MERCHANTID,          // 商户号
    terminalId:  TERMINALID,          // 终端号
    orderNo:     orderNo,             // 订单号
    transAmt:    1,                   // 交易金额（分）
  };
  return Object.assign({
    bizType:     BIZTYPE.WX_SCAN,     // 交易类型
    iPv4Addr:    getUserIpv4(),       // 终端IPv4地址
    openId:      "",                  // 微信用户标识
    // attach:      "",                  // 商户附加数据
    // bizTypeOri:  "",                  // 原始交易类型
    // transAmtOri: "",                  // 原交易金额
    sign:        getSignature(param, AUTHKEY),  // 签名
  }, param);
}

export function getUserIpv4 () {
  return "1.1.1.1";
}

export function getSignature (param, key) {
  var crypto = require("crypto");
  var data = Object.keys(param).sort().map(k => param[k]).join("");
  return crypto.createHash("sha256").update(data + key).digest("hex");
}
