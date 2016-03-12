$(document).delegate('.ui-page', "swipeleft", function(){
    var $nextPage = $(this).next('[data-role="page"]');
    // swipe using id of next page if exists
    if ($nextPage.length > 0) {
        $.mobile.changePage($nextPage, { transition: 'slide' });
    }
}).delegate('.ui-page', "swiperight", function(){
    var $prevPage = $(this).prev('[data-role="page"]');
    // swipe using id of next page if exists
    if ($prevPage .length > 0) {
        $.mobile.changePage($prevPage, { transition: 'slide', reverse : true });
    }
});