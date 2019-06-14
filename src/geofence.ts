import { SocketReaderService } from "./services/socket-reader-service";
import { logger } from "./services/logger";

import { Point } from 'geojson'
var geotools = require('geojson-tools');

export class Geofence{

    private socket:SocketReaderService;

    constructor(socket:SocketReaderService){
        this.socket = socket;

        socket.on('transaction',(transaction, object)=>{
            logger.debug('transaction:'  + JSON.stringify(transaction));
            logger.debug('object' + JSON.stringify(object));

            //geotools.getDistance([]);
            
        })
    }
}