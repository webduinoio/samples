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
    var led1 = document.getElementById('led1'),
      led2 = document.getElementById('led2'),
      light1 = document.getElementById('light1'),
      light2 = document.getElementById('light2');

    ledAction(led1, light1);
    ledAction(led2, light2);

    msg.className = "set";
  };

  function ledAction(led, light) {
    led.on();
    light.className = 'on';

    light.addEventListener('click', function () {
      if (led.isOn()) {
        this.className = 'off';
        led.off();
      } else {
        this.className = 'on';
        led.on();
      }
    }, false);
  }

}, false);
