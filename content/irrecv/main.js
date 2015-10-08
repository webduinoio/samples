window.addEventListener('WebComponentsReady', function() {
    var board = document.getElementById('board');
    var device = document.getElementById('device');
    var light = document.getElementById('light');
    var clearMsg = document.getElementById('clearMsg');
    var msgRecv = document.getElementById('msgRecv');
    var msg = document.getElementById('msg');
    var setBtn = document.getElementById('set');

    // 遙控器的編碼
    var dataMap = {
      '0ff6897': '1',
      '0ff9867': '2',
      '0ffb04f': '3',
      '0ff30cf': '4',
      '0ff18e7': '5',
      '0ff7a85': '6',
      '0ff10ef': '7',
      '0ff38c7': '8',
      '0ff5aa5': '9',
      '0ff4ab5': '0',
      '0ff42bd': '*',
      '0ff52ad': '#',
      '0ffa857': 'down',
      '0ff22dd': 'left',
      '0ffc23d': 'right',
      '0ff629d': 'up',
      '0ff2fd': 'ok'
    };

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
      var irrecv = document.getElementById('irrecv');

      light.addEventListener('click', function() {
        if (light.className == 'on') {
          light.className = 'off';
          irrecv.off();
        } else {
          light.className = 'on';
          irrecv.on(success, errorHandler);
        }
      }, false);

      msg.className = "set";
    }

    function success(val) {
      var msgRecv = document.getElementById('msgRecv');
      var ss = document.createElement('span');
      ss.textContent = (dataMap[val] || val) + ',';
      msgRecv.appendChild(ss);
    }

    function errorHandler(val, originalMsg) {
      var msgRecv = document.getElementById('msgRecv');
      var ss = document.createElement('span');
      ss.textContent = val + ',';
      msgRecv.appendChild(ss);
      console.log('error:', originalMsg);
    }
  });