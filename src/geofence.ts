import { SocketReaderService } from "./services/socket-reader-service";
import { logger } from "./services/logger";

import { Geometry, Point } from 'geojson'
var geotools = require('geojson-tools');

export class Geofence{

    private socket:SocketReaderService;

    private distance(lat1:number,lon1:number,lat2:number,lon2:number) :number {
        var R = 6371; // km (change this constant to get miles)
        var dLat = (lat2-lat1) * Math.PI / 180;
        var dLon = (lon2-lon1) * Math.PI / 180;
        var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180 ) * Math.cos(lat2 * Math.PI / 180 ) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        var d = R * c;
        return Math.round(d*1000);
    }

    private makePoint(point:any) : Point{
        //logger.debug(typeof point);
        if(typeof point === 'string'){
            return JSON.parse(point);
        }else{
            return {
                type: "Point",
                coordinates:[point[0] , point[1]]
            }
        }
    }

    constructor(socket:SocketReaderService){
        this.socket = socket;

    

        socket.on('transaction',(transaction, object)=>{
            logger.debug('transaction:'  + JSON.stringify(transaction));
            logger.debug('object' + JSON.stringify(object));

            let point:Point = this.makePoint(object.coordinate);
            let otherPoint:Point = this.makePoint([
                4.401430,
                51.225129
            ])

            logger.debug(JSON.stringify(point));
            logger.debug(JSON.stringify(otherPoint));
            
            let distance = this.distance(point.coordinates[0], point.coordinates[1], otherPoint.coordinates[0], otherPoint.coordinates[1]);
            
            if(distance < 1000){
                logger.debug("arrived");
            }

            logger.debug(distance.toString() + ' meters distance (' + distance/1000  + ' km)');
            
        })
    }
}
