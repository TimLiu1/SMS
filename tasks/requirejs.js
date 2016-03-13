'use strict';


module.exports = function requirejs(grunt) {
	// Load task
	grunt.loadNpmTasks('grunt-contrib-requirejs');

	// Options
	return {
        build: {
            options: {
                baseUrl: 'public/js',
                dir: '.build/js',
                optimize: 'uglify',
                "paths": {
                    "jquery": "../components/jquery/dist/jquery.min",
                    "bootstrap": "bootstrap.min",
                    "bootstrap-paginator": "bootstrap-paginator.min",
                    "bootbox": "bootbox.min",
                    "bootTree": "bootstrap-tree",
                    "bootSelector": "bootstrap-select.min",
                    "jstree": "jstree.min",
                    "dust": "../components/dustjs-linkedin/dist/dust-core.min",
                    "dustHelper": "../components/dustjs-linkedin-helpers/dist/dust-helpers.min",
                    "baseCode": "templates/clientBaseHelper",
                    "jquery.validate": "jquery.validate.min",
                    "jquery.validate.extend": "jquery.validate.extend",
                    "jquery.localization": "localization/messages_zh",
                    "bootSelector.localization": "localization/bootselect-zh_CN.min",
                    "bootDatePicker": "bootstrap-datepicker.min",
                    "bootDatePicker.localization": "localization/bootstrap-datepicker.zh-CN.min",
                    "moment": "moment.min",
                    "_": "underscore-min",
                    "async": "async.min",

                    "header": "templates/header",
                    "system": "templates/system/menu/index",
                    "system.menu.add": "templates/system/menu/add",
                    "system.menu.addSub": "templates/system/menu/addSub",
                    "system.menu.edit": "templates/system/menu/edit",
                    "system.menu._form": "templates/system/menu/_form",
                    "system.role.index": "templates/system/role/index",
                    "system.role.roleForm": "templates/system/role/roleForm",
                    "system.role.addMenus": "templates/system/role/addMenus",
                    "system.role._menuTree": "templates/system/role/_menuTree",

                    "interface.index": "templates/interface/index",
                    "interface._form": "templates/interface/_form",
                    "interface.actionList": "templates/interface/actionList",

                    "party.index": "templates/party/index",
                    "party.form": "templates/party/form",
                    "party.detail": "templates/party/detail",
                    "party.interfaces": "templates/party/interfaces",

                    "system.data.base": "templates/system/data/base",
                    "system.data.baseInfo": "templates/system/data/baseInfo",
                    "system.data.baseInfoForm": "templates/system/data/baseInfoForm",
                    "system.data.baseInfoList": "templates/system/data/baseInfoList",

                    "task.index":"templates/task/index",
                    "task.tasks":"templates/task/tasks"
                },
                modules: [
                    { name: 'main' }
                ]
            }
        }
	};
};
