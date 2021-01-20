const router = require('express').Router();
const ipfinder = require('../function/ipfinder')
const dns = require('dns');
const RequestIp = require('@supercharge/request-ip')

const getHostname = (ip) => {
    return new URL(ip).hostname;
  }



let ipregex = '((^\s*((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))\s*$)|(^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$))'
let domainregex = '^((ftp|http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$'


router.route('/ip').post((req,res) => {
    try{
    let {ipaddrdata} = req.body
    if(ipaddrdata){
    if(ipaddrdata.match(ipregex)){
      ipfinder.getIp(ipaddrdata).then(data => {res.json(data)}).catch(err => {res.json(err)})
    }
    else if(ipaddrdata.match(domainregex)){
       if(ipaddrdata.slice(0,5).includes('http'))
       {
            host=getHostname(ipaddrdata);
            dns.lookup(host, (err,address) => {
                if(address) {
                    ipfinder.getIp(address).then(data => {res.json(data)}).catch(err => {res.json(err)})
                }
                else{res.json({message:'Unable to resolve hostname'})}
            })
       }
       else{
            host = getHostname(`https://${ipaddrdata}`)
            dns.lookup(host, (err,address) => {
                if(address) {
                    ipfinder.getIp(address).then(data => {res.json(data)}).catch(err => {res.json(err)})
                }
                else{res.json({message:'Unable to resolve hostname'})}
            })
       }
    }
    else{
        res.json({msg: 'please enter correct Hostname or IP Address'})
    }
    
}
else{
    res.json({msg: "fetching failed"})
}
}
    catch(err){
       console.log(err)
    } 
})

router.route('/myip').get((req,res) => {
    let myip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    res.json({ip: myip})
})



module.exports = router
  