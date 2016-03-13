function isString(arg) {
    return typeof arg === 'string';
};


var getBaseCode = function(key, list) {
    if (key) {
        var returnValue = '未定义';
        for (var i = 0, l = list.length; i < l; i++) {
            var o = list[i];
            if (o.key === key) {
                return o.value;
            }
        }
        return returnValue;
    }
    return list;
};


var baseCode = {
    getBaseData: function(cb) {

        $.get('/system/data/getBase?' + new Date().getTime(), function(data, status) {
            if (status === 'success') {
                if (data.baseDataType) {
                    baseCode._baseDataType = data.baseDataType;
                }
                if (data.baseInfos) {
                    async.each(data.baseInfos, function(item, callback) {
                        baseCode[item.code] = function(key) {
                            return getBaseCode(key, item.values);
                        };
                        callback();
                    }, function(err) {
                        if (cb && typeof cb === 'function') {
                            cb();
                        }
                    });
                } else {
                    if (cb && typeof cb === 'function') {
                        cb();
                    }
                }
            } else {
                return alert(xhr.statusText);
            }
        });
    },
    _validBase: [{
        "key": "1",
        "value": "是"
    }, {
        "key": "0",
        "value": "否"
    }],
    _menuLevel: [{
        "key": "1",
        "value": "一级菜单"
    }, {
        "key": "2",
        "value": "二级菜单"
    }, {
        "key": "3",
        "value": "三级菜单"
    }],
    _baseDataType: [],
    _baseInfos: [],
    _taskStatus: [{
        "key": "W",
        "value": "待同步"
    }, {
        "key": "S",
        "value": "同步成功"
    },{
        "key": "F",
        "value": "同步失败"
    }, {
        "key": "R",
        "value": "同步中"
    }],
    valid: function(key) {
        return getBaseCode(key, this._validBase);
    },
    menuLevel: function(key) {
        return getBaseCode(key, this._menuLevel);
    },
    baseDataType: function(key) {
        return getBaseCode(key, this._baseDataType);
    },
    taskStatus: function(key) {
        return getBaseCode(key, this._taskStatus);
    }
};

var util = {
    formatRegExp: /%[sdj%]/g,

    format: function(f) {
        var formatRegExp = this.formatRegExp;
        if (!isString(f)) {
            var objects = [];
            for (var i = 0; i < arguments.length; i++) {
                objects.push(inspect(arguments[i]));
            }
            return objects.join(' ');
        }

        var i = 1;
        var args = arguments;
        var len = args.length;
        var str = String(f).replace(formatRegExp, function(x) {
            if (x === '%%')
                return '%';
            if (i >= len)
                return x;
            switch (x) {
                case '%s':
                    return String(args[i++]);
                case '%d':
                    return Number(args[i++]);
                case '%j':
                    try {
                        return JSON.stringify(args[i++]);
                    } catch (_) {
                        return '[Circular]';
                    }
                default:
                    return x;
            }
        });
        for (var x = args[i]; i < len; x = args[++i]) {
            if (isNull(x) || !isObject(x)) {
                str += ' ' + x;
            } else {
                str += ' ' + inspect(x);
            }
        }
        return str;
    },
    formatCurrence: function(value, n, x) {
        var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
        return value.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,');
    }
};

(function() {
    dust.helpers.baseCode = function(chunk, context, bodies, params) {
        var code = dust.helpers.tap(params.code, chunk, context);
        var base = dust.helpers.tap(params.base, chunk, context);
        var output = '';
        if (!baseCode[base]) {
            return chunk.write(output);
        }
        if (code || code == '') {
            if (code != '') {
                output = baseCode[base](code);
            }
        } else {
            var objs = baseCode[base]();
            var id = dust.helpers.tap(params.id, chunk, context);
            var name = dust.helpers.tap(params.name, chunk, context);
            var blank = dust.helpers.tap(params.blank, chunk, context);
            var selectValue = dust.helpers.tap(params.selectValue, chunk, context);
            var required = dust.helpers.tap(params.required, chunk, context);
            var css = dust.helpers.tap(params.class, chunk, context);
            var disabled = dust.helpers.tap(params.disabled, chunk, context);
            var blankValue = dust.helpers.tap(params.blankValue, chunk, context);
            var disabledStr = '';
            if (disabled && new Boolean(disabledStr)) {
                disabledStr = 'disabled';
            }
            var cssStr = '';
            if (css) {
                cssStr = util.format('class="%s"', 'form-control ' + css);
            } else {
                cssStr = 'class="form-control"';
            }
            if (required) {
                output = util.format('<select %s %s id="%s" name="%s" required>', cssStr, disabledStr, id, name);
            } else {
                output = util.format('<select %s %s id="%s" name="%s" >', cssStr, disabledStr, id, name);
            }

            if (blank && new Boolean(blank)) {
                if (blankValue) {
                    output += util.format('<option value="">' + blankValue + '</option>');
                } else {
                    output += util.format('<option value="" />');
                }

            }
            for (var i = 0, l = objs.length; i < l; i++) {
                var obj = objs[i];
                if (selectValue && selectValue === obj.key) {
                    output += util.format('<option value="%s" selected="true" >%s</option>', obj.key, obj.value);
                } else {
                    output += util.format('<option value="%s" >%s</option>', obj.key, obj.value);
                }
            }
            output += '</select>';
        }
        return chunk.write(output);
    };
    define(["moment"], function(moment) {
        dust.helpers.formatDate = function(chunk, context, bodies, params) {
            var date = dust.helpers.tap(params.date, chunk, context);
            var required = dust.helpers.tap(params.required, chunk, context);
            var format = dust.helpers.tap(params.format, chunk, context);
            var defaultDate = dust.helpers.tap(params.default, chunk, context);
            var output = '';
            var m = null;
            if (date) {

                m = moment(new Date(date));
                output = m.format(format);
            } else if (required) {
                m = moment(new Date());
                output = m.format(format);
            } else if (defaultDate) {
                if (defaultDate === 'now') {
                    m = moment(new Date());
                    output = m.format(format);
                } else {
                    m = moment(defaultDate, "YYYYMMDD");
                    output = m.format(format);
                }
            }
            return chunk.write(output);
        };
    });
    dust.helpers.security = function(chunk, context, bodies, params) {

        //Retrieve the date value from the template parameters.
        var user = dust.helpers.tap(params.user, chunk, context);
        var roles = dust.helpers.tap(params.roles, chunk, context);
        var allowed = dust.helpers.tap(params.allowed, chunk, context);
        var branches = dust.helpers.tap(params.branches, chunk, context);
        var body = bodies.block;
        //Parse the date object using MomentJS
        allowed = allowed.replace(/ /g, '');
        var wanted = allowed.split(',');
        if (typeof roles === 'string') {
            roles = roles.split(',');
        }
        for (var i = 0, l = wanted.length; i < l; i++) {
            if (_.find(roles, function(item) {
                    return item == wanted[i];
                })) {
                return body(chunk, context);
            }
        }
        return chunk;
    };
    dust.helpers.currency = function(chunk, context, bodies, params) {
        var value = dust.helpers.tap(params.value, chunk, context);
        if (Number(value)) {
            return chunk.write(util.formatCurrence(Number(value), 2, 3));
        } else {
            return chunk.write('');
        }
    };
})();
