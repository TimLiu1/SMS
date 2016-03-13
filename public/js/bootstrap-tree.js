function menuTreeInit() {
    $('.tree li:has(ul)').addClass('parent_li').find(' > span').attr('title', '展开/折叠').attr('data-toggle', 'tooltip').attr('data-placement', 'top');

    $('.tree li.parent_li > span').on('click', function(e) {
        var children = $(this).parent('li.parent_li').find(' > ul > li');
        if (children.is(":visible")) {
            children.hide('fast');
            $(this).find(' > i').addClass('glyphicon-plus-sign').removeClass('glyphicon-minus-sign');
        } else {
            children.show('fast');
            $(this).find(' > i').addClass('glyphicon-minus-sign').removeClass('glyphicon-plus-sign');
        }
        e.stopPropagation();
    });
};