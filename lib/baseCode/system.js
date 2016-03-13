"use strict";

var _branchLevel = [{
    "key": "0",
    "value": "总公司"
}, {
    "key": "1",
    "value": "一级"
}, {
    "key": "2",
    "value": "二级"
}, {
    "key": "3",
    "value": "三级"
}, {
    "key": "4",
    "value": "四级"
}]; //定义缓存信息的对象


var _branchType = [{
    "key": "1",
    "value": "经代公司"
}, {
    "key": "2",
    "value": "保险公司"
}];


var _branchTypeLevel = [{
    "key": "1",
    "value": "A类机构"
}, {
    "key": "2",
    "value": "B类机构"
},{
    "key": "3",
    "value": "C类机构"
}];

var _validBase = [{
    "key": "1",
    "value": "是"
}, {
    "key": "0",
    "value": "否"
}];

var _menuLevelBase = [{
    "key": "1",
    "value": "一级菜单"
}, {
    "key": "2",
    "value": "二级菜单"
}, {
    "key": "3",
    "value": "三级菜单"
}];

var _postState = [{
    "key": "1",
    "value": "草稿"
}, {
    "key": "2",
    "value": "已发布"
}, {
    "key": "3",
    "value": "归档"
}];

var _userType = [{
    "key": "1",
    "value": "经销商用户"
}, {
    "key": "2",
    "value": "保险公司内勤"
}];

exports.postState = function(key) {
    return getBaseCodes(key,_postState);
};

exports.branchLevel = function(key) {
    return getBaseCodes(key,_branchLevel);
};

exports.branchType = function(key) {
    return getBaseCodes(key,_branchType);
};

exports.branchTypeLevel = function(key) {
    return getBaseCodes(key,_branchTypeLevel);
};

exports.valid = function(key) {
    return getBaseCodes(key,_validBase);
};

exports.menuLevel = function(key) {
    return getBaseCodes(key,_menuLevelBase);
};

exports.userType = function(key) {
    return getBaseCodes(key,_userType);
};


function getBaseCodes(key, arrays) {
    if (key) {
        var returnValue = '未定义';
        for (var i = 0, l = arrays.length; i < l; i++) {
            var o = arrays[i];
            if (o.key === key) {
                return o.value;
            }
        }
        return returnValue;
    }
    return arrays;
}
