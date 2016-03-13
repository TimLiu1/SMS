'use strict';
module.exports = function() {
    return function(req, res, next) {
        if (req.session.theme) {
            res.locals.brandTitle = req.session.brandTitle;
            res.locals.title = req.session.title;
            res.locals.theme = req.session.theme;
            res.locals.icon = req.session.icon;
        } else {
            res.locals.brandTitle = '';
            res.locals.title = '';
            res.locals.theme = '';
            res.locals.icon = '';
        }
        next();
    };
};