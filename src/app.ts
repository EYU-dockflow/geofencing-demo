import { Application } from 'express';
import { SocketReaderService } from './services/socket-reader-service';
import { logger } from './services/logger';

const express = require( "express" );
const app:Application = express();
const port = 3000

app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
  res.setHeader("Pragma", "no-cache"); // HTTP 1.0.
  res.setHeader("Expires", "0"); // Proxies.
  next();
});

var io = require('socket.io');


var fs = require('fs');
 

app.use(express.static('./html'));

var http = require('http').Server(app);
http.listen(port);
var io = io(http,{
  pingInterval: 1000
});

logger.debug('Server running on port ' + port);

console.log('Running file watcher.')

function sendLog(){
    fs.readFile('./logs/syncer.log', 'utf8', function(err:any, contents:any) {
      console.log('Emitting filechange');
      io.emit('file-change-event',contents);
    });
}
fs.watch('./logs/syncer.log', ()=>{
  sendLog();
});
setInterval(()=>{
  sendLog();
},2000)





setInterval(()=>{
  logger.debug('SPAM');
},2000)

let socket = SocketReaderService.getStream();