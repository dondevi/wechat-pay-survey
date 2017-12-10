/**
 * =============================================================================
 *  Cooking Config
 * =============================================================================
 *
 * @author dondevi
 * @create 2017-09-06
 */

const path    = require("path");
const cooking = require("cooking");

const setup   = require("./backend/index.js");


cooking.set({

  entry: "./frontend/main.js",
  template: "./frontend/index.html",

  postcss: [],
  extends: ["vue2"],

  alias: {
    src: path.resolve(__dirname, "./frontend"),
    router: path.resolve(__dirname, "./frontend/router"),
    assets: path.resolve(__dirname, "./frontend/assets"),
    modules: path.resolve(__dirname, "./frontend/modules"),
    layouts: path.resolve(__dirname, "./frontend/layouts"),
    configs: path.resolve(__dirname, "./frontend/configs"),
  },

  devServer: {
    port: 8101,
    clean: false,
    sourceMap: true,
    // publicPath: "(Your proxy path if need)",
    publicPath: "/",
    hostname: "0.0.0.0",
    setup: setup,
  },

});


module.exports = cooking.resolve();
