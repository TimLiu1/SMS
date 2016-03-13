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
var specialSchema = new mongoose.Schema({
    act_room: String,
    image: String,
    intro: String,
    type:String,
    equ:String
},{
    collection: 'Special'
});

//添加create、update字段
specialSchema.plugin(updatedTimestamp);
//添加唯一字段校验
specialSchema.plugin(uniqueValidator, {
    message: '出错拉, {PATH}不能同已有值重复'
});
specialSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Special', specialSchema);
