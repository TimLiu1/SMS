var auth = require('../../lib/auth');
var Logger = require('../../lib/logger');
var LifeInsurance = require('../../models/LifeInsurance');
var Task = require('./job');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var _ = require('underscore');

var db = mongoose.connection;
var async = require('async');
var http = require('http');


module.exports = function(router) {

    router.get('/',auth.isAuthenticated('ROLE_ADMIN'),function(req,res,next){
        res.redirect('task/index');
    });

    /***
     *保单列表
     */
    router.get('/index',auth.isAuthenticated('ROLE_ADMIN'),function(req,res,next){

        var page = 1;
        if (req.query.page) {
            page = req.query.page;
        }

        var condition = {};
        var taskStatus = req.query.taskStatus;
        var policyNo = req.query.policyNo;
        if (taskStatus) {
            condition['taskStatus'] = taskStatus;
        }
        if (policyNo) {
            condition['policyNo'] = policyNo;
        }

        LifeInsurance.paginate(condition,page,10,function(err,pageCount,lifes,dataCount){
            if(err){Logger.error(err);return next(err);}
            Logger.info("查询成功",pageCount + ">>>>" + dataCount);

            var model = {
                title:"任务列表",
                items:lifes,
                page:page,
                policyNo:policyNo,
                taskStatus:taskStatus,
                pageCount:pageCount
            }
            model.view = "task.index";
            res.json(_.extend(model, res.locals.menuInit));
        },{
            sortBy:{updatedAt:-1}
        });

    });

    /**
     * 同步保单到核心系统
     */
    router.post('/syncPolicy',auth.isAuthenticated('ROLE_ADMIN'),function(req,res,next){
        var policyNo = req.body.policyNo;
        if(policyNo){
            Task.syncPolicyToCoreSystem(policyNo,function(err,obj){
                if(err){Logger.error(err);res.json({success:false,message:err});return;}
                res.json({success:true});
            });
        }
    });
}
