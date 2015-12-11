var pointsArray = document.getElementsByClassName('point');

function revealPoint(point) {
  point.style.opacity = 1;
  point.style.transform = "scaleX(1) translateY(0)";
  point.style.msTransform = "scaleX(1) translateY(0)";
  point.style.WebkitTransform = "scaleX(1) translateY(0)";
}

function animatePoints(points) {
  forEach(points, revealPoint);
}

window.onload = function() {
  // Automatically animate the points on a tall screen where scrolling can't trigger the animation
  var contentHeight = 950;
  if (window.innerHeight > contentHeight) {
    animatePoints(pointsArray);
  }

  // Automatically animate the points when the user scrolls down into that section
  var sellingPoints = document.getElementsByClassName('selling-points')[0];
  var sellingDepth = 200;
  var scrollDistance = sellingPoints.getBoundingClientRect().top - window.innerHeight + sellingDepth;

  window.addEventListener("scroll", function(event) {
    if (document.body.scrollTop >= scrollDistance) {
      animatePoints(pointsArray);
    }
  });
};
