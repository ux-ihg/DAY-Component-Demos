$(document).ready(function(){
   // INITIALLY HIDE RES MOD - MOVE IT OUT OF VIEWING PORT

$('.res-mod-popup-wrap-inner, .res-mod-arrow').css('left','-9999px');
 
 var $resBtn = $('.res-mod-popup-btn');

hideResMod = function (){
    
  }

  // ON BUTTON CLICK SHOW RES MOD - MOVE INTO VIEWING PORT AND ANIMATE IN
$resBtn.click(function(){
    if(!$(this).hasClass('btn-on')){
    $(this).addClass('btn-on');
    console.log(this);
    $(this).parent().find('.res-mod-popup-wrap-inner, .res-mod-arrow').css('left', '');
    $(this).parent().find('.res-mod-popup-wrap-inner, .res-mod-arrow').stop().animate({opacity: '1'}, 300);
    $(this).parent().find('.res-mod-popup').attr('tabindex','-1');
    $(this).parent().find('.res-mod-popup').focus();
    $(this).parent().find('.res-mod-popup').bind('blur');

    }else{
    $().removeClass('btn-on');
    console.log('two');
    $(this).toggleClass('btn-on');
    $(this).parent().find('.res-mod-popup-wrap-inner, .res-mod-arrow').stop().animate({opacity: '0',}, 300);
    $(this).parent().find('.res-mod-popup-wrap-inner, .res-mod-arrow').css('left', '-9999px').show();
    $(this).parent().find('.res-mod-popup').removeAttr('tabindex');
    $(this).attr('tabindex','-1');
    $(this).focus();
  }
});

  // ON FOCUS OUT CLOSE POPUP LAYER
  $('.res-mod-popup').bind('focusout',function(event){
      
  });
  
  // CLOSE RESERVATION MOD WHEN CLICKED OUTSIDE
  $(document).click(function(e){
    var target = $(e.target);
    if(!target.parents().andSelf().is('.res-mod-popup-wrap-inner') && $('.res-mod-popup-btn').hasClass('btn-on')){
      $resBtn.click();
    }
    e.stopPropagation();
});
});