"use strict";
var mongoose = require('mongoose');
var updatedTimestamp = require('mongoose-updated_at');
var validator = require('../../lib/validator');
var uniqueValidator = require('mongoose-unique-validator');
var nestedSetPlugin = require('mongoose-nested-set');
var mongoosePaginate = require('mongoose-paginate');
var ObjectId = mongoose.Schema.Types.ObjectId;
var Error = mongoose.Error;
var menuSchema = new mongoose.Schema({
	url				:	{type: String, required: true },
	fullUrl			:	{type: String, unique: true},
	parentUrl		: 	{type: String, required: true},
	name			:	{type: String, required: true },
	application		:   {type : String},
	levelId			:	{type : String, required: true},
	sortKey			:	{type : Number, default : 0},
	createdAt		: 	{ type: Date, default: Date.now }
}, { collection: 'menus' });

menuSchema.plugin(mongoosePaginate);
menuSchema.plugin(nestedSetPlugin);
//添加create、update字段
menuSchema.plugin(updatedTimestamp);
//添加唯一字段校验
menuSchema.plugin(uniqueValidator, { message: '出错拉, {PATH}不能同已有值重复' });

menuSchema.virtual('subs.count').get(function() {
	if ((this.rgt - this.lft - 1) > 0) {
		return (this.rgt - this.lft - 1) / 2;
	}
	return 0;
});

//添加自定义校验
menuSchema.pre('save', function (next) {
	var errMsg = {};
	var self = this;
	var reg = /(^\/)(\w|\d)+$/;
	self.url = self.url.replace(/ /g, '');
	if (self.url.indexOf('/') != 0) {
		self.url = '/' + self.url;
	}
	if (self.parentUrl != '/') {
		self.fullUrl = self.parentUrl + self.url;
	} else {
		self.fullUrl = self.url;
	}

	if (Object.keys(errMsg).length > 0) {
		var err = new Error(JSON.stringify(errMsg));
		next(err);
	} else {
		next();
	}
});

module.exports = mongoose.model('Menu', menuSchema);
