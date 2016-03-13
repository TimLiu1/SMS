var mongoose = require('mongoose');
var updatedTimestamp = require('mongoose-updated_at');
var uniqueValidator = require('mongoose-unique-validator');
var validator = require('../lib/validator');
var mongoosePaginate = require('mongoose-paginate');
var ObjectId = mongoose.Schema.Types.ObjectId;
var Error = mongoose.Error;
/**
 * 第三方平台信息
 */
var partySchema = new mongoose.Schema({
	//代码
    code: {
		type: String,
		unique: true
	},
    //名称
	name: {
		type: String,
		required: true
	},
    //简要说明
	descript: String,
    //token
    token:String,
    //第三方平台访问url
    url:String,
    //签名串
    sign:String,
    //核心系统渠道代码
    outerSystem:String,
    //安全信息
	security: {
        //私鈅
		privateKey: {
			type: String
		},
        //公鈅
		publicKey: {
			type: String
		},
        //密钥
		hmacKey: {
			type: String
		}
	},
	//机构
	branch: String,
	//业务员
	agent: String,
	//中介/代理
	insuranceAgency: String,
	//产品方案
	plan: [{
	 	type: ObjectId,
	 	ref: 'plan'
	}],
    //开始生效日期
	effectiveStartDate: {
		type: Date,
		default: Date.now
	},
    //结束生效日期
	effectiveEndDate: {
		type: Date,
		default: Date('2020-01-01')
	},
    //接口
	interfaces: [{
		type: ObjectId,
		ref: 'Interface'
	}],
    createdAt: {
        type: Date, //创建时间
        default: Date.now
    },
    createBy: {
        type: String //创建用户ID
    },
    updatedAt: {
        type: Date, //更新时间
        default: Date.now
    },
    updateBy: {
        type: String //更新用户ID
    }
}, {
    collection: 'parties'
});
//添加create、update字段
partySchema.plugin(updatedTimestamp);
//添加唯一字段校验
partySchema.plugin(uniqueValidator, {
	message: '出错拉, {PATH}不能同已有值重复'
});
partySchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Party', partySchema);
