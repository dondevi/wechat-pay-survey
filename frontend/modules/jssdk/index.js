/**
 * =============================================================================
 *  Wechat JSSDK
 * =============================================================================
 *
 * @author dondevi
 * @create 2017-09-07
 */


checkWechat(version => checkVersion(version, "6.0.2", initJSSDK));


function checkWechat (callback) {
  const regex = /MicroMessenger\/(\d+\.\d+(?:\.\d+)?)/i;
  const isWechat = window.navigator.userAgent.match(regex);
  if (isWechat) {
    callback && callback(isWechat[1]);
  } else {
    window.alert("请您在微信中打开！");
  }
}


function checkVersion (version, min, callback) {
  const verArr = version.split(".");
  const minArr = min.split(".");
  const length  = Math.max(verArr.length, minArr.length);
  for (let i = 0; i < length; i++) {
    if (~~minArr[i] < ~~verArr[i]) { break; }
    if (~~minArr[i] > ~~verArr[i]) {
      return window.alert(
        `很抱歉，暂时无法为您提供服务！` +
        `请将微信升级到 ${min} 或以上` +
        `（您的版本是 ${version}）`
      );
    }
  }
  callback && callback();
}





const jsApiList = [
  "chooseImage", "previewImage", "uploadImage",
  "chooseWXPay", "scanQRCode",
  // "getNetworkType", "getLocation", "openLocation",
  "onMenuShareTimeline", "onMenuShareAppMessage",
  // "startSearchBeacons", "stopSearchBeacons", "onSearchBeacons",
  "hideMenuItems", "showMenuItems", "closeWindow"
];


function initJSSDK () {
  if (!window.wx) {
    window.wx = {};
    return;
  }
  window.wx.ready(() => {
    // hideMenuItems();
  });
  window.wx.error(function (res) {
    window.alert("Weichat JSSDK Error: " + res.errMsg);
  });
  // configJSSDK();
}


function configJSSDK () {
  const config = getJSSDKConfig();
  window.wx.config({
    debug:     false,
    appId:     config.appId,
    timestamp: config.timestamp,
    nonceStr:  config.nonceStr,
    signature: config.signature,
    jsApiList: jsApiList,
  });
}


function hideMenuItems () {
  window.wx.hideMenuItems({
    menuList: [
      "menuItem:share:appMessage",  // 发送给朋友
      "menuItem:share:timeline",    // 分享到朋友圈
      "menuItem:share:qq",          // 分享到QQ
      "menuItem:share:weiboApp",    // 分享到微博
      "menuItem:share:facebook",    // 分享到FackBook
      "menuItem:share:QZone",       // 分享到QQ空间
      "menuItem:openWithQQBrowser", // 在QQ浏览器中打开
      "menuItem:openWithSafari",    // 在Safari中打开
      "menuItem:share:email",       // 邮件
      "menuItem:copyUrl",           // 复制链接
      "menuItem:setFont",           // 调整字体
      "menuItem:readMode",          // 阅读模式
      "menuItem:exposeArticle"      // 举报
    ],
  });
}

/**
 * 从 Cookie 中获取配置
 * @return {Object}
 */
export function getJSSDKConfig () {
  try {
    return JSON.parse(cookie_get("wxjssdk"));
  } catch (exception) {
    console.error("Wechat Signature Error.");
    return {};
  }
}

export function cookie_get (key) {
  var value = document.cookie.split(/\s*;\s*/).find(item => {
    return key === item.split("=")[0];
  }).split("=")[1];
  return window.decodeURIComponent(value);
}

export function cookie_remove (key) {
  document.cookie = key + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
}
