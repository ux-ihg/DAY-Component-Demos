/* ################################################################################## 
 * ALL EXTERNAL JQUERY PLUGINS AND CUSTOM CODE SHOULD BE WRAPPED WITH THE FOLLOWING
 * Just for this code revert namespace back to jQuery defaults
*/
(function ($) {
	//add your code here
	$('div').css('background-color','green');
	//same as
	//jQuery('div').css('background-color','blue');

})(jQuery);
/* ################################################################################## */

// Out here $ doesn't reference the jQuery lib (see noConflict in index.html)
						

