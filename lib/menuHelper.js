"use strict";
var Menu = require('../models/system/Menu');
var Role = require('../models/system/Role');

var cache = require('../lib/cacheHelper');
var Logger = require('../lib/logger');

var counts = {};
var _tempFunc = null;
var menuTree = function(application, callback) {
    _tempFunc = callback;
    var applicationCounter = application + 'counter';

    counts[application] = [];

    Menu.find({
        levelId: '1',
        application: application
    }).
    sort('sortKey').
    exec(function(err, menus) {
        if (menus.length > 0) {
            Logger.log('初始化应用%s菜单树', application);
            counts[applicationCounter] = 0;
            menus.forEach(function(menu) {
                counts[applicationCounter] ++;
                var mInfo = {};
                mInfo.subs = [];
                mInfo.menu = menu;
                //console.log(counts[applicationCounter]);
                _getMenuInfo(applicationCounter, application, mInfo, function(err, menuInfo) {
                    if (err) {
                        //return console.log('err:%s', err);
                        return Logger.error('err:', err);
                    }
                    //console.log(counts[applicationCounter]);
                    counts[application].push(menuInfo);
                    counts[application].sort(function(a, b) {
                        return a.sortKey - b.sortKey;
                    });
                });
                //counts[applicationCounter]--;
            });
        }
    });
};


function _getMenuInfo(applicationCounter, application, mInfo, cb) {
    //counts[menuID]++;
    var node = {};
    node.children = [];
    node.id = mInfo.menu.id;
    node.text = mInfo.menu.name;
    node.sortKey = mInfo.menu.sortKey;
    node.fullUrl = mInfo.menu.fullUrl;
    node.url = mInfo.menu.url;
    node.state = {};
    if (mInfo.menu.levelId === '3') {
        node.state.disabled = true;
    }
    mInfo.menu.children(function(err, children) {
        if (err) {
            return cb(err)
        }
        for (var i = 0, l = children.length; i < l; i++) {
            counts[applicationCounter] ++;
            var mi = {};
            mi.subs = [];
            mi.menu = children[i];

            _getMenuInfo(applicationCounter, application, mi, function(err, m1) {
                //console.log(counts[applicationCounter]);
                node.children.push(m1);
                node.children.sort(function(a, b) {
                    return a.sortKey - b.sortKey;
                });
            })
        }
        counts[applicationCounter] --;
        cb(null, node);
        if (counts[applicationCounter] == 0) {
            //console.log(counts[application]);
            cache.put('Menus', application, counts[application], function(err, result) {
                if (err) {
                    //console.log('菜单树放入缓存出错');
                    Logger.error('菜单树放入缓存出错');
                } else {
                    delete counts[application];
                    delete counts[applicationCounter];
                    if (typeof _tempFunc === 'function') {
                        _tempFunc();
                    }
                }
            });
        }
    });
}

exports.getMenuTree = function(application, cb) {
    cache.get('Menus', application, function(replay) {
        if (replay) {
            //console.log('menus get from cache');
            Logger.debug('menus get from cache');
            cb(replay);
        } else {
            //console.log('menus get from db');
            Logger.debug('menus get from db');
            menuTree(application, function() {
                cache.get('Menus', application, function(replay) {
                    cb(replay);
                });
            });
        }
    });
};
var _getRoleMenuTree = function(menuTree, roles, cb) {
    Role.find({
        code: {
            $in: roles
        }
    }, function(err, roles) {
        var _roleMenuTree = [];
        if (err) {
            return cb(err);
        }
        if (!menuTree || (menuTree && menuTree.length == 0)) {
            return cb(null, _roleMenuTree);
        }
        var check = [];

        for (var ii = 0, ll = menuTree.length; ii < ll; ii++) {
            var subs = [];
            var isContainCurrentMenu = false;
            for (var i = 0, l = roles.length; i < l; i++) {
                if (roles[i].menus.indexOf(menuTree[ii].id) >= 0) {
                    //if (check.indexOf(menuTree[ii].id) < 0) {
                    for (var iii = 0, lll = menuTree[ii].children.length; iii < lll; iii++) {
                        //console.log(menuTree[ii].children[iii].children);
                        if (roles[i].menus.indexOf(menuTree[ii].children[iii].id) >= 0) {
                            if (check.indexOf(menuTree[ii].children[iii].id) < 0) {
                                check.push(menuTree[ii].children[iii].id);
                                subs.push(menuTree[ii].children[iii]);
                            }
                        }
                    }
                    check.push(menuTree[ii].id);
                    //}
                    isContainCurrentMenu = true;
                }
            }
            if (isContainCurrentMenu) {
                menuTree[ii].children = subs;
                _roleMenuTree.push(menuTree[ii]);
            }

        }
        _roleMenuTree.sort(function(a, b) {
            return a.sortKey - b.sortKey;
        });
        console.log(_roleMenuTree);
        cb(null, _roleMenuTree);
    });
};
exports.getRoleMenuTree = function(application, roles, cb) {
    //var menuTree = _menuInfo[application];
    cache.get('Menus', application, function(replay) {
        if (replay) {
            _getRoleMenuTree(replay, roles, cb);
        } else {
            menuTree(application, function() {
                cache.get('Menus', application, function(replay) {
                    _getRoleMenuTree(replay, roles, cb);
                });
            });
        }
    });
};

exports.refresh = function() {
    cache.clearCache('Menus');
    menuTree('ip');
};