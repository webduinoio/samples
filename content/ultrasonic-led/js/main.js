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
    var ultrasonic = document.getElementById('ultrasonic'),
      led = document.getElementById('led'),
      light = document.getElementById('light');

    ultrasonic.ping(function (cm) {
      if (cm > 20) {
        led.on();
        light.className = "on";
      } else {
        led.off();
        light.className = "off";
      }
    }, 1000);

    msg.className = "set";
  };

}, false);
