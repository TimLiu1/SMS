var mongoose = require('mongoose');
var updatedTimestamp = require('mongoose-updated_at');
var uniqueValidator = require('mongoose-unique-validator');
var validator = require('../lib/validator');
var mongoosePaginate = require('mongoose-paginate');
var ObjectId = mongoose.Schema.Types.ObjectId;
var Error = mongoose.Error;
/**
 * 接口信息
 */
var schema = new mongoose.Schema({
	//相对路径
    path: {
		type: String,
		required: true
	},
    //接口代码
	code: {
		type: String,
		unique: true
	},
    //接口名称
	name: {
		type: String,
		required: true
	},
    //版本
	version: {
		type: String,
		required: true,
		default: '1.0'
	},
    //状态
	status: {
		type: String,
		required: true
	},
    //所属类别
	category: {
		type: String,
		required: true
	},
    //服务提供方
	provider: {
		type: String,
		required: true
	},
	actions: [{
		action: String,
		jsonSchema: String,
		validateFunction: String,
		url: String,
		descript: {
			type: String,
			required: true
		}
	}],
    //描述
	descript: {
		type: String,
		required: true
	},
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
	collection: 'interfaces'
});

//添加create、update字段
schema.plugin(updatedTimestamp);
//添加唯一字段校验
schema.plugin(uniqueValidator, {
	message: '出错拉, {PATH}不能同已有值重复'
});
schema.plugin(mongoosePaginate);



schema.pre('save', function(next) {
	var errMsg = {};
	var self = this;
	for (var i = 0, l = self.actions.length; i < l; i++) {
		var sub = self.actions[i];
		if (!sub.action) {
			errMsg.emptyAction = '接口的action不能为空';
			return next(new Error(JSON.stringify(errMsg)));
		}
		if (sub.jsonSchema && !validator.isJSON(sub.jsonSchema)) {
			errMsg.errorSchema = '接口的schema定义为不正确的json格式';
			return next(new Error(JSON.stringify(errMsg)));
		}

	}
	if (Object.keys(errMsg).length > 0) {
		var err = new Error(JSON.stringify(errMsg));
		next(err);
	} else {
		next();
	}
});


module.exports = mongoose.model('Interface', schema);
