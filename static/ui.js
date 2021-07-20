document.addEventListener('DOMContentLoaded', function () {
  var elems = document.querySelectorAll('.sidenav');
  options = {
    'edge': 'right'
  }
  var instances = M.Sidenav.init(elems, options);
});

console.log("hmmm")


document.addEventListener('DOMContentLoaded', function () {
  var elems = document.querySelectorAll('.fixed-action-btn');
  options = {
    'direction': 'top'
  }
  var instances = M.FloatingActionButton.init(elems, options);
});