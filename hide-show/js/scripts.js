$(document).ready(function(){
 // hide content
 $('.hide-show .hidden-content').hide();
 // on trigger click show/hide the content
  $('.hide-show .trigger').live('click',function(){
    $(this).parent().children('.hidden-content').removeAttr('tabindex');
    $(this).parent().children('h3').toggleClass('active').next('.hidden-content').stop().slideToggle('normal',function(){
        if($(this).is(':visible')){
          $(this).attr('tabindex','-1').focus();
        }else{
          $(this).removeAttr('tabindex');
          //$(this).prev('.trigger').attr('tabindex','-1').focus(); // change focus back to previous trigger
        }
      });
  });
});

