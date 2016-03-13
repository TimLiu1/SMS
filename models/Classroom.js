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
var ClassroomSchema = new mongoose.Schema({
    campus:String,
    class:String,
    content:String,
    brief:String,
    status:String,
    time:String,
    reason:String,
},{
    collection: 'classroom'
});

//添加create、update字段
ClassroomSchema.plugin(updatedTimestamp);
//添加唯一字段校验
ClassroomSchema.plugin(uniqueValidator, {
    message: '出错拉, {PATH}不能同已有值重复'
});
ClassroomSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Classroom', ClassroomSchema);
