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

    }

    public static getStream(){
        if(!this.instance){
            this.instance = new SocketReaderService();
        }
        return this.instance;
    }

}