/**
 * =============================================================================
 *  Wechat pay mixin
 * =============================================================================
 *
 * @author dondevi
 * @create 2017-09-15
 */

import axios from "axios";

import { cookie_get } from "modules/jssdk";
import { Indicator } from "mint-ui";


export default {
  data: () => ({
    wxcode: { example: "示例公众号" }[cookie_get("wxcode")],
  }),
  methods: {
    h5Pay () {
      getPayConfig(wxH5Pay);
    },
    jsPay () {
      getPayConfig(wxJssdkPay);
    },
  },
};


function deparam (urlParam) {
  if ("string" !== typeof urlParam) { return false; }
  urlParam = urlParam.replace(/^[#\?]/, "");
  var result = {};
  urlParam.split("&").forEach(function (param) {
    param = param.split("=");
    result[param[0]] = param[1];
  });
  return result;
}

function getPayConfig (callback) {
  const { PROXY_PATH } = require("configs/index.js");
  const { wxcode } = deparam(window.location.search);
  Indicator.open();
  return axios.post(PROXY_PATH + "/pay?wxcode=" + wxcode).then(res => {
    return res.data;
  }).then(json => {
    Indicator.close();
    callback && callback(json.data);
  }).catch(error => {
    console.log(error);
  });
}


function wxH5Pay (config) {
  WeixinJSBridge.invoke("getBrandWCPayRequest", config, res => {
    // 使用以上方式判断前端返回, 微信团队郑重提示：
    // res.err_msg 将在用户支付成功后返回 ok，
    // 但并不保证它绝对可靠。
    switch (res.err_msg) {
      case "get_brand_wcpay_request:ok":
        break;
      case "get_brand_wcpay_request:cancel":
        break;
      case "get_brand_wcpay_request:fail":
        break;
    }
  });
}


function wxJssdkPay (config) {
  window.wx.chooseWXPay({
    signType:  "MD5",
    timestamp: config["timeStamp"],
    nonceStr:  config["nonceStr"],
    package:   config["package"],
    paySign:   config["paySign"],
    success:   res => console.log(res),
    cancel:    res => console.log(res),
    complete:  res => console.log(res),
    fail:      res => console.log(res),
  });
}
