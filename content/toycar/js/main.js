window.addEventListener('load', function() {

  var  board = document.getElementById('board'),
    body = document.getElementById('body'),
    F = document.getElementById('f'),
    B = document.getElementById('b'),
    L = document.getElementById('l'),
    R = document.getElementById('r'),
    show = document.getElementById('show'),
    bubu = document.getElementById('bubu'),
    bg = document.getElementById('bg'),
    cf = 0,
    cb = 0,
    cl = 0,
    cr = 0,
    w = window;

  var deviceID;

  var deviceInput = document.querySelector('.deviceInput');
  var deviceBtn = document.querySelector('.deviceBtn');

  if (localStorage.toyCarDeviceId) {
    deviceInput.value = localStorage.toyCarDeviceId;
  }

  F.style.height = (w.innerWidth / 3.2 - 40) + 'px';
  F.style.bottom = ((w.innerWidth / 3.2) - 35) + 'px';
  B.style.height = ((w.innerWidth / 3.2) - 40) + 'px';
  L.style.height = w.innerWidth / 4 * 2 + 'px';
  R.style.height = w.innerWidth / 4 * 2 + 'px';
  //bubu.style.height = (bubu.offsetWidth*1.4) + 'px';
  bubu.style.left = (w.innerWidth / 2 - bubu.offsetWidth/1.8) + 'px';

  window.addEventListener('resize', rs);

  function rs() {
    F.style.height = (w.innerWidth / 3.2 - 40) + 'px';
    F.style.bottom = ((w.innerWidth / 3.2) - 35) + 'px';
    B.style.height = ((w.innerWidth / 3.2) - 40) + 'px';
    L.style.height = w.innerWidth / 4 * 2 + 'px';
    R.style.height = w.innerWidth / 4 * 2 + 'px';
    //bubu.style.height = (bubu.offsetWidth*1.4) + 'px';
    bubu.style.left = (w.innerWidth / 2 - bubu.offsetWidth/1.8) + 'px';
  }

  var car;

  function controllerBtnEvent(c, e, callback) {
    if (e != "click") {
      var _u = navigator.userAgent;
      if (_u.indexOf("Android") > -1 || _u.indexOf("iPhone") > -1 || _u.indexOf("iPad") > -1) {
        c.addEventListener(e[1], function() {
          callback();
        });
      } else {
        c.addEventListener(e[0], function() {
          callback();
        });
      }
    } else {
      c.addEventListener("click", function() {
        callback();
      });
    }
  }


  deviceBtn.onclick = function() {
    deviceId = deviceInput.value;
    localStorage.toyCarDeviceId = deviceId;
    boardReady('OVXD', function(board) {
      deviceInput.style.background = '#090';
      board.systemReset();
      board.samplingInterval = 250;
      car = getToyCar(board, 6, 7, 8, 9);
      console.log('ok');
      board.on('error', function(err) {
        board.error = err;
        console.log('error');
        deviceInput.style.background = '#f00';
      });
      controllerBtnEvent(F, ["mousedown", "touchstart"], function() {
        car.goFront();
        bg.style.backgroundPosition = 'right bottom';
      });
      controllerBtnEvent(B, ["mousedown", "touchstart"], function() {
        car.goBack();
        bg.style.backgroundPosition = 'right bottom';
      });
      controllerBtnEvent(L, ["mousedown", "touchstart"], function() {
        car.turnLeft();
        bg.style.backgroundPosition = 'right bottom';
      });
      controllerBtnEvent(R, ["mousedown", "touchstart"], function() {
        car.turnRight();
        bg.style.backgroundPosition = 'right bottom';
      });
      controllerBtnEvent(F, ["mouseup", "touchend"], function() {
        car.stop();
        bg.style.backgroundPosition = 'left bottom';
      });
      controllerBtnEvent(B, ["mouseup", "touchend"], function() {
        car.stop();
        bg.style.backgroundPosition = 'left bottom';
      });
      controllerBtnEvent(L, ["mouseup", "touchend"], function() {
        car.stop();
        bg.style.backgroundPosition = 'left bottom';
      });
      controllerBtnEvent(R, ["mouseup", "touchend"], function() {
        car.stop();
        bg.style.backgroundPosition = 'left bottom';
      });
      controllerBtnEvent(bubu, ["mousedown", "touchstart"], function() {
        setDeviceOrientationListener(function(alpha, beta, gamma) {
          if ((Math.round(beta)) > 15 && (Math.abs(Math.round(gamma)) < 15 && Math.abs(Math.round(gamma)) > 0)) {
            car.goBack();
          } else if ((Math.round(beta)) < -15 && (Math.abs(Math.round(gamma)) < 15 && Math.abs(Math.round(gamma)) > 0)) {
            car.goFront();
          } else if ((Math.round(gamma)) > 15 && (Math.abs(Math.round(beta)) < 15 && Math.abs(Math.round(beta)) > 0)) {
            car.turnRight();
          } else if ((Math.round(gamma)) < -15 && (Math.abs(Math.round(beta)) < 15 && Math.abs(Math.round(beta)) > 0)) {
            car.turnLeft();
          } else {
            car.stop();
          }
        });
      });
      controllerBtnEvent(bubu, ["mouseup", "touchend"], function() {
        car.stop();
        removeDeviceOrientationListener();
      });
    });
  };


}, false);
