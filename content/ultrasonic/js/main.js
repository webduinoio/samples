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
      img = document.getElementById('img');

    ultrasonic.ping(function(cm) {
      img.style.width = cm*20 + 'px';
      img.style.height = cm*20 + 'px';
    }, 1000);

    msg.className = "set";
  };

}, false);
