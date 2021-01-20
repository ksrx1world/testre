const codeData = require('./codes');

module.exports.codeExchange = (code) => {
    return new Promise((resolve, reject)=> {
        codeData.forEach(element => {
            if(code && element.code === code){
                resolve(element.name);
            }
        });
        reject({err: 'code not found'});  
    })
     
}