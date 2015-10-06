
window.addEventListener('WebComponentsReady', function() {
  var board = document.getElementById('board');
  var device = document.getElementById('device');
  var light = document.getElementById('light');
  var clearMsg = document.getElementById('clearMsg');
  var msgRecv = document.getElementById('msgRecv');
  var msg = document.getElementById('msg');
  var setBtn = document.getElementById('set');

  device.setAttribute('value', localStorage.device || "");

  msg.className = "ready";

  setBtn.addEventListener('click', function(e) {
    msg.className = "setting";
    light.className = 'off';
    msgRecv.innerHTML = '';
    board.device = device.value;
    localStorage.device = device.value;
    board.on('ready', ready);
    board.init();
    e.stopPropagation();
    e.preventDefault();
    return false;
  }, false);

  clearMsg.addEventListener('click', function() {
    msgRecv.innerHTML = '';
  });

  function ready() {
    var photocell = document.getElementById('photocell');

    light.addEventListener('click', function() {
      if (light.className == 'on') {
        light.className = 'off';
        photocell.off();
      } else {
        light.className = 'on';
        photocell.on(success);
      }
    }, false);

    msg.className = "set";
  }

  function success(val) {
    var msgRecv = document.getElementById('msgRecv');
    var ss = document.createElement('span');
    ss.innerHTML += '<br>';
    ss.innerHTML += val;
    ss.innerHTML += '<span>, ' + new Date().toLocaleTimeString() + '</span>';
    msgRecv.insertBefore(ss, msgRecv.childNodes[0]);
  }
});