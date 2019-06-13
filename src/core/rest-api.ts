import * as http from 'http';

import { config } from '../config';
import { BCScheme } from './bc-scheme';
import { loggerC } from './logger';
import { sleep } from './sleep';
import { serialize } from './serialize';

var md5 = require('md5');

const keepAliveAgent = new http.Agent({ keepAlive: true, maxSockets: 1});


const uuidsInTransit:{
    [uuid: string]: {
        data: BCScheme,
        microtime: number
    }[]
}={

};


export class RESTApi{

    public loginInitiated: boolean = false;

    private static instance: RESTApi | null = null;

    private bearer : string | null = null;


    public async post(scheme:BCScheme, microtime:number = 0){
        let post_data = {
            fcn: 'create',
            args:[
                scheme.docType,
                scheme.id,
                JSON.stringify(scheme)
            ]
        };
        loggerC.debug('POST w/: ' + JSON.stringify(post_data));
        return this.doQueuedRequest(scheme.id, 'POST',post_data, microtime);
    }

    public async get(docType:string, uuid:string){
        var data = {
            fcn:'get',
            args:[
                docType,
                uuid
            ]
        };
        loggerC.debug('Doing GET request w/: ' + JSON.stringify(data));
        return this.doRequest(data, false, true);
    }

    public async put(scheme:BCScheme, microtime:number = 0){
        let post_data = {
            fcn: 'put',
            args:[
                scheme.docType,
                scheme.id,
                JSON.stringify(scheme)
            ]
        };
        loggerC.debug('PUT w/: ' + JSON.stringify(post_data));
        return this.doQueuedRequest(scheme.id, 'PUT',post_data, microtime);
    }



    public static async getConnection(){
        loggerC.debug('REST API: Connection requested');
        return new Promise<RESTApi>(async (resolve,reject)=>{
            if(this.instance === null){
                this.instance = new RESTApi(); 
            }
            if(this.instance.getLoggedInStatus() === false && this.instance.loginInitiated === false){
                this.instance.loginInitiated = true;
                loggerC.debug('Setting connection ...');
                await this.instance.login();
            }
            else if(this.instance.getLoggedInStatus() === false && this.instance.loginInitiated === true){
                let cumTime = 0;
                while(this.instance.getLoggedInStatus() !== true && cumTime < 1000 * 60){
                    await sleep(100);
                    cumTime+=100;
                }
                if(!this.instance.getLoggedInStatus()){
                    loggerC.error('RESTAPI instance was still not logged in after 60s.');
                }
            }else{
                loggerC.debug('Connection already set...');
            }
            resolve(this.instance);
        });
    }

    public logout(): boolean{
        loggerC.debug('Logging out...');
        this.loginInitiated = false;
        this.bearer = null;
        return this.bearer === null;
    }
    public getLoggedInStatus(): boolean{
        return this.bearer !== null;
    }
    private getPostOptions(postData:any, userService:boolean, isGet: boolean) : http.RequestOptions{
        let headers:any = {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(JSON.stringify(postData)),

        }
        if(userService == false){
            headers['Authorization'] = 'Bearer ' + this.bearer
        }
        let options : http.RequestOptions = {
            agent: keepAliveAgent,
            host: userService ? config.user_service_host : config.rest_service_host,
            port: userService ? config.user_service_port : config.rest_service_port,
            path: userService ? config.user_service_path : config.rest_service_path,
            method: 'POST',
            headers: headers
        };
        if(isGet === true){
            var queryString = serialize(postData);
            loggerC.debug('Serialization yielded '  + JSON.stringify(queryString));
            options.path = (userService ? config.user_service_path : config.rest_service_path) + '?' + queryString;
            options.method ='GET';
        }
        return options;
    }

