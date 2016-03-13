'use strict';

var schedule = require('node-schedule');
var Logger = require('../lib/logger');
var Task = require('../controllers/task/job');
var CronJob = require('cron').CronJob;

var cronJob = function() {
    return {
        configJob: function(config) {

            /*try {
                new CronJob(config.cron_syncpolicy, function() {
                    console.log('this should not be printed');
                })
            } catch(ex) {
                console.log("cron pattern not valid");
            }*/

            //上传保单
            schedule.scheduleJob(config.cron_syncpolicy, function(){
                //只允许一个端口跑任务
                Task.syncPolicyToCoreSystem();
                if(global.port == "8001"){

                }
            });

            //注销保单
            schedule.scheduleJob(config.cron_cancelpolicy, function(){
                //只允许一个端口跑任务
                Task.cancelPolicy();
                if(global.port == "8001") {

                }
            });
        }
    }
};

module.exports = cronJob();
