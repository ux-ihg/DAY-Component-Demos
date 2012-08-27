$(document).ready(function(){
   // INITIALLY HIDE RES MOD - MOVE IT OUT OF VIEWING PORT
$('.res-mod-popup-wrap-inner, .res-mod-arrow').css('left','-9999px');

  // ON BUTTON CLICK SHOW RES MOD - MOVE INTO VIEWING PORT AND ANIMATE IN
$('.res-mod-popup-btn').toggle(function (){
 $(this).addClass('btn-on');
 $(this).attr('aria-expanded','true');
    $(this).parent().find('.res-mod-popup-wrap-inner, .res-mod-arrow').css('left', '');
    $(this).parent().find('.res-mod-popup-wrap-inner, .res-mod-arrow').stop().animate({opacity: '1'}, 300);
    $(this).parent().find('.res-mod-popup-wrap-inner .res-mod-popup').attr('aria-hidden','true');
    $(this).parent().find('.res-mod-popup').attr('tabindex','-1');
    $(this).parent().find('.res-mod-popup').focus();

},function (){
  $(this).removeClass('btn-on');
  $(this).attr('aria-expanded','false');
    $(this).parent().find('.res-mod-popup-wrap-inner, .res-mod-arrow').stop().animate({opacity: '0'}, 300);
    $(this).parent().find('.res-mod-popup-wrap-inner, .res-mod-arrow').css('left', '-9999px').show();
    $(this).parent().find('.res-mod-popup').removeAttr('tabindex');
    $(this).parent().find('.res-mod-popup-wrap-inner .res-mod-popup').attr('aria-hidden','true');
    $(this).attr('tabindex','0');
    $(this).focus();
});
  // FADEOUT - THEN MOVE OUT OF VIEWING PORT


  // ON FOCUS OUT CLOSE POPUP LAYER

$('.res-mod-popup').blur(function(event){
    $(this).parents().find('.btn-on').attr('tabindex','-1');
    $(this).parents().find('.btn-on').focus();
  });
  // CLOSE RESERVATION MOD WHEN CLICKED OUTSIDE
  $(document).click(function(e){
    var target = $(e.target);
    if(!target.parents().andSelf().is('.res-mod-popup-wrap-inner') && $('.res-mod-popup-btn').hasClass('btn-on')){
      $('.btn-on').click();
    }
    e.stopPropagation();
});
});