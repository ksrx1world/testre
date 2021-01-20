const ipInfo = require('ipinfo');
const countryData = require('./countryfinder');

module.exports.getIp = (ip) => {
    return new Promise((resolve, reject) => {
        ipInfo(ip).then(data => {
            if(data.status === 404){
                reject ({...data.error, bogon: false})
            }
            else if(data.bogon === true){
                reject({title: 'Bogon IP', bogon: true})
            }
            else{
                countryData.codeExchange(data.country).then(es =>
                {
                    let myjson = {
                        ip: data.ip,
                        org: data.org.split(' ').slice(1).join(' '),
                        asn: data.org.split(' ')[0],
                        hostname: data.hostname,
                        city: data.city,
                        state: data.region,
                        country: es,
                        bogon: false,
                        message: 'data successfully fetched'
                    }
                    resolve(myjson);
                })
                .catch(err => {reject(err)})
            }
            }).catch(err => {
                reject(err);
            })
    })
}



// console.log(codeExchange('US').then(data => {return data}).then(data=> return{data}).catch(err => err))
