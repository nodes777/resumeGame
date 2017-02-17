var touchFile = function(player){

  if (Modernizr.touchevents) {
    console.log('Touch events enabled');

    $(".instructions").hide();

     $('#touchIconUp').bind('touchstart', function(e) {
        e.preventDefault();
        player.jump = true;
    });

     $('#touchIconUp').bind('touchend', function(e) {
        e.preventDefault();
        player.jump = false;
    });

      $('#touchIconLeft').bind('touchstart', function(e) {
        e.preventDefault();
        player.left = true;
    });

    $('#touchIconLeft').bind('touchend', function(e) {
        e.preventDefault();
        player.left = false;
    });


    $('#touchIconRight').bind('touchstart', function(e) {
        e.preventDefault();
        player.right = true;
    });

    $('#touchIconRight').bind('touchend', function(e) {
        e.preventDefault();
        player.right = false;
    });

  } else {
    //console.log('No touch capability detected');
   $(".touchies").hide();

  }
}