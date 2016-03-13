var mongoose = require('mongoose');
var updatedTimestamp = require('mongoose-updated_at');
var uniqueValidator = require('mongoose-unique-validator');
var validator = require('../lib/validator');
var mongoosePaginate = require('mongoose-paginate');
var ObjectId = mongoose.Schema.Types.ObjectId;
var Error = mongoose.Error;
/**
 * 人身险基本信息
 */
var firstpageSchema = new mongoose.Schema({
    announcemnet: String,
    information: String,
    news: String,
},{
    collection: 'firstpage'
});

//添加create、update字段
firstpageSchema.plugin(updatedTimestamp);
//添加唯一字段校验
firstpageSchema.plugin(uniqueValidator, {
    message: '出错拉, {PATH}不能同已有值重复'
});
firstpageSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('firstpage', firstpageSchema);
