/**
 * =============================================================================
 *  Cache 缓存管理
 * =============================================================================
 *
 * @author dondevi
 * @create 2017-09-07
 *
 */

const Cache = require("cache").Cache;

function generateCach (filePath) {
  return new Cache(__dirname + "/" + filePath);
}

module.exports = generateCach;
