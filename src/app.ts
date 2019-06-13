import { Application } from 'express';

const express = require( "express" );
const app:Application = express();
const port = 3000


var fs = require('fs');
 

 

app.get([/\/$/, /.*\.html$/], function (req, res) {
    var filename = './html/'  + req.path;
    filename += filename.endsWith('/')? 'index.html': '';
    fs.readFile(filename, function (_:any, data:any) {
        fs.readFile('./logs/.gitignore', 'utf8', function(err:any, contents:any) {
            res.send(data.toString().replace("[[FILECONTENTS]]",contents));
        });
    });

});

app.use(express.static('./html'));

var http = require('http').Server(app);
http.listen(port);
var io = require('socket.io')(http);


fs.watch('./html', { recursive:true }, function () {
  io.emit('file-change-event');
});
fs.watch('./logs', { recursive:true }, function () {
  io.emit('file-change-event');
});

console.log('Running on port ' + port);