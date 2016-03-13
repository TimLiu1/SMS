var menus = function() {
    $('#header a').click(function(event) {
        var path = $(this).attr('href');
        if (path.indexOf('#') == 0) {
            return true;
        }
        var next = function() {
            var lias = $("ul.menu li a");
            var p = path.split('/');
            for (var i = 0, l = lias.length; i < l; i++) {
                var href = $(lias[i]).attr('href');
                var h = href.split('/');
                if (p.indexOf(h[h.length - 1]) >= 0) {
                    $('ul.menu li.active').removeClass('active');
                    $(lias[i]).parent().addClass('active');
                    if ($(lias[i]).closest('.dropdown')) {
                        $(lias[i]).closest('.dropdown').addClass('active');
                    }
                }
            }
            if (path === '/' || path === '/logout') {
                return true;
            }
            renderPage(path, function(data, out) {
                $('ul[id^=submenu]').addClass('hide');
                var subIndex = data.subIndex;
                if (subIndex >= 0) {
                    $('#submenu' + subIndex).removeClass('hide');
                    lias = $("ul.submenu:visible li a");
                    for (var i = 0, l = lias.length; i < l; i++) {
                        var href = $(lias[i]).attr('href');
                        var h = href.split('/');
                        $('ul.submenu:visible li.active').removeClass('active');
                        if (p.indexOf(h[h.length - 1]) >= 0) {
                            $(lias[i]).parent().addClass('active');
                            if ($(lias[i]).closest('.dropdown')) {
                                $(lias[i]).closest('.dropdown').addClass('active');
                            }
                            break;
                        }
                    }
                    if ($('ul.submenu:visible li.active').length == 0) {
                        $(lias[0]).parent().addClass('active');
                        if ($(lias[0]).closest('.dropdown')) {
                            $(lias[0]).closest('.dropdown').addClass('active');
                        }
                    }
                }
                $("#main").html(out);
                changeADefault();
            });


            event.preventDefault();

            return false;
        };
        next();
    });
};

var state = {
    currentPage: {
        url: '/',
        view: ''
    },
};
var submitForm = function(f, paction, callback) {
    var form = f;
    $(":button").attr("disabled", "true");
    var action = $(form).attr('action');
    var cb = paction;
    if (paction && typeof paction === 'string') {
        action = paction;
    }
    if (typeof callback === 'function') {
        cb = callback;
    }

    $.post(action + '?' + new Date().getTime(), $(form).serialize(), function(data, status) {
        data.user = app.user;
        $(":button").attr("disabled", false);
        if (status === 'success') {
            if (data.err) {
                var some_html = '<br><div class="alert alert-warning fade in">';
                some_html += '<label>错误</label>' + JSON.stringify(data.err);
                some_html += '</div>';
                var box = bootbox.alert(some_html);
            } else {
                if (data.redirect) {
                    renderPage(data.redirect, function() {
                        if (cb && typeof cb === 'function') {
                            cb(data);
                        }
                        if (data.showMessage) {
                            var some_html = '<br><div class="alert alert-success fade in">';
                            some_html += '<ul id="showMessage">';
                            some_html += '<li>' + data.showMessage + '</li>';
                            some_html += '</ul>';
                            some_html += '</div>';
                            var box = bootbox.alert(some_html);

                            setTimeout(function() {
                                box.modal('hide');
                            }, 1000);
                        }
                        changeADefault();
                    });
                } else if (data.view) {
                    dust.render(data.view, data, function(err, out) {
                        if (err) {
                            return alert(err);
                        }
                        if (cb) {
                            cb(data, out);
                        }
                        $("#main").html(out);
                        $('.selectpicker').selectpicker({
                            style: 'btn-success'
                        });
                        if (data.showMessage) {
                            var some_html = '<br><div class="alert alert-success fade in">';
                            some_html += '<ul id="showMessage">';
                            some_html += '<li>' + data.showMessage + '</li>';
                            some_html += '</ul>';
                            some_html += '</div>';
                            var box = bootbox.alert(some_html);

                            setTimeout(function() {
                                box.modal('hide');
                            }, 1000);
                        }
                        changeADefault();
                    });
                } else if (cb && typeof cb === 'function') {
                    cb(data);
                } else {
                    var some_html = '<br><div class="alert alert-danger fade in">';
                    some_html += '<label>返回结果出错：form提交后返回数据必须有view或者redirect或者回调函数</label>';
                    some_html += '</div>';
                    bootbox.alert(some_html);
                }
            }
        } else {
            var some_html = '<br><div class="alert alert-danger fade in">';
            some_html += '<label>调用后台出错：' + xhr.statusText + '</label>';
            some_html += '</div>';
            bootbox.alert(some_html);
        }
    });
};


