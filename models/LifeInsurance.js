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
var lifeInsuranceSchema = new mongoose.Schema({
    rationType: String,//产品代码
    riskCode: String,//险种代码
    startDate: String,//保险起期
    endDate: String,//保险止期
    inputDate: String,//投保日期
    sumAmount: Number,//总保额
    perPremium: Number,//每人保费
    sumPremium: Number,//总保费
    unitCount: Number,//投保份数
    holderNum: Number,//投保人数
    remark: String,//备注
    noteType: String,//单证类型
    noteNum: String,//单证号码
    belongORGCode: String,//出单机构代码
    issuedOrgCode: String,//出单部门代码
    issuedDate: String,//保单签单日期
    strLockKey: String,//密文
    bizOrigin: String,//业务数据来源,
    waterNo: String,//平台流水号
    policyNo: String,//保单号
    outSysCode: String,//外部系统代码
    salesCode: String,//销售人员编码
    taskStatus:String,//任务状态
    //投保人
    appDataDto: {
        //投保人类型 1-个人 2-团体
        applicantType: String,
        //客户名称 -为团体时是公司名称 -为个人时是投保人姓名
        applicantName: String,
        //单位电话
        companyPhone: String,
        //联系人 -团体投保时的联系人
        contactName: String,
        //证件类型
        identifyType: String,
        //证件号码
        identifyNumber: String,
        //性别 01-男，02-女
        sex: String,
        //出生日期
        birthday: String,
        //电话号码
        mobile: String,
        //邮箱
        email: String,
        //投保人地址
        address: String,
        //邮编
        zipCode: String
    },
    //被保人信息 可以是多个
    insuredInfo: [{
        //投保人姓名
        insuredName: String,
        //证件类型
        identifyType: String,
        //证件号码
        identifyNumber: String,
        //性别 01-男，02-女
        sex: String,
        //出生日期
        birthday: String,
        //电话号码
        mobile: String,
        //邮箱
        email: String,
        //被保人地址
        address: String,
        //被保险人与投保人关系
        insRelationApp: String,
        //被保险人与受益人关系
        benAppRelationShip: String,
        //邮编
        zipCode: String,
        //被保险人职业类别
        insuredJobType: String,
        //被保险人类型
        insuredType: String
    }],
    //受益人信息
    benfcData: {
        //受益人姓名
        benName: String,
        //性别
        sex: String,
        //受益人证件类型
        identifyType: String,
        //受益人证件号码
        identifyNumber: String,
        //出生日期
        birthday: String,
        //受益比例
        benRate: String,
        //备注
        remark: String
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
    collection: 'life_insurance'
});

//添加create、update字段
lifeInsuranceSchema.plugin(updatedTimestamp);
//添加唯一字段校验
lifeInsuranceSchema.plugin(uniqueValidator, {
    message: '出错拉, {PATH}不能同已有值重复'
});
lifeInsuranceSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('LifeInsurance', lifeInsuranceSchema);
