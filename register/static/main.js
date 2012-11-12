'use strict';

jQuery(function($){
  var LECTURE = window.LECTURE;
  if(LECTURE != undefined){
    $('.student-was-present-input').click(function(e){
      e.preventDefault();
      var $this = $(this);
      var studentID = $this.attr('name');
      var studentPresence = $this.attr('checked') != undefined;
      var $wrap = $this.parent();
      $this.hide();
      $wrap.append('<div class="gauge"></div>');

      var renderPresence = function(){
        $wrap.find('.gauge').remove();
        if(studentPresence){
          $this.attr('checked', '');
        }else {
          $this.removeAttr('checked');
        }
        $this.show();
      };
      
      $.ajax({
        data: {
          student: studentID,
          value: studentPresence ? 1 : 0
        },
        success: function(response){
          studentPresence = !!(response - 0);
          renderPresence();
        },
        error: function(){
          renderPresence();
        },
        headers: {
          'X-CSRFToken': Cookie.get('csrftoken')
        },
        type: 'POST',
        url: LECTURE.presenceChangingURL
      });
    });
  }
});

(function($){
  
})(jQuery);