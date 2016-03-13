/**
 * New node file
 */
"use strict";
var validator = require('validator');

var extendsFunc = function() {
    //判断是否为电话号码
    validator.extend('isTeleNO', function(str) {
        if (str) {
            var reg = /^(\d{3,4}-?)?\d{7,9}(-\d+)?$/g;
            return reg.test(str);
        } else {
            return true;
        }
    });
    //判断邮政编码
    validator.extend('isZipCode', function(str) {
        if (str) {
            var reg = /^[0-9]{5,6}$/;
            return reg.test(str);
        } else {
            return true;
        }

    });
    //校验手机号码
    validator.extend('isMobile', function(str) {
        if (str) {
            var reg = /^0?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
            return reg.test(str);
        } else {
            return true;
        }
    });

    //判断是否为money,两位小数的正数
    validator.extend('IsMoney', function(str) {
        var reg = /^[0-9]+(.[0-9]{2})?$/;
        return reg.test(str);
    });

    //检验保单号，投保单号
    validator.extend('checkno', function(str) {
        var rex1 = /^[^\u4e00-\u9fa5]{0,}$/;
        var rex2 = /^[^\'\"\,\/\\]{0,}$/;
        if (!rex1.test(str)) {
            return false;
        } else if (!rex2.test(str)) {
            return false;
        } else {
            return true;
        }

    });

    //日期验证
    validator.extend('IsDate', function(strDate) {
        var strSeparator = "-"; //日期分隔符
        var strDateArray;
        var intYear;
        var intMonth;
        var intDay;
        var boolLeapYear;
        strDateArray = strDate.split(strSeparator);
        if (strDateArray.length != 3) return false;
        intYear = parseInt(strDateArray[0], 10);
        intMonth = parseInt(strDateArray[1], 10);
        intDay = parseInt(strDateArray[2], 10);
        if (isNaN(intYear) || isNaN(intMonth) || isNaN(intDay)) return false;
        if (intMonth > 12 || intMonth < 1) return false;
        if ((intMonth == 1 || intMonth == 3 || intMonth == 5 || intMonth == 7 || intMonth == 8 || intMonth == 10 || intMonth == 12) && (intDay > 31 || intDay < 1)) return false;
        if ((intMonth == 4 || intMonth == 6 || intMonth == 9 || intMonth == 11) && (intDay > 30 || intDay < 1)) return false;
        if (intMonth == 2) {
            if (intDay < 1) return false;
            boolLeapYear = false;
            if ((intYear % 100) == 0) {
                if ((intYear % 400) == 0) boolLeapYear = true;
            } else {
                if ((intYear % 4) == 0) boolLeapYear = true;
            }
            if (boolLeapYear) {
                if (intDay > 29) return false;
            } else {
                if (intDay > 28) return false;
            }
        }
        return true;
    });

    //判断身份证件号码
    validator.extend('IsIdCardNo', function(IdCard) {
        var reg = /^\d{15}(\d{2}[0-9X])?$/i;
        if (!reg.test(IdCard)) {
            return false;
        }

        if (IdCard.length == 15) {
            var n = new Date();
            var y = n.getFullYear();
            if (parseInt("19" + IdCard.substr(6, 2)) < 1900 || parseInt("19" + IdCard.substr(6, 2)) > y) {
                return false;
            }

            var birth = "19" + IdCard.substr(6, 2) + "-" + IdCard.substr(8, 2) + "-" + IdCard.substr(10, 2);
            if (!validator.IsDate(birth)) {
                return false;
            }
        }
        if (IdCard.length == 18) {
            var n = new Date();
            var y = n.getFullYear();
            if (parseInt(IdCard.substr(6, 4)) < 1900 || parseInt(IdCard.substr(6, 4)) > y) {
                return false;
            }

            var birth = IdCard.substr(6, 4) + "-" + IdCard.substr(10, 2) + "-" + IdCard.substr(12, 2);
            if (!validator.IsDate(birth)) {
                return false;
            }

            iW = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1);

            iSum = 0;
            for (i = 0; i < 17; i++) {
                iC = IdCard.charAt(i);
                iVal = parseInt(iC);
                iSum += iVal * iW[i];
            }

            iJYM = iSum % 11;
            if (iJYM == 0) sJYM = "1";
            else if (iJYM == 1) sJYM = "0";
            else if (iJYM == 2) sJYM = "x";
            else if (iJYM == 3) sJYM = "9";
            else if (iJYM == 4) sJYM = "8";
            else if (iJYM == 5) sJYM = "7";
            else if (iJYM == 6) sJYM = "6";
            else if (iJYM == 7) sJYM = "5";
            else if (iJYM == 8) sJYM = "4";
            else if (iJYM == 9) sJYM = "3";
            else if (iJYM == 10) sJYM = "2";

            var cCheck = IdCard.charAt(17).toLowerCase();
            if (cCheck != sJYM) {
                return false;
            }
        }
        return true;
    });

    return validator;
};

module.exports = extendsFunc();