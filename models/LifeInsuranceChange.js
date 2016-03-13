/**
 * Created by libinbin on 2015-10-31.
 */
var mongoose = require('mongoose');
var updatedTimestamp = require('mongoose-updated_at');
var uniqueValidator = require('mongoose-unique-validator');
var validator = require('../lib/validator');
var mongoosePaginate = require('mongoose-paginate');
var ObjectId = mongoose.Schema.Types.ObjectId;
var Error = mongoose.Error;
/**
 * 人身险退保记录表
 */
var lifeInsuranceChangeSchema = new mongoose.Schema({
    rationType: String,//产品代码
    productCode: String,//险种代码
    startDate: String,//保险起期
    endDate: String,//保险止期
    premium: Number,//总保费
    waterNo: String,//平台流水号
    policyNo: String,//保单号
    cancelReason:String,//描述信息
    policyStatus:String,//保单状态 Y-有效 N-无效(注销)
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
    collection: 'life_insurance_change'
});

//添加create、update字段
lifeInsuranceChangeSchema.plugin(updatedTimestamp);
//添加唯一字段校验
lifeInsuranceChangeSchema.plugin(uniqueValidator, {
    message: '出错拉, {PATH}不能同已有值重复'
});
lifeInsuranceChangeSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('LifeInsuranceChange', lifeInsuranceChangeSchema);
