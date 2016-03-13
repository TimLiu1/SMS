var http=require('http');
var Iconv = require('iconv').Iconv;
var logger = require('../logger');
var utfToGbk = new Iconv('UTF-8', 'GBK');
var imageSystemHelper = require('../imageSystemHelper');


module.exports = function (req, res, next) {
    console.log("req.url:"+req.originalUrl);
   if((req.url.indexOf('Interface_Cluster')>=0||req.url.indexOf('Qmanager')>=0||req.url.indexOf('TransServer')>=0||req.url.indexOf("transServerProject ")>=0||req.url.indexOf('store_down_new')>=0)&&req.isAuthenticated()){
       console.log("req.url:"+req.url);
       //console.log(req);
       var headers=req.headers;
       var options = {
           hostname:imageSystemHelper.getConfig().host,
           port: imageSystemHelper.getConfig().port,
           path:req.originalUrl,
           method: req.method,
           headers: headers
       };

       var paramsStr="";
       var request = http.request(options, function(response) {
           if(req.url.indexOf("store_down_new/ImageDownLoadServlet?type=3")>=0 || req.url.indexOf("pages/view")>=0){
               res.set("Content-Type", "text/html")
               res.set("encoding", "utf-8");
           }
           response.pipe(res);
       });
       request.on('error', function(e) {
           logger.error('problem with request: ' + e.message);
       });
       logger.debug("POST");
       if(req.url.indexOf('GetScanTreeServlet')>=0||req.url.indexOf('ImageReceive')>=0||req.url.indexOf('CreatBatchcodeServlet')>=0||req.url.indexOf("ISerFIleUp")>=0||req.url.indexOf('InitBatchCodeTools')>=0||req.url.indexOf("IImgXmlUpLoadSyn")>=0||req.url.indexOf("GetScanRemarkServlet")>=0){
           logger.debug("POST");
           if(item=="treeInfo"&&params[item]&&params[item]!='null'){

           }
           var params=req.body;
           for(var item in params){
               if(item=="treeInfo"&&params[item]&&params[item]!='null'){
                   logger.debug(params[item]);
                   paramsStr+=item+"="+encodeURIComponent(params[item])+"&";
               }else{
                   paramsStr+=item+"="+params[item]+"&";
               }
           }
           logger.debug(paramsStr);
           if(paramsStr&&paramsStr.length>0){
               request.write(paramsStr);
           }
       }
       request.end();
   }else{
       next();
   }
};