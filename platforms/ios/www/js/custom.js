$(document).delegate('.ui-page', "swipeleft", function(){
    var $nextPage = $(this).next('[data-role="page"]');
    // swipe using id of next page if exists
    if ($nextPage.length > 0 && $.mobile.activePage.attr('id') != 'details') {
        $.mobile.changePage($nextPage, { transition: 'slide' });
    }
}).delegate('.ui-page', "swiperight", function(){
    var $prevPage = $(this).prev('[data-role="page"]');
    // swipe using id of next page if exists
    if ($prevPage .length > 0 && $.mobile.activePage.attr('id') != 'details') {
        $.mobile.changePage($prevPage, { transition: 'slide', reverse : true });
    }
});


// (function( $, window, undefined ) {
//     $.widget( "mobile.listview", $.mobile.listview, {
//         options: {
//             childPages: true,
//             page: "<div data-role='page'></div>",
//             header: "<div data-role='header'><a href='#' data-rel='back'>Back</a><h1></h1></div>",
//             content: "<div class='ui-content'></div>"
//         },
//         _create: function(){
//             this._super();
//             if( this.options.childPages ) {
//                 this._setupChildren();
//             }
//         },
//         _setupChildren: function() {
//             this._attachBindings();
//             this.element.find( "ul" )
//                 .css( "display","none" )
//                 .parent()
//                 .addClass("ui-btn ui-btn-icon-right ui-icon-carat-r");
//         },
//         _attachBindings: function() {
//             this._on({
//                 "click": "_handleSubpageClick"
//             });
//             this._on( "body", {
//                 "pagechange": function(){
//                     if ( this.opening === true ) {
//                         this.open = true;
//                         this.opening = false;
//                     } else if ( this.open === true ) {
//                         this.newPage.remove();
//                         this.open = false;
//                     }
//                 }
//             });
//         },
//         _handleSubpageClick: function( event ) {
//             if( $(event.target).closest( "li" ).children( "ul" ).length == 0 ) {
//                 return;
//             }
//             this.opening = true;
//             this.newPage = $( this.options.page ).uniqueId();
//             this.nestedList  = $( event.target ).children( "ul" )
//                 .clone().attr( "data-" + $.mobile.ns + "role", "listview" )
//                 .css( "display", "block" );
//             this.pageName = (
//                 $( event.target.childNodes[0] ).text().replace(/^\s+|\s+$/g, '').length > 0 )?
//                 $( event.target.childNodes[0] ).text() : $( event.target.childNodes[1] ).text();
//             this.pageID = this.newPage.attr( "id" );
//             // Build new page
//             this.newPage.append(
//                 $( this.options.header ).find( "h1" ).text( this.pageName ).end()
//             ).append(
//                 $( this.options.content )
//             ).find( "div.ui-content" ).append( this.nestedList );
//             $( "body" ).append( this.newPage );
//             $( "body" ).pagecontainer( "change", "#" + this.pageID );
//         }
//     });
// })( jQuery, this );




// /* for demo only */
// $(document).on("pagebeforecreate", "#history", function(e, ui) {
//   var items = '';
//   for (var i = 1; i < 100; i++) {
//     items += "<li>" + i + "</li>";
//   }
//   $("#list").append(items);
// });

// /* check scroll function */
// function checkScroll() {
//   var activePage = $.mobile.pageContainer.pagecontainer("getActivePage"),
//     screenHeight = $.mobile.getScreenHeight(),
//     contentHeight = $(".ui-content", activePage).outerHeight(),
//     header = $(".ui-header", activePage).outerHeight() - 1,
//     scrolled = $(window).scrollTop(),
//     footer = $(".ui-footer", activePage).outerHeight() - 1,
//     scrollEnd = contentHeight - screenHeight + header + footer;
//   if (activePage[0].id == "history" && scrolled >= scrollEnd) {
//     console.log("adding...");
//     addMore(activePage);
//   }
// }

// /* add more function */
// function addMore(page) {
//   $(document).off("scrollstop");
//   $.mobile.loading("show", {
//     text: "loading more..",
//     textVisible: true
//   });
//   setTimeout(function() {
//     var items = '',
//       last = $("li", page).length,
//       cont = last + 5;
//     for (var i = last; i < cont; i++) {
//       items += "<li>" + i + "</li>";
//     }
//     $("#list", page).append(items).listview("refresh");
//     $.mobile.loading("hide");
//     $(document).on("scrollstop", checkScroll);
//   }, 500);
// }

// /* attach if scrollstop for first time */
// $(document).on("scrollstop", checkScroll);




