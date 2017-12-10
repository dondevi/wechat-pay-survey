/**
 * =============================================================================
 *  JSON ↔ XML
 * =============================================================================
 *
 * @author dondevi
 * @create 2017-0914
 */

function jsonToXml (json) {
  const xml = require("xml");
  return xml({
    xml: Object.keys(json).map(key => {
      return { [key]: json[key] };
    })
  });
}

function xmlToJson (xml, callback) {
  const { parseString } = require("xml2js");
  parseString(xml, { explicitArray: false }, (err, res) => {
    if (err) { return console.log(err); }
    callback && callback(res.xml);
  });
}

module.exports = { jsonToXml, xmlToJson };
