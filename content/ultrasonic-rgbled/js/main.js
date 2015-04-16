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
      show = document.getElementById('show'),
      color = document.getElementById('color'),
      rgb = document.getElementById('rgb');

    ultrasonic.ping(function (cm) {
      show.innerHTML = cm;
      if (cm < 10) {
        rgb.setColor(255, 0, 0); // red , green , blue
        color.style.backgroundColor = 'rgba(255, 0, 0, 255)';
      } else if (cm > 10 && cm < 20) {
        rgb.setColor(0, 255, 0); // red , green , blue
        color.style.backgroundColor = 'rgba(0, 255, 0, 255)';
      } else {
        rgb.setColor(0, 0, 255); // red , green , blue
        color.style.backgroundColor = 'rgba(0, 0, 255, 255)';
      }
    }, 1000);

    msg.className = "set";
  };

}, false);
