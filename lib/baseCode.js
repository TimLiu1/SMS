"use strict";
var system = require('./baseCode/system');

var _customerType = [{
    "key": "1",
    "value": "个人"
}, {
    "key": "2",
    "value": "单位"
}];

var _customerTitle = [{
    "key": "1",
    "value": "男"
}, {
    "key": "2",
    "value": "女"
}];

var _customerCommentsType = [{
    "key": "1",
    "value": "一般"
}, {
    "key": "2",
    "value": "其它"
}];

var _customerCommentsReason = [{
    "key": "1",
    "value": "客户信息错误"
}, {
    "key": "2",
    "value": "客户信息变更"
}];


exports.customerType = function(key) {
    return getBaseCodes(key,_customerType);
};

exports.customerTitle = function(key) {
    return getBaseCodes(key,_customerTitle);
};

exports.customerCommentsType = function(key) {
    return getBaseCodes(key,_customerCommentsType);
};

exports.customerCommentsReason = function(key) {
    return getBaseCodes(key,_customerCommentsReason);
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

exports.userType = system.userType;
exports.branchLevel = system.branchLevel;
exports.branchType = system.branchType;
exports.branchTypeLevel = system.branchTypeLevel;
exports.valid = system.valid;
exports.menuLevel = system.menuLevel;
exports.postState = system.postState;


