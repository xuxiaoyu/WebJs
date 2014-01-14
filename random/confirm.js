/*!
 * Rewrite popup window
 * Date: 2013-07-03T13:30Z
 */

var OverlayPopup = {
    // function assigned as object property
    showConfirm: function(title, content, actions) { // /* if yes what action will be taken*/
          var self = this; // 保证拿到的一直是方法调用者
          actionContainer = $("<div class='actions'></div>")
          // check title  execute automatically when jump into the func body
          titleElement = function(){
                if ( Helper.isNullable(title) ) {
                    return $();
                }
                // jQuery generator
                return $('<div class="title"></div>').html(title);
          }();
    }
};
