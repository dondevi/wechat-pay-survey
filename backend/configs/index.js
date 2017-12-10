/**
 * =============================================================================
 *  Config 配置
 * =============================================================================
 *
 * @author dondevi
 * @create 2017-09-14
 */

const PROXY_HOST = "(Please input your proxy host)";
const PROXY_PATH = "(Please input your proxy path)";
const PROXY_ADDR = "http://" + PROXY_HOST + PROXY_PATH + "/";

const WXCONFIG = {
  // wxcode -> config
  example: require("./example.js"),
};

module.exports = { PROXY_HOST, PROXY_PATH, PROXY_ADDR, WXCONFIG };
