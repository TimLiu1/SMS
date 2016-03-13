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
var AnnounceSchema = new mongoose.Schema({
    campus:String,
    act_type:String,
    status:String,
    act_room:String,
    content:String,
    brief:String,
    time:String,
    reason:String,
},{
    collection: 'announce'
});

//添加create、update字段
AnnounceSchema.plugin(updatedTimestamp);
//添加唯一字段校验
AnnounceSchema.plugin(uniqueValidator, {
    message: '出错拉, {PATH}不能同已有值重复'
});
AnnounceSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Announce', AnnounceSchema);
