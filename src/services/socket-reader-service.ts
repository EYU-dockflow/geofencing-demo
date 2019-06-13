import io from 'socket.io-client';
import { logger } from './logger';

const config=require('../../config');

export class SocketReaderService{
    private static instance:SocketReaderService;

    private io:SocketIOClient.Socket;

    constructor(){
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
                logger.debug('A chaincode event happened - txId: ' + (data.tx_id ? data.tx_id : '-no tx id-'));
                if(data.payload && data.payload.schema && data.payload.id){
                     logger.debug(data.payload.schema + " / "+ data.payload.id.substr(0,36) +" )");
                }
            }
            
        });
        this.io.on('chainblock', function(data:any){
           logger.debug('A new block was pushed to the blockchain ---- ' +  data.header.number + ' / ' + data.header.data_hash)
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