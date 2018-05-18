var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var headers = require('./http-helpers');
var url = require('url');
// require more modules/folders here!

// var actions = {
//   'GET': 
// }

exports.sendResponse = function(response, data, statusCode) {
  statusCode = statusCode || 200;
  response.writeHead(statusCode, headers.headers);
  response.end(data);
};

exports.handleRequest = function (req, res) {
  var statusCode;
  // console.log(req, '<=====================');
  // url.parse(req.url).pathname === "/"
  if (req.method === 'GET') {
    if (url.parse(req.url).pathname === '/') {
      var indexHTMLPath = (archive.paths.indexHTML);
      fs.readFile(indexHTMLPath, (err, data) => {
        exports.sendResponse(res, data);
        // res.end(data);
      });
    } else {
      var enteredUrl = url.parse(req.url).pathname.slice(1);
      archive.isUrlArchived(enteredUrl, function(boolean) {
        if (boolean) {
          fs.readFile(`${archive.paths.archivedSites}/${enteredUrl}`, (err, archivedFile) => {
            exports.sendResponse(res, archivedFile)
            // res.end(archivedFile);
          });
        } else {
          if (!enteredUrl.startsWith('www')) {
            exports.sendResponse(res, 'Not Found', 404);
            return;
          }
          archive.addUrlToList(enteredUrl, function() {
            fs.readFile(`${archive.paths.siteAssets}/loading.html`, (err, loadingFile) => {
              exports.sendResponse(res, loadingFile, 302);
              // res.end(loadingFile);
            });
          });
        }
      });
    }
  } else if (req.method === 'POST' && url.parse(req.url).pathname === '/') {
    // Store url that client wants in a variable.
    var urlData = '';
    req.on('data', function(chunk) {
      urlData += chunk;
    });

    req.on('end', function() {
      var inputUrl = urlData;
      archive.isUrlArchived(inputUrl, function(boolean) {
        if (boolean) {
          fs.readFile(`${archive.paths.archivedSites}/${inputUrl}`, (err, archivedFile) => {
            exports.sendResponse(res, archivedFile)
            // res.end(archivedFile);
          });
        } else {
          archive.addUrlToList(inputUrl, function() {
            fs.readFile(`${archive.paths.siteAssets}/loading.html`, (err, loadingFile) => {
              exports.sendResponse(res, loadingFile, 302);
              // res.end(loadingFile);
            });
          });
        }
      });
    });   
    // Check if 'isURLArchived' (aka check if it exists)
  } else {
    
  }
};
