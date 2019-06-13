export function serialize(obj:any) : string[] {
    obj = Object.keys(obj).reduce<string[]>(function(a,k){
        if(typeof obj[k] === 'string')
        {
            a.push(k+'='+encodeURIComponent(obj[k]));
        }else{
            a.push(k+'='+encodeURIComponent(JSON.stringify(obj[k])));
        }
        return a
    },[]).join('&')
    return obj;
}