window.addEventListener('WebComponentsReady', function() {
    var board = document.getElementById('board');
    var device = document.getElementById('device');
    var max = document.getElementById('max');
    var msg = document.getElementById('msg');
    var setBtn = document.getElementById('set');
    var exec = document.getElementById('exec');
    var dataInput = document.getElementById('dataInput');

    device.setAttribute('value', localStorage.device || "");
    msg.className = "ready";

    setBtn.addEventListener('click', function(e) {
      setBtn.setAttribute('disabled', true);
      msg.className = "setting";
      board.device = device.value;
      localStorage.device = device.value;
      board.on('ready', ready);
      board.init();
      e.stopPropagation();
      e.preventDefault();
      return false;
    }, false);

    exec.addEventListener('click', function() {
      if (!dataInput.value) {
        return false;
      } 

      var data = dataInput.value.replace(/\s/g, '').split(',');
      max.animate(data, 100, 5000, function() {
        console.log('結束');
        max.on();
      });
    }, false);

    function ready() {
      msg.className = "set";
      exec.removeAttribute('disabled');
    }

  });