window.addEventListener('WebComponentsReady', function () {
  var setBtn = document.getElementById('set'),
    device = document.getElementById('device'),
    board = document.getElementById('board');

  msg.className = "ready";

  setBtn.addEventListener('click', function (e) {
    msg.className = "setting";

    board.device = device.value;
    board.on('ready', ready);
    board.init();

    e.stopPropagation();
    e.preventDefault();
    return false;
  }, false);

  function ready() {
    var redBtn = document.getElementById('redBtn'),
      greenBtn = document.getElementById('greenBtn'),
      blueBtn = document.getElementById('blueBtn'),
      rgb = document.getElementById('rgb');

    redBtn.addEventListener('click', function () {
      rgb.setColor(255, 0, 0); // red , green , blue
    }, false);

    greenBtn.addEventListener('click', function () {
      rgb.setColor(0, 255, 0); // red , green , blue
    }, false);

    blueBtn.addEventListener('click', function () {
      rgb.setColor(0, 0, 255); // red , green , blue
    }, false);

    msg.className = "set";
  };

}, false);
