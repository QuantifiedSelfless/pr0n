var ejs    = require('ejs'),
    fs     = require('fs'),
    static = require('node-static');

var file = new static.Server('./dist');

var port = process.argv[2] || 7070

process.env.NODE_ENV = process.env.NODE_ENV || 'production';

require('http').createServer(function (request, response) {
    request.addListener('end', function () {
        if (request.url == '/environment.json') {
          fs.readFile('dist/environment.json', 'utf8', function(err, data) {
              var str = ejs.render(data, { NODE_ENV: process.env.NODE_ENV })
              response.end(str);
          });

        } else {
          file.serve(request, response);

        }
    }).resume();
}).listen(port);
