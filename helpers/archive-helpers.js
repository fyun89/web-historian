var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var http = require('http');
var request = require('request');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  indexHTML: path.join(__dirname, '../web/public/index.html'),
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {
  fs.readFile(exports.paths.list, (err, data) => {
    callback(data.toString('utf-8').split('\n'));
    // data.toString('utf-8').split('\n')
  });
};

exports.isUrlInList = function(url, callback) {
  fs.readFile(exports.paths.list, (err, data) => {
    var result = data.includes(url);
    callback(result);
  });

  
};

exports.addUrlToList = function(url, callback) {
  fs.writeFile(exports.paths.list, url + '\n', (err) => {
    // console.log(url,'<---------------------------------')
    if (err) {
      throw err;
    }
    callback();
  });
};

exports.isUrlArchived = function(url, callback) {
  fs.readdir(exports.paths.archivedSites, (err, files) => {
    if (err) {
      throw err;
    }
    callback(files.includes(url));
  });
};

exports.downloadUrls = function(urls) {
  var newThis = this;
  console.log(urls)
  urls.forEach(function(entry) {
    var entryURL = exports.paths.archivedSites + '/' + entry;
    exports.isUrlArchived(entry, function(boolean) {
      if (!boolean) {
        request('http://' + entry + '/', (err, siteHTML) => {
          err ? console.log(err) : null;
          fs.appendFile(`./test/testdata/sites/${entry}`, siteHTML.body, (err) => {
            err ? console.log(err) : null 
          });
        });
      }
    });
  });
};

