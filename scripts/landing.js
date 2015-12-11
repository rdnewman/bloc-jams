var pointsArray = document.getElementsByClassName('point');

var animatePoints = function(points) {
  function revealPoint(point) {
    points[point].style.opacity = 1;
    points[point].style.transform = "scaleX(1) translateY(0)";
    points[point].style.msTransform = "scaleX(1) translateY(0)";
    points[point].style.WebkitTransform = "scaleX(1) translateY(0)";
  }

  for (var point = 0; point < points.length; point++) {
    revealPoint(point);
  }
};

window.onload = function() {
  // Automatically animate the points on a tall screen where scrolling can't trigger the animation
  var contentHeight = 950;
  if (window.innerHeight > contentHeight) {
    animatePoints(pointsArray);
  }

  var sellingPoints = document.getElementsByClassName('selling-points')[0];
  var sellingDepth = 200;
  var scrollDistance = sellingPoints.getBoundingClientRect().top - window.innerHeight + sellingDepth;

  window.addEventListener("scroll", function(event) {
    if (document.body.scrollTop >= scrollDistance) {
      animatePoints(pointsArray);
    }
  });
};
