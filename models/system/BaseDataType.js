"use strict";
var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var schema = new mongoose.Schema({
    key: {
        type: String,
        unique: true
    },
    value: {
        type: String,
        required: true
    }
}, {
    collection: 'base_data_type'
});


//添加唯一字段校验
schema.plugin(uniqueValidator, {
    message: '出错拉, 基本数据类型编码不能同已有值重复'
});


module.exports = mongoose.model('BaseDataType', schema);
