var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var CronJob = require('cron').CronJob;
// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.

//worker checks the archives text file and copy it and delete what was inside the text file
//iterate through and download
var job = new CronJob('5 * * * * *', archive.readListOfUrls(function(fileArray) {
  console.log('hello ----------------------------------------->');
  fs.writeFile(`${archive.paths.list}`, '', function(fileArray) {
    archive.downloadUrls(fileArray);
  });
}));

job.start();