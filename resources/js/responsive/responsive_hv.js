// zeynepjs initialization for demo
$(function() {

	var currdsopen= 'nonexistentds';

	// add closing X to #hv-drawer-left
	$('#hv-drawer-left').prepend('<div id="hvmobdrawerclose_div"><img id="hvmobdrawerclose" src="https://develop.helioviewer.org/resources/images/mobile/mobdsclose2.png">&nbsp;&nbsp;</div>');

	// closing drawer function
	$("#hvmobdrawerclose").click(function(){
		$('#accordion-date, #accordion-images, #accordion-events, #accordion-bodies').css('display','none');
		$('#hvmobdrawerclose_div').css('display','none');
		$('#hv-drawer-left').css('display','none');
		$('#hv-drawer-left').attr('style', 'display: none');
		currdsopen= 'nonexistentds'
	});

	// hide triangle disclosure
	$('#accordion-images .header h1').css('margin-left','70px');

  var zeynep = $('.zeynep').zeynep({
    opened: function () {
      //console.log('the side menu is opened')
    }
  })

  // dynamically bind 'closing' event
  zeynep.on('closing', function () {
    //console.log('this event is dynamically binded')
  })

  // handle zeynepjs overlay click
  $('.zeynep-overlay').on('click', function () {
    $(".hamburger").removeClass("is-active");
	zeynep.close();
  })

  // open zeynepjs side menu
  $('.btn-open, .hamburger').on('click', function () {
    if($(".hamburger").hasClass("is-active")) {
		$(".hamburger").removeClass("is-active");
		zeynep.close();
	}
	else {
		zeynep.open();
		$(".hamburger").addClass("is-active");
	}
  })


	// open drawer by tab click
	
	$(".hvmobdstabs").click(function(){
		//$('.hvmobdstabs').css({'background-image':'url(https://develop.helioviewer.org/resources/images/backmobilemenubg2.png)'});
		//var hvmobtabid = $(this).attr('drawersec')+'_mobtab';
		// console.log(hvmobtabid);
		//$('#'+hvmobtabid).css({'background-image':'url(https://develop.helioviewer.org/resources/images/mobiletabbgwhite1.png)','color':'black'});
		var thisdrawersect= $(this).attr('drawersec');
		
		$('.hvmobdstabs .hvmobds_icon, .hvmobdstabs span').css('filter','invert(81%) sepia(7%) saturate(4%) hue-rotate(6deg) brightness(95%) contrast(91%)');

		$(this).children( '.hvmobds_icon, span' ).css('filter','invert(91%) sepia(89%) saturate(602%) hue-rotate(331deg) brightness(102%) contrast(94%)');
		
		// if it's not already open, close currently open drawer and open correct one
		if(thisdrawersect != currdsopen) {
			$('#hv-drawer-left').attr('style', 'display: none');
			//$('#hv-drawer-left').fadeOut("fast");
			$('#'+currdsopen).css('display','none');
			$('#'+thisdrawersect).css('display','block');
			$('#hv-drawer-left').css({'display':'block','height':'100%'});
			$('#hvmobdrawerclose_div').css('display','block');
			currdsopen= thisdrawersect;
		}

	});

});




// START media query 

// Create a condition that targets viewports at least 790px wide
const mediaQuery = window.matchMedia('(max-width: 790px)');

function handleTabletChange(e) {
  // Check if the media query is true
  if (e.matches) {
    // Then log the following message to the console
    console.log('Media Query Matched!');
	$('#hv-drawer-left').attr('style', 'display: none !important');
	$('#hv-drawer-left').css({'display':'none'});
	
  }
}

// Register event listener
mediaQuery.addListener(handleTabletChange);

// Initial check
handleTabletChange(mediaQuery);


// END media query 
