'use strict';
/**
 * Created by libinbin on 2015-10-31.
 */

var async = require('async');
var _ = require('underscore');
var moment = require('moment');
var Logger = require('../../lib/logger');
var restClient = require('../../lib/restClient/restClient');
var LifeInsurance = require('../../models/LifeInsurance');
var LifeInsuranceChange = require('../../models/LifeInsuranceChange');


//同步保单至核心系统
exports.syncPolicyToCoreSystem = function(policyNo,spcb){

    var condition = {taskStatus:'W'};
    if(policyNo) condition.policyNo = policyNo;

    LifeInsurance.find(condition).sort( { "inputDate": 1} ).limit(50).exec(function (err, items) {
        console.log(moment().format("YYYY-MM-DD HH:mm:ss") +"|cron_syncpolicy|"+ JSON.stringify(items));
        if(items && items.length > 0) {

            var reqObj = {
                policyList:[]
            }
            items.forEach(function(policyInfo){
                reqObj.policyList.push({"policyNo":policyInfo.policyNo});
            });
            restClient.syncPolicyToCoreSystem(reqObj, function (err, obj) {
                if (err) {
                    Logger.error(err);
                    if(spcb)spcb(err);
                    return;
                }
                if(spcb) spcb();
                Logger.logger().log('info',moment().format("YYYY-MM-DD HH:mm:ss") + "|"+JSON.stringify(obj));
            });
        }else{
            if(spcb)spcb();
            Logger.logger().log('info', moment().format("YYYY-MM-DD HH:mm:ss")+'|'+' no result to async');
        }

    });
}


//保单注销
exports.cancelPolicy = function(){

    //多个函数依次执行,每一个函数产生的值，都将传给下一个函数。如果中途出错，后面的函数将不会被执行。错误信息以及之前产生的结果，将传给waterfall最终的callback
    async.waterfall([
        function(cb){
            //查询待注销的保单
            LifeInsuranceChange.find({policyStatus:"C2"}).sort( { "createdAt": 1} ).limit(50).exec(function (err, items) {
                if(items && items.length > 0) {
                    cb(null, items);
                }else{
                    //没有待注销的保单结束流程到callback
                    cb("没有待注销的保单!");
                }
            });
        },
        function(items,cb){

            items.forEach(function(life,index){
                //判断保单状态是否S，S表明保单已上传核心，只有上传核心才能注销
                LifeInsurance.findOne({"policyNo":life.policyNo},function(err,oneLife){
                    //对象为空表示是以前的历史保单,也需要注销
                    if( !oneLife || oneLife.taskStatus == "S"){
                        //调用接口
                        var reqObj = {};
                        reqObj.waterNo = life.waterNo;
                        reqObj.policyNo = life.policyNo;
                        reqObj.productCode = life.productCode;
                        reqObj.rationType = life.rationType;
                        reqObj.startDate = life.startDate;
                        reqObj.endDate = life.endDate;
                        reqObj.premium = life.premium;
                        reqObj.cancelReason = life.cancelReason;

                        console.log(moment().format("YYYY-MM-DD HH:mm:ss") +"|reqObj:"+JSON.stringify(reqObj));
                        restClient.withdrawInsurance(reqObj, function (err, obj) {
                            if (err) {
                                Logger.error(err);
                                return;
                            }
                            console.log(moment().format("YYYY-MM-DD HH:mm:ss") + "|respObj:" + JSON.stringify(obj));
                            if(obj.retCode == "00"){
                                LifeInsuranceChange.update({"policyNo":life.policyNo},{'$set':{"policyStatus":"C1"}},function(err){
                                    if(err){
                                        Logger.error(err);
                                    }
                                });
                            }
                        });
                    }
                    console.log(items.length +"|"+index);
                    if(items.length == (index+1)){
                        cb(null,items);
                    }
                });
            });
        }
    ],function(err,result){
        console.log(err+'|end.............');
    });
}
