var mongoose = require('mongoose');
var updatedTimestamp = require('mongoose-updated_at');
var uniqueValidator = require('mongoose-unique-validator');
var validator = require('../lib/validator');
var mongoosePaginate = require('mongoose-paginate');
var ObjectId = mongoose.Schema.Types.ObjectId;
var Error = mongoose.Error;

var schema = new mongoose.Schema({});
/**
 * 产品信息
 */
var planSchema = new mongoose.Schema({
    announcemnet: String,//产品代码
    information: String,//险种代码
    news: String,//保险起期
}, {
    collection: 'plan'
});
//添加create、update字段
planSchema.plugin(updatedTimestamp);
//添加唯一字段校验
planSchema.plugin(uniqueValidator, {
    message: '出错拉, {PATH}不能同已有值重复'
});
planSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Plan', planSchema);
