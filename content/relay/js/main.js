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
    var relay = document.getElementById('relay');

    light.addEventListener('click', function() {
      if(light.className == 'on'){
        relay.off();
        light.className = 'off';
      }else{
        relay.on();
        light.className = 'on';
      }
    }, false);
    
    msg.className = "set";
  };

}, false);
