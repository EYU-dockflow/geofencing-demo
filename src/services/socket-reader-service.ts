import io from 'socket.io-client';
import { logger } from './logger';
import { RESTApi } from '../core/rest-api';
import { config } from '../config'
import { EventEmitter } from 'events';

export class SocketReaderService extends EventEmitter{
    private static instance:SocketReaderService;

    private io:SocketIOClient.Socket;

    constructor(){
        super();
        var self = this;
        var url = 'ws://' + config.bc_websocket_host + ':' + config.bc_websocket_port + '';
        this.io=io.connect(url,{
            transports: ['websocket']
        });


        this.io.on('connect', function(){
            logger.debug('Connected to Blockchain socket stream.');
        });


        this.io.on('chaincodeevent', function(data:any){
            if(data && data.event){
                //self.aHandlerObject.handleData(data.event);
                data = data.event;
                
                if(data.payload && data.payload.schema && data.payload.id && data.event_name){
                     //logger.debug('Event: "' + data.event_name + "\" for a "  + data.payload.schema + " with uuid: \""+ data.payload.id.substr(0,36) +"\"");
                     //logger.debug('<span style="color:grey;">' + JSON.stringify(data) + '</span>');
                     RESTApi.getConnection().then((conn)=>{
                        conn.get(data.payload.schema,data.payload.id).then((obj)=>{
                            //logger.debug('Object was ' + JSON.stringify(JSON.parse(obj)));
                            logger.debug('<span style="color:red;font-weight:bold;">A chaincode event happened - txId: ' + (data.tx_id ? data.tx_id : '-no tx id-') + '</span>');
                            self.emit('transaction',data,JSON.parse(obj));
                        }).catch((err)=>{
                            logger.error('Could not get object from REST API ' + err);
                        });
                     }).catch((err)=>{
                         logger.error('Could not get connection for REST API' + err);
                     });
                }
            }
            
        });
        this.io.on('chainblock', function(data:any){
           logger.debug('<span style="color:green;font-weight:bold;">🎉 A new block was pushed to the blockchain ---- ' +  data.header.number + ' / ' + data.header.data_hash + '</span>')
        });
        this.io.on('error',(err:any)=>{
            logger.debug("Error on the socket" + JSON.stringify(err));
        })
        this.io.on('disconnect', function(ev:any){
            console.log('Socket stream closed.');
        });

    }



    public static getStream(){
        if(!this.instance){
            this.instance = new SocketReaderService();
        }
        return this.instance;
    }

}