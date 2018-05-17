var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var headers = require('./http-helpers');
// require more modules/folders here!

// var actions = {
//   'GET': 
// }

exports.sendResponse = function(response, data, statusCode) {
  statusCode = statusCode || 200;
  response.writeHead(statusCode, headers);
  response.end(JSON.stringify(data));
};

exports.handleRequest = function (req, res) {
  var statusCode;
  // if (req.method === 'GET') {
  // statusCode = 200;
  var indexHTMLPath = (archive.paths.indexHTML);
  fs.readFile(indexHTMLPath, (err, data) => {
    res.end(data);
  });
  // }
};
