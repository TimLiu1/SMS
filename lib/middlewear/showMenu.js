"use strict";
module.exports = function() {
    return function(req, res, next) {
        if (req.isAuthenticated()) {
            var roleMenuTree = req.session.roleMenuTree;
            var logedInUser = res.locals.logedInUser;
            var menuInit = {
                roleMenuTree: roleMenuTree,
                logedInUser: logedInUser
            };
            var url = req.originalUrl;
            url = url.split('?')[0];
            if (url.indexOf('/images/') == 0) {
                res.locals.subIndex = -1;
                menuInit.subIndex = -1;
                res.locals.menuInit = menuInit;
                return next();
            }
            if (url.indexOf('/user/') >= 0) {
                res.locals.subIndex = -1;
                menuInit.subIndex = -1;
                res.locals.menuInit = menuInit;
                return next();
            }
            if (url === '/' || url === '/apis/menus') {
                res.locals.subIndex = -1;
                menuInit.subIndex = -1;
                res.locals.menuInit = menuInit;
                return next();
            }

            var u = url.split('/');

            for (var i = 0, l = roleMenuTree.length; i < l; i++) {
                if (u.indexOf(roleMenuTree[i].url.replace(/\//g, '')) >= 0) {
                    res.locals.subIndex = i;
                    menuInit.subIndex = i;
                    break;
                }
            }
        } 
        res.locals.menuInit = menuInit;
        return next();
    };
};