var restify = require('restify');

var restClient = function(){
    var client;
    return {
        config: function(url) {
            client = restify.createJsonClient({
                url: url.rest
            });
        },
        //同步保单数据到核心系统
        syncPolicyToCoreSystem: function(reqObj, cb) {
            client.post('/uiep/manage/newbiz/policyUploadToCoreSystem', reqObj, function(err, req, res, obj) {
                cb(err, obj);
            });
        },
        //连接核心系统注销保单
        withdrawInsurance:function(reqObj,cb){
            client.post('/uiep/manage/newbiz/policyCancel',reqObj,function(err,req,res,obj){
                cb(err,obj);
            })
        }
    }
};

module.exports = restClient();
