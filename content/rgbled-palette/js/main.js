window.addEventListener('WebComponentsReady', function () {
  var setBtn = document.getElementById('set'),
    device = document.getElementById('device'),
    board = document.getElementById('board');

  msg.className = "ready";
  device.setAttribute('value', localStorage.device || "");

  setBtn.addEventListener('click', function (e) {
    msg.className = "setting";

    board.device = device.value;
    board.on('ready', ready);
    board.init();

    localStorage.device = device.value;

    e.stopPropagation();
    e.preventDefault();
    return false;
  }, false);

  function ready() {
    var redBtn = document.getElementById('redBtn'),
      greenBtn = document.getElementById('greenBtn'),
      blueBtn = document.getElementById('blueBtn'),
      rgb = document.getElementById('rgb'),
      show = document.getElementById('show'),
      r = 0,
      g = 0,
      b = 0;

    var handler = function(evt) {
      var target = evt.target,
        id = target.id;

      switch (id) {
        case 'redBtn':
          r = target.value;
          break;
        case 'greenBtn':
          g = target.value;
          break;
        case 'blueBtn':
          b = target.value;
          break;
      }
      
      show.style.backgroundColor = 'rgba(' + r + ',' + g + ',' + b + ',' + '255)';
      rgb.setColor(r, g, b);
    };

    redBtn.addEventListener('change', handler, false);
    greenBtn.addEventListener('change', handler, false);
    blueBtn.addEventListener('change', handler, false);

    msg.className = "set";
  };

}, false);
