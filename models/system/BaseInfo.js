"use strict";
var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var schema = new mongoose.Schema({
    code: {
        type: String
    },
    name: {
        type: String,
        required: true
    },
    values: [{
        key: {
            type: String,
            required: true
        },
        value: {
            type: String,
            required: true
        },
        startDate: Date,
        endDate: Date
    }],
    baseDataType: String,
    createdAt: {
        type: Date, //创建时间
        default: Date.now
    },
    createBy: {
        type: String //创建用户ID
    },
    updatedAt: {
        type: Date, //更新时间
        default: Date.now
    },
    updateBy: {
        type: String //更新用户ID
    }
}, {
    collection: 'base_info'
});


//添加唯一字段校验
schema.plugin(uniqueValidator, {
    message: '出错拉, 基本信息类型不能同已有值重复'
});


module.exports = mongoose.model('BaseInfo', schema);