    private doQueuedRequest(uuid:string, method:'PUT' | 'POST',data:any, microtime :number){
        return new Promise<any>(async (resolve,reject)=>{
            let transitObject = {
                microtime: microtime,
                data: data
            };
    
            if(!uuidsInTransit[uuid]){
                uuidsInTransit[uuid]=[];
            }
            if(method === 'POST'){
                uuidsInTransit[uuid].unshift(transitObject);
            }
            else{
                uuidsInTransit[uuid].push(transitObject);
            }

            await sleep(200);

            /**
             * Sort the whole uuidsInTransit by microtime and wait accordinly
             */
            let lowerMicros = 0;
            Object.keys(uuidsInTransit).forEach((key, index) => {
                uuidsInTransit[key] = uuidsInTransit[key].sort((t1, t2) => {
                    if (t1.microtime > t2.microtime) { return 1; }
                    if (t1.microtime < t2.microtime) { return -1; }
                    return 0;
                });
                uuidsInTransit[key].forEach((value)=>{
                    lowerMicros+= value.microtime < microtime ? 1 : 0;
                })
            });
            
            /**
             * add 100ms delay for each microtime that is lower
             */
            console.debug('Adding a delay of ' + 100 * lowerMicros + ' to ' + uuid);
            await sleep(100 * lowerMicros);
            

            /**
             * We will not push a 2nd transaction to the BC until we are the first in line
             */
            let placeInLine : number = -1;
            while(uuidsInTransit[uuid].length > 1 && uuidsInTransit[uuid].indexOf(transitObject) !== 0){
                if(uuidsInTransit[uuid].indexOf(transitObject) !== placeInLine){
                    loggerC.debug('Waiting queue for ' + uuid + ' is ' + uuidsInTransit[uuid].length + ' / i am nr. ' +  uuidsInTransit[uuid].indexOf(transitObject) + ' w/ microtime ' + microtime);
                    placeInLine = uuidsInTransit[uuid].indexOf(transitObject);
                }
                await sleep(200);
                
                console.log('\x1b[35m%s\x1b[0m', "\t\t\twwwwwwwww \t" + uuid + " (" + microtime + ") waiting a bit."); 
            }
            loggerC.debug('Now doing request for ' + uuid);
            this.doRequest(data).then((data)=>{
                loggerC.debug('The request for  ' + uuid + ' resolved.');
                resolve(data);
            }).catch((err)=>{
                loggerC.error('The request failed. ' + err);
                reject(err);
            }).finally(async ()=>{
                /**
                 * remove the object from transit after 100ms
                 */
                await sleep(100);
                loggerC.debug('Removing object from queue ' + uuid);
                if(uuidsInTransit[uuid].indexOf(transitObject)>-1){
                    uuidsInTransit[uuid].splice(uuidsInTransit[uuid].indexOf(transitObject),1);
                }
                if(uuidsInTransit[uuid].length===0)
                {
                    delete uuidsInTransit[uuid];
                }
            })
        });
    }

    private async doRequest(data:any, userService: boolean = false, isGet :boolean = false){
        return new Promise<any | string>((resolve,reject)=>{
            let postOptions = this.getPostOptions(data, userService, isGet);
            var post_req = http.request(postOptions,function(res) {
                if(data.args){
                    loggerC.debug('Actual request for ' + data.args[0]);
                }
                
                res.setEncoding('utf8');

                res.on('data', function (chunk) {
                    userService === true ? loggerC.debug('Got data from server: ' + chunk.toString().substr(-10)) : loggerC.debug('Got data from server: ' + chunk.toString());
                    let serverData=JSON.parse(chunk);
                    if(!userService){
                        // response will be a txId normally - stored in serverData['_transaction_id'];
                        loggerC.debug('Parsed data was ' + JSON.stringify(serverData));
                    }
                    resolve(serverData);
                });
                res.on('error',function(e){
                    loggerC.error('error-in-transmit ' + e.toString());
                    reject(e);
                });
                
            });

            post_req.on('error',(err)=>{
                loggerC.error('error-on req' + err.toString());
                reject(err);
            })
            post_req.setTimeout(10000,()=>{
                reject('Request timed out.');
            })
        
            
            post_req.write(JSON.stringify(data));
            post_req.end();
        });
    }


    private login() : Promise<boolean> {
        loggerC.debug('Login requested');
        return new Promise(async (resolve,reject)=>{
            let post_data = {
                username:config.bc_rest_api_user,
                password:config.bc_rest_api_password,
            };
            await this.doRequest(post_data,true).then((bearer)=>{
                loggerC.debug('Login OK');
                this.bearer = bearer;
            }).catch(err=>{
                loggerC.error('Login Not OK');
            });
            resolve();
        });
    }
}