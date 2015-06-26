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
    var led = document.getElementById('led'),
      light = document.getElementById('light'),
      r = document.getElementById('r'),
      show = document.getElementById('show');

      show.innerText = 0;

      var servo = document.getElementById('servo'),
      a = 0;

      servo.angle= -a + 90;
      show.innerText = a;

      r.addEventListener('change',function(e){
        var t = e.target;
        a = t.value;
        servo.angle= -a + 90;
        show.innerText = a;
      }); 
    
    msg.className = "set";
  };

}, false);
