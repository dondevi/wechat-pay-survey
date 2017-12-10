/**
 * =============================================================================
 *  订单业务
 * =============================================================================
 *
 * @author dondevi
 * @create 2017-09-06
 */

function createOrder () {
  var date   = new Date();
  var year   = date.getFullYear();
  var month  = date.getMonth().toString().padStart(2, "0");
  var day    = date.getDate().toString().padStart(2, "0");
  var hour   = date.getHours().toString().padStart(2, "0");
  var minute = date.getMinutes().toString().padStart(2, "0");
  var second = date.getSeconds().toString().padStart(2, "0");
  return {
    orderNo: year + month + day + hour + minute + second,
  };
}

String.prototype.padStart = function padStart(targetLength,padString) {
    targetLength = targetLength >> 0;
    padString = String(padString || " ");
    if (this.length > targetLength) {
      return String(this);
    }
    targetLength = targetLength-this.length;
    if (targetLength > padString.length) {
      padString += padString.repeat(targetLength/padString.length);
    }
    return padString.slice(0,targetLength) + String(this);
};
