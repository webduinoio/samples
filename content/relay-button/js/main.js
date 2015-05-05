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
    var relay = document.getElementById('relay'),
      button = document.getElementById('button'),
      data = document.getElementById('data');

    button.on('pressed', function () {
      relay.toggle();
      if (relay.isOn()) {
        data.innerHTML = "Relay on!";
      } else {
        data.innerHTML = "Relay off!";
      }
    });

    msg.className = "set";
    board.off('ready', ready);
  }

}, false);
