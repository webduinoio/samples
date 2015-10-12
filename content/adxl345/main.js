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
      var adxl = document.getElementById('adxl');

      light.addEventListener('click', function() {
        if (light.className == 'on') {
          light.className = 'off';
          adxl.off();
        } else {
          light.className = 'on';
          adxl.on(callback);
        }
      }, false);

      msg.className = "set";
    }

    function callback(x, y, z, roll, pitch) {
      var msgRecv = document.getElementById('msgRecv');
      var space = document.querySelectorAll('.space');
      var ss = document.createElement('span');
      ss.innerHTML += '<br>';
      ss.innerHTML += '<span '+ (x < 0 ? 'style="color:red;" ' : '') +'>x: ' + x + '</span>';
      ss.innerHTML += '<span '+ (y < 0 ? 'style="color:red;" ' : '') +'>, y: ' + y + '</span>';
      ss.innerHTML += '<span '+ (z < 0 ? 'style="color:red;" ' : '') +'>, z: ' + z + '</span>';
      ss.innerHTML += '<span>, roll: '+ roll + '</span>';
      ss.innerHTML += '<span>, pitch: '+ pitch + '</span>';
      ss.innerHTML += '<span>, ' + new Date().toLocaleTimeString() + '</span>';
      msgRecv.insertBefore(ss, msgRecv.childNodes[0]);

      space[0].style.transform = 'rotateX(' + (roll) + 'deg) rotateY(' + (0-pitch) + 'deg) rotateZ(0deg)';
    }
  });