var renderPage = function(url, cb) {
    state.currentPage.url = url;
    var realUrl = url.indexOf('?') > -1 ? url + '&' + new Date().getTime() : url + '?' + new Date().getTime();
    $.get(realUrl, function(data, status) {
        data.user = app.user;
        if (status === 'success') {
            if (data.redirect) {
                renderPage(data.redirect, cb);
            } else {
                dust.render(data.view, data, function(err, out) {
                    if (err) {
                        return alert(err);
                    }
                    if (cb) {
                        cb(data, out);
                    }
                    $("#main").html(out);
                    $('.selectpicker').selectpicker({
                        style: 'btn-success'
                    });
                    changeADefault();
                    $(":button").attr("disabled", false);
                });
            }
        } else {
            return alert(xhr.statusText);
        }
    });
};
var renderCurrent = function(cb) {
    var page = state.currentPage;
    renderPage(page.url, cb);
};
var changeADefault = function() {
    $('#main a').click(function(event) {
        var url = $(this).attr('href');
        if (!url) {
            return true;
        }
        if (url.indexOf('#') === 0) {
            return true;
        }
        renderPage(url, function(data, out) {
            $("#main").html(out);
        });
        event.preventDefault();
        return false;
    });
};


var bootbox;
var async;
var app = {
    init: function($, bt, as) {
        $(function() {
            bootbox = bt;
            async = as;
            bootbox.setDefaults({
                locale: "zh_CN"
            });
            async.series([
                function(callback) {
                    baseCode.getBaseData(function() {
                        callback(null, 'one');
                    });
                },
                function(callback) {
                    $.get('/apis/menus?' + new Date().getTime(), function(data, status) {
                        if (status === 'success') {
                            var page = data.view;
                            dust.render(page, data, function(err, out) {
                                if (err) {
                                    return alert(err);
                                }
                                $("#header").html(out);
                                // bootbox.hideAll();
                                menus();
                            });
                        } else {
                            return alert(xhr.statusText);
                        }
                        callback(null, 'two');
                    });
                }
            ]);
        });
    },
    user: {},
    showSucess: function(message, cb, autoClose) {
        var some_html = '<br><div class="alert alert-success fade in">';
        some_html += '<label>' + message + '</label>';
        some_html += '</div>';
        var box = bootbox.alert(some_html);
        if (cb && typeof cb === 'function') {
            box.on('hidden.bs.modal', function(e) {
                cb();
            });
        }
        if (autoClose) {
            setTimeout(function() {
                box.modal('hide');
            }, 1000);
        }
    },
    showError: function(message) {
        var some_html = '<br><div class="alert alert-danger fade in">';
        some_html += '<label>调用后台出错：' + message + '</label>';
        some_html += '</div>';
        bootbox.alert(some_html);
    }
};
requirejs.config({
    "waitSeconds": 10,
    "urlArgs": "bust=" + (new Date()).getTime(),
    "paths": {
        "jquery": "/components/jquery/dist/jquery.min",
        "bootstrap": "/js/bootstrap.min",
        "bootstrap-paginator": "/js/bootstrap-paginator.min",
        "bootbox": "/js/bootbox.min",
        "bootTree": "/js/bootstrap-tree",
        "bootSelector": "/js/bootstrap-select.min",
        "jstree": "/js/jstree.min",
        "dust": "/components/dustjs-linkedin/dist/dust-core.min",
        "dustHelper": "/components/dustjs-linkedin-helpers/dist/dust-helpers.min",
        "baseCode": "/js/templates/clientBaseHelper",
        "jquery.validate": "/js/jquery.validate.min",
        "jquery.validate.extend": "/js/jquery.validate.extend",
        "jquery.localization": "/js/localization/messages_zh",
        "bootSelector.localization": "/js/localization/bootselect-zh_CN.min",
        "bootDatePicker": "/js/bootstrap-datepicker.min",
        "bootDatePicker.localization": "/js/localization/bootstrap-datepicker.zh-CN.min",
        "moment": "/js/moment.min",
        "_": "/js/underscore-min",
        "async": "/js/async.min",

        "header": "/js/templates/header",
        "system": "/js/templates/system/menu/index",
        "system.menu.add": "/js/templates/system/menu/add",
        "system.menu.addSub": "/js/templates/system/menu/addSub",
        "system.menu.edit": "/js/templates/system/menu/edit",
        "system.menu._form": "/js/templates/system/menu/_form",
        "system.role.index": "/js/templates/system/role/index",
        "system.role.roleForm": "/js/templates/system/role/roleForm",
        "system.role.addMenus": "/js/templates/system/role/addMenus",
        "system.role._menuTree": "/js/templates/system/role/_menuTree",

        "interface.index": "/js/templates/interface/index",
        "interface._form": "/js/templates/interface/_form",
        "interface.actionList": "/js/templates/interface/actionList",

        "party.index": "/js/templates/party/index",
        "party.form": "/js/templates/party/form",
        "party.detail": "/js/templates/party/detail",
        "party.interfaces": "/js/templates/party/interfaces",

        "system.data.base": "/js/templates/system/data/base",
        "system.data.baseInfo": "/js/templates/system/data/baseInfo",
        "system.data.baseInfoForm": "/js/templates/system/data/baseInfoForm",
        "system.data.baseInfoList": "/js/templates/system/data/baseInfoList",

        "task.index":"/js/templates/task/index",
        "task.tasks":"/js/templates/task/tasks",


        "wayin.special": "/js/templates/wayin/special",
        "wayin.index": "/js/templates/wayin/index",
        "area_book.index": "/js/templates/area_book/index",
        "area_book._form": "/js/templates/area_book/_form",
        "area_book._form_ann": "/js/templates/area_book/_form_ann",
        "area_book._form_play": "/js/templates/area_book/_form_play",
        "area_book._form_room": "/js/templates/area_book/_form_room",
        "area_book.classroom": "/js/templates/area_book/classroom",
        "area_book.activity": "/js/templates/area_book/activity",
        "area_book.playground": "/js/templates/area_book/playground",
        "area_book.publicitycolumn": "/js/templates/area_book/publicitycolumn",
        "area_book.domestic_installation": "/js/templates/area_book/domestic_installation",




        "search.index": "/js/templates/search/index",



        "user_center.index": "/js/templates/user_center/index",


        "authority.index":"/js/templates/authority/index",
        "authority.authTransfer":"/js/templates/authority/authTransfer",





    },

    "shim": {
        "bootstrap": {
            "deps": ["jquery"]
        },
        "bootstrap-paginator": {
            "deps": ["jquery"]
        },
        "bootSelector": {
            "deps": ["jquery"]
        },
        "dustHelper": {
            "deps": ["dust"]
        },
        "baseCode": {
            "deps": ["jquery", "dust"]
        },

        'jquery.validate': {
            "deps": ["jquery"]
        },
        'jquery.validate.extend': {
            "deps": ["jquery.validate"]
        },
        'jquery.localization': {
            "deps": ["jquery", "jquery.validate"]
        },
        'bootSelector.localization': {
            "deps": ["bootSelector"]
        },
        'bootDatePicker': {
            "deps": ["jquery"]
        },
        'bootDatePicker.localization': {
            "deps": ["jquery", "bootDatePicker"]
        },
        "async": {
            "exports": 'async'
        },
        "header": {
            "deps": ["dust", "dustHelper"]
        },

        "system": {
            "deps": ["dust", "dustHelper"]
        },
        "system.menu.add": {
            "deps": ["dust", "dustHelper"]
        },
        "system.menu.addSub": {
            "deps": ["dust", "dustHelper"]
        },
        "system.menu.edit": {
            "deps": ["dust", "dustHelper"]
        },
        "system.menu._form": {
            "deps": ["dust", "dustHelper"]
        },
        "system.role.index": {
            "deps": ["dust", "dustHelper"]
        },
        "system.role.roleForm": {
            "deps": ["dust", "dustHelper"]
        },
        "system.role.addMenus": {
            "deps": ["dust", "dustHelper"]
        },
        "system.role._menuTree": {
            "deps": ["dust", "dustHelper"]
        },

        "interface.index": {
            "deps": ["dust", "dustHelper"]
        },
        "interface._form": {
            "deps": ["dust", "dustHelper"]
        },
        "interface.actionList": {
            "deps": ["dust", "dustHelper"]
        },

        "party.index": {
            "deps": ["dust", "dustHelper"]
        },
        "party.form": {
            "deps": ["dust", "dustHelper"]
        },
        "party.detail": {
            "deps": ["dust", "dustHelper"]
        },
        "party.interfaces": {
            "deps": ["dust", "dustHelper"]
        },

        "system.data.base": {
            "deps": ["dust", "dustHelper"]
        },
        "system.data.baseInfo": {
            "deps": ["dust", "dustHelper"]
        },
        "system.data.baseInfoForm": {
            "deps": ["dust", "dustHelper"]
        },
        "system.data.baseInfoList": {
            "deps": ["dust", "dustHelper"]
        },

        "task.index": {
            "deps": ["dust", "dustHelper"]
        },
        "task.tasks": {
            "deps": ["dust", "dustHelper"]
        },
        "wayin.index":{
            "deps": ["dust", "dustHelper"]
        },
        "wayin.special":{
            "deps": ["dust", "dustHelper"]
        },
        "area_book.index":{
            "deps": ["dust", "dustHelper"]
        },
        "area_book.classroom":{
            "deps": ["dust", "dustHelper"]
        },
        "area_book.activity":{
            "deps": ["dust", "dustHelper"]
        },
        "area_book.playground":{
            "deps": ["dust", "dustHelper"]
        },
      "area_book.publicitycolumn":{
            "deps": ["dust", "dustHelper"]
        },
      "area_book.domestic_installation":{
            "deps": ["dust", "dustHelper"]
        },
        "area_book._form":{
            "deps": ["dust", "dustHelper"]
        },
        "area_book._form_ann":{
            "deps": ["dust", "dustHelper"]
        },
        "area_book._form_play":{
            "deps": ["dust", "dustHelper"]
        },
        "area_book._form_room":{
            "deps": ["dust", "dustHelper"]
        },
       "search.index":{
            "deps": ["dust", "dustHelper"]
        },
       "user_center.index":{
            "deps": ["dust", "dustHelper"]
        },
        "authority.index":{
            "deps": ["dust", "dustHelper"]
        },
      "authority.authTransfer":{
            "deps": ["dust", "dustHelper"]
        },

    }
});
requirejs([
    'jquery',
    'bootbox',
    'async',
    'bootTree',
    'bootSelector',
    'jstree',
    'bootstrap',
    'bootstrap-paginator',
    'bootDatePicker',
    'bootDatePicker.localization',

    'dust',
    'dustHelper',
    'baseCode',

    'jquery.validate',
    'jquery.validate.extend',
    'jquery.localization',
    'bootSelector.localization',
    'moment',
    '_',


    'header',
    'system',
    'system.menu.add',
    'system.menu.addSub',
    'system.menu.edit',
    'system.menu._form',
    'system.role.index',
    'system.role.roleForm',
    'system.role.addMenus',
    'system.role._menuTree',

    'interface.index',
    'interface._form',
    'interface.actionList',


    'search.index',


    'user_center.index',

    'party.index',
    'party.form',
    'party.detail',
    'party.interfaces',

    'system.data.base',
    'system.data.baseInfo',
    'system.data.baseInfoForm',
    'system.data.baseInfoList',

    'task.index',
    'task.tasks',

    'wayin.index',
    "wayin.special",
    'area_book.index',
    'area_book._form',
    'area_book._form_ann',
    'area_book._form_play',
    'area_book._form_room',
    'area_book.classroom',
    'area_book.activity',
    'area_book.playground',
    'area_book.publicitycolumn',
    'area_book.domestic_installation',
    'authority.index',
    'authority.authTransfer'

], function($, bt, as) {
    app.init($, bt, as);　
    app.user = user;
});
