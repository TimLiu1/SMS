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
var AuthSchema = new mongoose.Schema({
    authName: String,
    authType: String,
    authIntro: String

},{
    collection: 'authority'
});

//添加create、update字段
AuthSchema.plugin(updatedTimestamp);
//添加唯一字段校验
AuthSchema.plugin(uniqueValidator, {
    message: '出错拉, {PATH}不能同已有值重复'
});
AuthSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('auth', AuthSchema);
