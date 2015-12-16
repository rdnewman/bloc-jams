var pointsArray = document.getElementsByClassName('point');

var animatePoints = function() {
  $.each($('.point'), function() {
    $(this).css({
      opacity: 1,
      transform: 'scaleX(1) translateY(0)'
    });
  });
};

$(window).load( function() {
  // Automatically animate the points on a tall screen where scrolling can't trigger the animation
  var contentHeight = 950;
  if ($(window).height() > contentHeight) {
    animatePoints();
  }

  var sellingDepth = 200;
  var scrollDistance = $('.selling-points').offset().top - $(window).height() + sellingDepth;

  $(window).scroll( function(event) {
    if ($(window).scrollTop() >= scrollDistance) {
        animatePoints();
    }
  });
});
