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
    var dht = document.getElementById('dht'),
      data = document.getElementById('data');

    dht.read(function (evt) {
      data.innerHTML = new Date().toLocaleString() + "<br>溫度:" + evt.temperature + " 度C<br> 溼度:" + evt.humidity + "%";
    }, 1000);

    msg.className = "set";
    board.off('ready', ready);
  }

}, false);
