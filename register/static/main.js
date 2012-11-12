'use strict';

jQuery(function($){
  var LECTURE = window.LECTURE;
  
  if(LECTURE != undefined){
    $('.student-was-present-input')
      .click(function(e){
        var $this = $(this);
        var studentID = $this.attr('name');
        var studentPresence = !$this.is(':checked');
        var $wrap = $this.parent();
        $this.hide();
        $wrap.append('<div class="gauge"></div>');

        var renderPresence = function(){
          $wrap.find('.gauge').remove();
          $this.prop('checked', studentPresence);
          $this.show();
        };
        
        $.ajax({
          data: {
            student: studentID,
            value: !studentPresence ? 1 : 0
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
        
      })
    ;
  }
  
});

(function($){
  
})(jQuery);