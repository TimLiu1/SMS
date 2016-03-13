var auth = require('../../lib/auth');
var Party = require('../../models/Party');
var firstpage = require('../../models/firstpage');
var Classroom = require('../../models/Classroom');
var Audit = require('../../models/Audit');
var Activityroom = require('../../models/Activityroom');
var Announce = require('../../models/Announce');
var Playground = require('../../models/Playground');
var _ = require('underscore');
var Logger = require('../../lib/logger');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var NodeRSA = require('node-rsa');
var crypto = require('crypto');

module.exports = function(router) {
    var roleList = ['ROLE_ADMIN','ROLE_USER'];

    router.get('/', auth.isAuthenticated(roleList), function (req, res, next) {
        var model = {
            redirect: '/area_book/index'
        };
        res.json(model);
    });


    router.get('/index', auth.isAuthenticated(roleList), function (req, res, next) {
        var page  = 1
        if(req.query.page){
            page = req.query.page;
        }
        var condition = {}
        var campus = req.query.campus;
        var  set_time = req.query.set_time;
        var  start = req.query.start;
        if (campus) {
            condition.campus =campus
        }
        if (set_time) {
            condition.time =start+'-'+set_time
        }
        Classroom.paginate(condition,page,10,function(err,pageCount,item,dataCount){
            console.log("查询成功"+dataCount+">>>"+pageCount)
            var model = {
                item:item,
                page:page,
                pageCount:pageCount,
                campus:campus
                //
            }
            model.view = 'area_book.index';
            res.json(_.extend(model, res.locals.menuInit));
        })




    });












    router.post('/:id/new', auth.isAuthenticated(roleList), function(req, res, next) {
        var classroom = req.body.classroom;
        var id = req.params.id;
        console.log("你好");
        console.log(classroom);

        Classroom.findById(id, function(err, item) {
            var model = {
                message: 'ok'
            };
            if (err || !classroom) {
                model.err = '预定出错';
                return res.json(model);
            }
            if(classroom.status == "已被预订"){
                model.err = "预定失败";
                return res.json(model);
            }else{
                classroom.status = "已被预订"
            }
            _.extendOwn(item, classroom);
            item.save({
                new: true
            }, function(err, updatedItem) {
                if (err) {
                    model.err = err.toString();
                    return res.json(model);
                }
                model.showMessage = '预定成功';
                model.item = updatedItem;
                res.json(model);
            });
        });
    });
    router.post('/:id/act_new', auth.isAuthenticated(roleList), function(req, res, next) {
        var activity = req.body.activity;
        var id = req.params.id;
        console.log(activity);
        console.log("你好")
        Activityroom.findById(id, function(err, item) {
            var model = {
                message: 'ok'
            };
            if (err || !activity) {
                model.err = '预定出错';
                return res.json(model);
            }
            if(activity.status == "已被预订"){
                model.err = '预定出错';
                return res.json(model);
            }else{
                activity.status = "已被预订"
            }
            _.extendOwn(item, activity);
            item.save({
                new: true
            }, function(err, updatedItem) {
                if (err) {
                    model.err = err.toString();
                    return res.json(model);
                }
                var audit = item;
                var auditModel = new Audit(audit);
                auditModel.save();
                model.showMessage = '预定成功';
                model.item = updatedItem;
                res.json(model);
            });
        });
    });
    router.post('/:id/play_new', auth.isAuthenticated(roleList), function(req, res, next) {
        var activity = req.body.activity;
        var id = req.params.id;
        console.log(activity);
        console.log("你好")
        Playground.findById(id, function(err, item) {
            var model = {
                message: 'ok'
            };
            if (err || !activity) {
                model.err = '预定出错';
                return res.json(model);
            }
            if(activity.status == "已被预订"){
                model.err = '预定出错';
                return res.json(model);
            }else{
                activity.status = "已被预订"
            }
            _.extendOwn(item, activity);
            item.save({
                new: true
            }, function(err, updatedItem) {
                if (err) {
                    model.err = err.toString();
                    return res.json(model);
                }
                model.showMessage = '预定成功';
                model.item = updatedItem;
                res.json(model);
            });
        });
    });

    router.post('/:id/ann_new', auth.isAuthenticated(roleList), function(req, res, next) {
        var activity = req.body.activity;
        var id = req.params.id;
        console.log(activity);
        console.log("你好")
        Announce.findById(id, function(err, item) {
            var model = {
                message: 'ok'
            };
            if (err || !activity) {
                model.err = '预定出错';
                return res.json(model);
            }
            if(activity.status == "已被预订"){
                model.err = '预定出错';
                return res.json(model);
            }else{
                activity.status = "已被预订"
            }
            _.extendOwn(item, activity);
            item.save({
                new: true
            }, function(err, updatedItem) {
                if (err) {
                    model.err = err.toString();
                    return res.json(model);
                }
                model.showMessage = '预定成功';
                model.item = updatedItem;
                res.json(model);
            });
        });
    });
    router.get('/classroom', auth.isAuthenticated(roleList), function (req, res, next) {
        var model = {
            redirect: '/area_book/index'
        };
        res.json(model);


    });

    router.get('/searchClassroom', auth.isAuthenticated(roleList), function (req, res, next) {
        var page  = 1
        if(req.query.area_school){
            page = req, query.page
        }
           var condition = {}
            area_school = req, query.area_school
            status = req, query.status

        if (area_school) {
            condition['area_school'] = area_school;
        }
        if (status) {
            condition['status'] = status;
        }

        var page = 1;
        console.log("are you coming ok");
        firstpage.paginate({}, page, 10, function(err, pageCount, items) {
            console.log("are you coming")
            console.log(items);
            var model = {

            }
            model.view = 'area_book.index';
            res.json(_.extend(model, res.locals.menuInit));
        })


    });

    router.get('/activityroom', auth.isAuthenticated(roleList), function (req, res, next) {
        var page  = 1
        if(req.query.page){
            page = req.query.page;
        }
        var condition = {}
        var act_type = req.query.act_type;
        var campus = req.query.campus;
        var  set_time = req.query.set_time;
        var  start = req.query.start;
        if (campus) {
            condition['campus'] =campus
        }
        if (act_type) {
            condition['act_type'] =act_type
        }
        if (set_time) {
            condition['time'] =start+'-'+set_time
        }
        console.log(condition)
        Activityroom.paginate(condition,page,10,function(err,pageCount,item,dataCount){
            console.log("查询成功"+dataCount+">>>"+pageCount)
            var model = {
                item:item,
                page:page,
                pageCount:pageCount,
                start:start,
                set_time:set_time,
                campus:campus,
                act_type:act_type
                //
            }
            model.view = 'area_book.activity';
            res.json(_.extend(model, res.locals.menuInit));
        })

    });
    router.post('/act_new', auth.isAuthenticated(roleList), function(req, res, next) {
        var activityOne = req.body.activity;
        var activity = {};
        activity.campus = activityOne.campus;
        activity.act_type = activityOne.act_type;
        activity.act_room = activityOne.act_room;
        activity.content = "120";
        activity.time = activityOne.start+"-"+activityOne.set_time;
        var i = 0;
        Activityroom.find({},function(err,data) {
            console.log(data)
            data.forEach(function (e) {
                if (activity.campus == e.campus && activity.class == e.class && activity.time == e.time) {
                    i=1;
                }
            })
            if(i==0){
                var activityroomModel = new Activityroom(activity);
                activityroomModel.save(function (err) {
                    var model = {
                        message: 'ok'
                    };
                    if (err) {
                        model.err = err;
                        return res.json(model);
                    }
                    console.log("are you ok");
                    var page = 1;
                    Activityroom.paginate({}, page, 10, function (err, pageCount, items) {
                        if (err) {
                            return res.json({
                                err: err
                            });
                        }

                        model.title = '';
                        model.items = items;
                        model.page = page;
                        model.pageCount = pageCount;
                        model.view = 'area_book.activity';
                        model.showMessage = 'success';
                        res.json(model);
                    }, {
                        sortBy: {
                            category: 1
                        }
                    });
                })

            }else{
                var page = 1;
                Activityroom.paginate({}, page, 10, function (err, pageCount, items) {
                    if (err) {
                        return res.json({
                            err: err
                        });
                    }
                    var model = {};
                    model.title = '�ӿ��б�';
                    model.items = items;
                    model.page = page;
                    model.pageCount = pageCount;
                    model.view = 'area_book.activity';
                    model.showMessage = 'failed';
                    res.json(model);
                }, {
                    sortBy: {
                        category: 1
                    }
                });

            }

        });
    });

    router.get('/act_type', auth.isAuthenticated(roleList), function (req, res, next) {
        Activityroom.distinct("act_room",function(err,item){
            var model = {
                item:item,
            }
            model.view = 'area_book.activity';
            res.json(_.extend(model, res.locals.menuInit));
        })

    });
    router.get('/:id/info', auth.isAuthenticated(roleList), function(req, res, next) {
        var id = req.params.id;
        Classroom.findById(id, function(err, item) {
            var model = {
                message: 'ok'
            };
            if (err) {
                model.err = err;
                return res.json(model);
            }
            console.log(item);
            model.item = item;
            res.json(model);
        })
    });
    router.get('/:id/act_info', auth.isAuthenticated(roleList), function(req, res, next) {
        var id = req.params.id;
        console.log("are you coming");
        Activityroom.findById(id, function(err, item) {
            var model = {
                message: 'ok'
            };
            if (err) {
                model.err = err;
                return res.json(model);
            }
            console.log(item);
            model.item = item;
            res.json(model);
        })
    });
    router.get('/:id/play_info', auth.isAuthenticated(roleList), function(req, res, next) {
        var id = req.params.id;
        console.log("are you coming");
        Playground.findById(id, function(err, item) {
            var model = {
                message: 'ok'
            };
            if (err) {
                model.err = err;
                return res.json(model);
            }
            console.log(item);
            model.item = item;
            res.json(model);
        })
    });
    router.get('/:id/ann_info', auth.isAuthenticated(roleList), function(req, res, next) {
        var id = req.params.id;
        Announce.findById(id, function(err, item) {
            var model = {
                message: 'ok'
            };
            if (err) {
                model.err = err;
                return res.json(model);
            }
            model.item = item;
            res.json(model);
        })
    });

    router.get('/playground', auth.isAuthenticated(roleList), function (req, res, next) {
        var page = 1;
        if(req.query.page){
            page = req.query.page;
        }
        var condition = {}
        var act_type = req.query.act_type;
        var campus = req.query.campus;
        var  set_time = req.query.set_time;
        var  start = req.query.start;
        if (campus) {
            condition['campus'] =campus
        }
        if (act_type) {
            condition['act_type'] =act_type
        }
        if (set_time) {
            condition['time'] =start+'-'+set_time
        }
        console.log(condition)
        Playground.paginate(condition,page,10,function(err,pageCount,item,dataCount){
            console.log("查询成功"+dataCount+">>>"+pageCount)
            var model = {
                item:item,
                page:page,
                pageCount:pageCount,
                start:start,
                set_time:set_time,
                campus:campus,
                act_type:act_type
                //
            }
            model.view = 'area_book.playground';
            res.json(_.extend(model, res.locals.menuInit));
        })

    });

    router.get('/publicitycolumn', auth.isAuthenticated(roleList), function (req, res, next) {
        var page = 1;
        if(req.query.page){
            page = req.query.page;
        }
        var condition = {}
        var act_type = req.query.act_type;
        var campus = req.query.campus;
        if (campus) {
            condition['campus'] =campus
        }
        if (act_type) {
            condition['act_type'] =act_type
        }

        Announce.paginate(condition,page,10,function(err,pageCount,item,dataCount){
            console.log("查询成功"+dataCount+">>>"+pageCount)
            var model = {
                item:item,
                page:page,
                pageCount:pageCount,
                campus:campus,
                act_type:act_type
                //
            }
            model.view = 'area_book.publicitycolumn';
            res.json(_.extend(model, res.locals.menuInit));
        })


    });
    router.get('/domestic_installation', auth.isAuthenticated(roleList), function (req, res, next) {
        var page = 1;
        if (req.query.page) {
            page = req, query.page
        }

        var model = {}
        model.view = 'area_book.domestic_installation';
        res.json(_.extend(model, res.locals.menuInit));


    });
}
