'use strict';
var mongoose = require('mongoose');
var updatedTimestamp = require('mongoose-updated_at');
var uniqueValidator = require('mongoose-unique-validator');
var validator = require('../../lib/validator');
var ObjectId = mongoose.Schema.Types.ObjectId;
var Error = mongoose.Error;
var branchSchema = new mongoose.Schema({
	code: {
		type: String,
		unique: true,
		required: true
	},
	oldCode: {
		type: String
	},
	name: {
		type: String,
		required: true
	},
	abbrName: {
		type: String
	},
	typeId: {
		type: String
	},
	parent: {
		type: String,
		required: true
	},
	/* 直接上级机构代码 */
	subs: {
		type: Number,
		default: 0
	},
	// /* 直接下级机构代码 */
	levelId: {
		type: String,
		required: true
	},
	receiveAccount: { /* 收款帐号 */
		cardType: String,
        bankPayType:String,
		accountNo: String,
		payeeBankAccountName: String,
		payeeBankCode: String,
		bankBranchName: String,
        bankBranchCode: String,
		payeeRelateCode: String,
		payeeBankName: String,
		payeeBankCityCode: String,
		payeeMobile: String
	},
	telephone: {
		type: String
	},
	mobile: {
		type: String
	},
	fax: String,
	email: String,
	address: {
		type: String
	},
	contact: {
		type: String
	},
	zip: {
		type: String
	},
	// countryCode: String,
	// districtCode: String,
	// originalCode: String,
	status: {
		type: String,
		enum: ['0', '1'],
		default: '1'
	},
	// remarks: {
	// 	type: String
	// },
	createdAt: {
		type: Date,
		default: Date.now
	}
}, {
	collection: 'branches'
});


//添加create、update字段
branchSchema.plugin(updatedTimestamp);
//添加唯一字段校验
branchSchema.plugin(uniqueValidator, {
	message: '出错拉, {PATH}不能同已有值重复'
});
//添加自定义校验
branchSchema.pre('save', function(next) {
	var errMsg = {};
	var self = this;

	if (self.telephone && !validator.isTeleNO(self.telephone)) {
		errMsg.branchTelephone = '电话号码格式不正确';
	}
	if (self.fax && !validator.isTeleNO(self.fax)) {
		errMsg.branchFax = '传真号码格式不正确';
	}
	if (self.zip && !validator.isZipCode(self.zip)) {
		errMsg.zip = '邮政编码格式不正确';
	}

	//var model = this.model(this.constructor.modelName);
	var db = mongoose.connection.db;
	db.collection('branches', function(err, collection) {
		if (!err) {
			collection.findOne({
				code: self.parent
			}, function(err, level) {
				if (!err && level) {
					var parentLevel = new Number(level.levelId);
					var currentLevel = new Number(self.levelId);
					if (currentLevel <= parentLevel) {
						errMsg.branchLevel = '所选公司级别不能等于或高于上级机构';
					}
					if ((currentLevel - parentLevel) > 1) {
						errMsg.branchLevel = '所选公司级别应该是上级机构的直属下级';
					}
					if (Object.keys(errMsg).length > 0) {
						var err = new Error(JSON.stringify(errMsg));
						next(err);
					} else {
						next();
					}
				} else {
					if (Object.keys(errMsg).length > 0) {
						var err = new Error(JSON.stringify(errMsg));
						next(err);
					} else {
						next();
					}
				}
			});
		} else {
			next();
		}
	});

});

module.exports = mongoose.model('Branch', branchSchema);
