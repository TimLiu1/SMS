"use strict";
var mongoose = require('mongoose');
var updatedTimestamp = require('mongoose-updated_at');
var uniqueValidator = require('mongoose-unique-validator');
var mongoosePaginate = require('mongoose-paginate');
var ObjectId = mongoose.Schema.Types.ObjectId;
var roleSchema = new mongoose.Schema({
	code		: {type : String, unique : true, required : true},
	name		: {type : String, required : true},
	menus		: [ObjectId],
	isValid		: {type:String, default:'1'},
	createdAt	: {type: Date, default: Date.now }
});
roleSchema.plugin(mongoosePaginate);
//添加create、update字段
roleSchema.plugin(updatedTimestamp);
//添加唯一字段校验
roleSchema.plugin(uniqueValidator, { message: '出错拉, {PATH}不能同已有值重复' });
/**
 * Helper function that hooks into the 'save' method, and replaces plaintext passwords with a hashed version.
 */
roleSchema.pre('save', function (next) {
	//预留
    var role = this;
    next();
});


module.exports = mongoose.model('Role', roleSchema);