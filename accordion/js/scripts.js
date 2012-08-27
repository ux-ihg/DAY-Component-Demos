$(document).ready(function(){
 // hide answers or subsection - dd tags
 $('dl.accordion dd').hide();
 // on dt click show/hide the child dd
  $('dl.accordion dt a').live('click',function(){
    $('dl.accordion').children('dd').removeAttr('tabindex');
    $(this).parent().toggleClass('active').next().stop().slideToggle();
    $(this).parent().next().attr('tabindex','-1').focus();
  });


  //expand all per section
  $('a.expand-link').click(function(){
  	$(this).parent().parent().find('dl dd').slideDown();
  	$(this).parent().parent().find('dl dt').addClass('active');
  });
  //collapse all per section
  $('a.collapse-link').click(function(){
  	$(this).parent().parent().find('dl dd').slideUp();
  	$(this).parent().parent().find('dl dt').removeClass('active');
  });
});

