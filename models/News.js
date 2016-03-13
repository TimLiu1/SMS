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
var newsSchema = new mongoose.Schema({
    title:String,
    content:String,
},{
    collection: 'news'
});

//添加create、update字段
newsSchema.plugin(updatedTimestamp);
//添加唯一字段校验
newsSchema.plugin(uniqueValidator, {
    message: '出错拉, {PATH}不能同已有值重复'
});
newsSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('News', newsSchema);
