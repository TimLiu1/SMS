'use strict';

(function($) {
    $.fn.baseInfo = function() {
        $(".baseInfo").each(function() {
            var code = $(this).attr('data-base');
            var brand = $(this).attr('data-brand');
            var key = $(this).attr('data-key');
            var date = $(this).attr('data-date');
            if (!key) {
                key = '';
            }
            if (!date) {
                date = '';
            }
            var id = $(this).attr('data-id');
            var name = $(this).attr('data-name');
            var required = $(this).attr('data-required');
            var blank = $(this).attr('data-blank');
            var self = $(this);
            $.get("/baseData/service/baseInfo/brand/" + brand + "/code/" + code + "?key=" + key + "&date=" + date + '&' + new Date().getTime(), function(data, status) {
                if (status === 'success') {
                    var values = data.values;
                    if (values.length > 0 && values.length === 1) {
                        var value = values[0];
                        if (value) {
                            var p = $('<p>' + value.value + '</p>');
                            p.addClass('form-control-static');
                            var hidden = $('<input type="hidden" id="' + id + '" name="' + name + '" value="' + value.key + '">');
                            p.append(hidden);
                            self.html(p);
                        }

                    } else {
                        var select = $('<select id="' + id + '" name="' + name + '"></select>');
                        for (var i = 0, l = values.length; i < l; i++) {
                            select.append('<option value="' + values[i].key + '">' + values[i].value + '</option>')
                        }
                        select.addClass('form-control');
                        if (required && required === 'true') {
                            select.attr('required', '');
                        }
                        if (!blank || blank === 'true') {
                            select.prepend('<option value="">请选择</option>')
                        }
                        self.html(select);
                    }
                }
            });
        });
    };
    $.fn.baseInfoFlash = function(cb) {
        var code = $(this).attr('data-base');
        var brand = $(this).attr('data-brand');
        var key = $(this).attr('data-key');
        var date = $(this).attr('data-date');
        if (!key) {
            key = '';
        }
        if (!date) {
            date = '';
        }
        var id = $(this).attr('data-id');
        var name = $(this).attr('data-name');
        var required = $(this).attr('data-required');
        var blank = $(this).attr('data-blank');
        var self = $(this);
        $.get("/baseData/service/baseInfo/brand/" + brand + "/code/" + code + "?key=" + key + "&date=" + date + '&' + new Date().getTime(), function(data, status) {
            if (status === 'success') {
                var values = data.values;
                if(self.get(0).tagName=="LABEL"){
                    if ( values.length == 1) {
                        var value = values[0];
                        if(required){
                            self.html( value.value+'<span class="required-indicator">*</span>');
                        }else{
                            self.html( value.value);
                        }
                    }
                }else{

                    if (values.length > 0 && values.length == 1) {
                        var value = values[0];
                        var p = $('<p>' + value.value + '</p>');
                        p.addClass('form-control-static');
                        var hidden = $('<input type="hidden" id="' + id + '" name="' + name + '" value="' + value.key + '">');
                        p.append(hidden);
                        self.html(p);
                    } else {
                        var select = $('<select id="' + id + '" name="' + name + '"></select>');
                        if (!blank || blank === 'true') {
                            select.prepend('<option value="">请选择</option>')
                        }
                        for (var i = 0, l = values.length; i < l; i++) {
                            select.append('<option value="' + values[i].key + '">' + values[i].value + '</option>')
                        }
                        select.addClass('form-control');
                        if (required && required === 'true') {
                            select.attr('required', '');
                        }

                        self.html(select);
                    }
                }
            }
            if(typeof(cb)=="function"){
                cb();
            }
        });
    };

    $.fn.gearbox = function() {
        var code = $(this).attr('data-base');
        var brand = $(this).attr('data-brand');
        var key = $(this).attr('data-key');

        if (!key) {
            key = '';
        }

        var id = $(this).attr('data-id');
        var name = $(this).attr('data-name');
        var required = $(this).attr('data-required');
        var blank = $(this).attr('data-blank');
        var self = $(this);
        $.get(encodeURI("/baseData/service/gearbox/brand/" + brand + "/?key=" + key + '&' + new Date().getTime()), function(data, status) {
            if (status === 'success') {
                var values = data.values;
                if (values.length > 0 && values.length === 1) {
                    var value = values[0];
                    var p = $('<p>' + value + '</p>');
                    p.addClass('form-control-static');
                    var hidden = $('<input type="hidden" id="' + id + '" name="' + name + '" value="' + value.key + '">');
                    p.append(hidden);
                    self.html(p);
                } else {
                    var select = '';
                    if (!blank || blank === 'true') {
                        select = $('<select id="' + id + '" name="' + name + '"><option></option></select>');
                    } else {
                        select = $('<select id="' + id + '" name="' + name + '"></select>');
                    }
                    for (var i = 0, l = values.length; i < l; i++) {
                        select.append('<option value="' + values[i].key + '">' + values[i].value + '</option>')
                    }
                    select.addClass('form-control');
                    if (required && required === 'true') {
                        select.attr('required', '');
                    }

                    self.html(select);
                }
            }
        });
    };

    $.fn.displacement = function() {
        var code = $(this).attr('data-base');
        var brand = $(this).attr('data-brand');
        var key = $(this).attr('data-key');
        if (!key) {
            key = '';
        }
        var id = $(this).attr('data-id');
        var name = $(this).attr('data-name');
        var required = $(this).attr('data-required');
        var blank = $(this).attr('data-blank');
        var self = $(this);
        $.get(encodeURI("/baseData/service/displacement/brand/" + brand + "/?key=" + key + '&' + new Date().getTime()), function(data, status) {
            if (status === 'success') {
                var values = data.values;
                if (values.length > 0 && values.length === 1) {
                    var value = values[0];
                    var p = $('<p>' + value + '</p>');
                    p.addClass('form-control-static');
                    var hidden = $('<input type="hidden" id="' + id + '" name="' + name + '" value="' + value.key + '">');
                    p.append(hidden);
                    self.html(p);
                } else {
                    var select = '';
                    if (!blank || blank === 'true') {
                        select = $('<select id="' + id + '" name="' + name + '"><option></option></select>');
                    } else {
                        select = $('<select id="' + id + '" name="' + name + '"></select>');
                    }
                    for (var i = 0, l = values.length; i < l; i++) {
                        select.append('<option value="' + values[i].key + '">' + values[i].value + '</option>')
                    }
                    select.addClass('form-control');
                    if (required && required === 'true') {
                        select.attr('required', '');
                    }

                    self.html(select);
                }
            }
        });
    };
    $.fn.toggleClick = function() {
        var methods = arguments;    // Store the passed arguments for future reference
        var count = methods.length; // Cache the number of methods 

        // Use return this to maintain jQuery chainability
        // For each element you bind to
        return this.each(function(i, item){
            // Create a local counter for that element
            var index = 0;

            // Bind a click handler to that element
            $(item).on('click', function() {
                // That when called will apply the 'index'th method to that element
                // the index % count means that we constrain our iterator between 0
                // and (count-1)
                return methods[index++ % count].apply(this, arguments);
            });
        });
    };

    // 输入框格式化 
    $.fn.bankInput = function(options) {
        var defaults = {
            min: 10, // 最少输入字数 
            max: 25, // 最多输入字数 
            deimiter: ' ', // 账号分隔符 
            onlyNumber: true, // 只能输入数字 
            copy: true // 允许复制 
        };
        var opts = $.extend({}, defaults, options);
        var obj = $(this);
        obj.css({
            imeMode: 'Disabled',
            borderWidth: '1px',
            color: '#000',
            fontFamly: 'Times New Roman'
        }).attr('maxlength', opts.max);
        if (obj.val() != '') obj.val(obj.val().replace(/\s/g, '').replace(/(\d{4})(?=\d)/g, "$1" + opts.deimiter));
        obj.bind('keyup', function(event) {
            if (opts.onlyNumber) {
                if (!(event.keyCode >= 48 && event.keyCode <= 57)) {
                    this.value = this.value.replace(/\D/g, '');
                }
            }
            this.value = this.value.replace(/\s/g, '').replace(/(\d{4})(?=\d)/g, "$1" + opts.deimiter);
        }).bind('dragenter', function() {
            return false;
        }).bind('onpaste', function() {
            return !clipboardData.getData('text').match(/\D/);
        }).bind('blur', function() {
            this.value = this.value.replace(/\s/g, '').replace(/(\d{4})(?=\d)/g, "$1" + opts.deimiter);
            if (this.value.length < opts.min) {
                alert('最少输入' + opts.min + '位账号信息！');
                obj.focus();
            }
        })
    };
    // 列表显示格式化 
    $.fn.bankList = function(options) {
        var defaults = {
            deimiter: ' ' // 分隔符 
        };
        var opts = $.extend({}, defaults, options);
        return this.each(function() {
            $(this).text($(this).text().replace(/\s/g, '').replace(/(\d{4})(?=\d)/g, "$1" + opts.deimiter));
        })
    };
    $.fn.formatDate = function() {
        $(this).each(function() {
            var self = $(this);
            var date = self.text();
            var format = self.attr('data-format');
            var required = self.attr('data-required');
            var output = '';
            var m = null;
            if (date) {
                m = moment(new Date(date));
                output = m.format(format);
            } else if (required) {
                m = moment(new Date());
                output = m.format(format);
            }
            self.text(output); 
        });     
    };
})(jQuery);

Function.prototype.method = function(name, func) {
    this.prototype[name] = func;
    return this;
};
Function.prototype.method = function(name, func) {
    this.prototype[name] = func;
    return this;
};
if (String.prototype.trim) { //判断下浏览器是否自带有trim()方法
    String.method('trim', function() {
        return this.replace(/^s+|s+$/g, '');
    });
    String.method('ltrim', function() {
        return this.replace(/^s+/g, '');
    });
    String.method('rtrim', function() {
        return this.replace(/s+$/g, '');
    });
}
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(elt /*, from*/ ) {
        var len = this.length >>> 0;

        var from = Number(arguments[1]) || 0;
        from = (from < 0) ? Math.ceil(from) : Math.floor(from);
        if (from < 0)
            from += len;

        for (; from < len; from++) {
            if (from in this &&
                this[from] === elt)
                return from;
        }
        return -1;
    };
}
var objectCreate = function(arg) {
    if (!arg) {
        return {};
    }

    function obj() {};
    obj.prototype = arg;
    return new obj;
};
Object.create = Object.create || objectCreate;



