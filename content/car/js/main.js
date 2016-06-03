window.addEventListener('load', function() {

  var car;

  function getElement(dom) {
    var element = document.querySelector(dom);
    return element;
  }

  function controllerBtnEvent(c, e, callback) {
    if (e != "click") {
      var _u = navigator.userAgent;
      if (_u.indexOf("Android") > -1 || _u.indexOf("iPhone") > -1 || _u.indexOf("iPad") > -1) {
        c.addEventListener(e[1],  function() {
          callback();
        });
      } else {
        c.addEventListener(e[0],  function() {
          callback();
        });
      }
    } else {
      c.addEventListener("click",  function() {
        callback();
      });
    }
  }


  boardReady('7dJW',  function(board) {
    board.systemReset();
    board.samplingInterval = 250;
    car = getToyCar(board, 6, 7, 8, 9);
    document.querySelector("#demo-area-09 .btn-show").style.background = '#ff0000';
    board.on('error',  function(err) {
      board.error = err;
      document.querySelector("#demo-area-09 .btn-show").style.background = '#000000';
    });
    controllerBtnEvent(getElement("#demo-area-09 .btn-up"), ["mousedown", "touchstart"], function() {
      car.goFront();
    });
    controllerBtnEvent(getElement("#demo-area-09 .btn-down"), ["mousedown", "touchstart"], function() {
      car.goBack();
    });
    controllerBtnEvent(getElement("#demo-area-09 .btn-left"), ["mousedown", "touchstart"], function() {
      car.turnLeft();
    });
    controllerBtnEvent(getElement("#demo-area-09 .btn-right"), ["mousedown", "touchstart"], function() {
      car.turnRight();
    });
    controllerBtnEvent(getElement("#demo-area-09 .btn-up"), ["mouseup", "touchend"], function() {
      car.stop();
    });
    controllerBtnEvent(getElement("#demo-area-09 .btn-left"), ["mouseup", "touchend"], function() {
      car.stop();
    });
    controllerBtnEvent(getElement("#demo-area-09 .btn-right"), ["mouseup", "touchend"], function() {
      car.stop();
    });
    controllerBtnEvent(getElement("#demo-area-09 .btn-down"), ["mouseup", "touchend"], function() {
      car.stop();
    });
    controllerBtnEvent(getElement("#demo-area-09 .btn-center"), ["mousedown", "touchstart"], function() {
      setDeviceOrientationListener( function(alpha, beta, gamma) {
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
    controllerBtnEvent(getElement("#demo-area-09 .btn-center"), ["mouseup", "touchend"], function() {
      car.stop();
      removeDeviceOrientationListener();
    });
  });


}, false);
