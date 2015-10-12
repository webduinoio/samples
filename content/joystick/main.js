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
      var joystick = document.getElementById('joystick');

      light.addEventListener('click', function() {
        if (light.className == 'on') {
          light.className = 'off';
          joystick.off('message', read);
        } else {
          light.className = 'on';
          joystick.on('message', read);
        }
      }, false);

      msg.className = "set";
    }

    function read(x, y, z) {
      var msgRecv = document.getElementById('msgRecv');
      var ss = document.createElement('span');
      ss.innerHTML += '<br>';
      ss.innerHTML += '<saan>, x: '+ x +'</span>';
      ss.innerHTML += '<saan>, y: '+ y +'</span>';
      ss.innerHTML += '<saan>, z: '+ z +'</span>';
      ss.innerHTML += '<span>, ' + new Date().toLocaleTimeString() + '</span>';
      msgRecv.insertBefore(ss, msgRecv.childNodes[0]);
    }
  });