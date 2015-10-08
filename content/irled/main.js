window.addEventListener('WebComponentsReady', function() {
  var board = document.getElementById('board');
  var device = document.getElementById('device');
  var msg = document.getElementById('msg');
  var setBtn = document.getElementById('set');
  var light = document.getElementById('light');
  var irled = document.getElementById('irled');

  device.setAttribute('value', localStorage.device || "");

  msg.className = "ready";

  setBtn.addEventListener('click', function(e) {
    this.setAttribute('disabled', true);
    msg.className = "setting";
    board.device = device.value;
    localStorage.device = device.value;
    board.on('ready', ready);
    board.init();
    e.stopPropagation();
    e.preventDefault();
    return false;
  }, false);

  function ready() {
    msg.className = "set";
    light.className = 'off';
    light.addEventListener('click', lightClickHandler);
  }

  function lightClickHandler() {
    if (light.className == 'on') {
      this.className = 'off';
    } else {
      this.className = 'on';
      irled.send();
    }
  }

}, false);