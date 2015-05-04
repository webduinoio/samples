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
    var sound = document.getElementById('sound'),
      led = document.getElementById('led'),
      light = document.getElementById('light');

    sound.on('detected', function () {
      led.toggle();
      if (led.isOn()) {
        light.className = "on";
      } else {
        light.className = "off";
      }
    });

    msg.className = "set";
  }

}, false);
