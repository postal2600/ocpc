var fs = require("fs");
var path = require("path");

module.exports = {
  readFile: function (filename, callback) {
    fs.readFile(path.join(process.env.PWD, filename),{encoding: "UTF-8"}, callback);
  }
}
