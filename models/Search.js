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
var SearchSchema = new mongoose.Schema({
    campus:String,
    act_type:String,
    status:String,
    act_room:String,
    content:Number,
    time:String,
},{
    collection: 'search'
});

//添加create、update字段
SearchSchema.plugin(updatedTimestamp);
//添加唯一字段校验
SearchSchema.plugin(uniqueValidator, {
    message: '出错拉, {PATH}不能同已有值重复'
});
SearchSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Search', SearchSchema);
