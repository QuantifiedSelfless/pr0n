var StaticServer = require('static-server');

var server = new StaticServer({
    rootPath: './dist',            // required, the root of the server file tree 
    name: 'quantifiedSelf',        // optional, will set "X-Powered-by" HTTP header 
    port: 7070,                    // optional, defaults to a random port 
    host: '0.0.0.0',               // optional, defaults to any interface 
    followSymlink: true,           // optional, defaults to a 404 error 
    index: 'index.html',           // optional, defaults to 'index.html' 
    error404page: '404.html'       // optional, defaults to undefined 
});

module.exports = server;
