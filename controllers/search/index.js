var auth = require('../../lib/auth');
var Interface = require('../../models/Interface');
var Search = require('../../models/Search');
var _ = require('underscore');
var Logger = require('../../lib/logger');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

module.exports = function(router) {
    var roleList = ['ROLE_ADMIN','ROLE_USER'];

    router.get('/', auth.isAuthenticated(roleList), function(req, res, next) {
        var model = {
            redirect: '/search/index'
        };
        res.json(model);
    });

    router.get('/index', auth.isAuthenticated(roleList), function(req, res, next) {
        var page = 1;
        if (req.query.page) {
            page = req.query.page;
        }






        var act_type = req.query.act_type;
        var campus = req.query.campus;
        var  set_time = req.query.set_time;
        var  start = req.query.start;
        var  min = req.query.min;
        var  max = req.query.max;
        var condition = {}
        if (campus) {
            condition['campus'] =campus
        }
        if (set_time) {
            condition['time'] =start+"-"+set_time;
        }
        if (min){
           var min1 = parseInt(min);

        }
        if (max){
            var max1 = parseInt(max);

        }
        if(max1) {
            condition['content'] ={$gte : min1}
        }
        if (act_type) {
            condition['act_type'] =new RegExp(act_type)
        }
        console.log(condition);
        Search.paginate(condition, page, 10, function(err, pageCount, item) {
            if (err) {
                return res.json({
                    err: err
                });
            }
            var model = {
                title: '接口列表',
                item: item,
                page: page,
                act_type: act_type,
                pageCount: pageCount
            };
            model.view = 'search.index';
            res.json(_.extend(model, res.locals.menuInit));
        });
    });

};
