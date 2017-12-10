/**
 * =============================================================================
 *  log4js 日志管理
 * =============================================================================
 *
 * @author dondevi
 * @create 2017-09-07
 *
 */

const log4js = require("log4js");

log4js.configure({
  appenders: {
    "console": { type: "console" },
    "auth": {
      type: "dateFile",
      filename: __dirname + "/auth/",
      pattern: "yyyy-MM-dd.log",
      alwaysIncludePattern: true
    },
    "jssdk": {
      type: "dateFile",
      filename: __dirname + "/jssdk/",
      pattern: "yyyy-MM-dd.log",
      alwaysIncludePattern: true
    },
    "pay": {
      type: "dateFile",
      filename: __dirname + "/pay/",
      pattern: "yyyy-MM-dd.log",
      alwaysIncludePattern: true
    },
  },
  categories: {
    default: { appenders: ["console"], level: "info" },
    "auth":  { appenders: ["auth"],    level: "info" },
    "jssdk": { appenders: ["jssdk"],   level: "info" },
    "pay":   { appenders: ["pay"],     level: "info" },
  }
});

module.exports = log4js;
