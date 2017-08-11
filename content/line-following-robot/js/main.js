window.addEventListener('load', function () {
  /*
    document.body.addEventListener('touchmove', function (event) {
      event.preventDefault();
    }, {passive:false});
  */
  var drawTrack;
  var CarTracker;
  var deviceId = '';
  var stepList = [];
  var deviceInput = document.querySelector('.deviceInput');
  var deviceBtn = document.querySelector('.deviceBtn');
  var radialValue = document.getElementById('radialValue');
  var degreeValue = document.getElementById('degreeValue');
  var aroundValue = document.getElementById('aroundValue');
  var speedValue = document.getElementById('speedValue');
  // var drawCanvas = document.getElementById('canvas');
  var bar = document.querySelectorAll('.bar');
  var ready = document.querySelectorAll('.ready');
  var carAround = 0;
  var carRPM = 100;
  var RIGHT = 0;
  var LEFT = 1;

  if(location.hash != 'undefined') {
    deviceInput.value = location.hash.split('#')[1];
  } else if (localStorage.toyCarDeviceId) {
    deviceInput.value = localStorage.toyCarDeviceId;
  }

  document.getElementById('btn-stop').disabled = true;

  function controllerBtnEvent(c, e, callback) {
    if (e != 'click') {
      var _u = navigator.userAgent;
      if (_u.indexOf('Android') > -1 || _u.indexOf('iPhone') > -1 || _u.indexOf('iPad') > -1) {
        c.addEventListener(e[1], function () {
          callback();
        });
      } else {
        c.addEventListener(e[0], function () {
          callback();
        });
      }
    } else {
      c.addEventListener('click', function () {
        callback();
      });
    }
  }

  function enableBtn(c) {
    if (c == 'btn-record') {
      document.getElementById(c).className = 'btn enabled record';
    } else {
      document.getElementById(c).className = 'btn enabled';
    }
  }

  function disableBtn(c) {
    if (c == 'btn-record') {
      document.getElementById(c).className = 'btn disabled record';
    } else {
      document.getElementById(c).className = 'btn disabled';
    }
  }

  function setRPM(around, rpm) {
    var rRPM = rpm;
    var lRPM = rpm;

    if (around < 0) {
      lRPM = rpm * (100 + around) / 100;
    } else {
      // console.log("L", around);
      rRPM = rpm * (100 - around) / 100;
    }

    CarTracker.setSpeed(RIGHT, rRPM);
    CarTracker.setSpeed(LEFT, lRPM);
  }

  deviceBtn.onclick = function () {
    deviceId = deviceInput.value;
    localStorage.toyCarDeviceId = deviceId;
    deviceBtn.innerHTML = 'Connecting...';
    deviceBtn.style.opacity = '.7';
    boardReady(deviceId, function (board) {
      board.systemReset();
      board.samplingInterval = 20;
      deviceBtn.innerHTML = 'Board Online!!';
      setTimeout(function () {
        deviceBtn.innerHTML = 'Connect';
        deviceBtn.style.opacity = '1';
      }, 1500);
      bar.forEach(function (item) {
        item.removeAttribute('disabled');
      });
      ready.forEach(function (item) {
        item.className = 'container';
      });
      board.on(webduino.BoardEvent.STRING_MESSAGE,
        function (event) {
          var dt = new Date();
          var m = event.message;
          console.log(dt, deviceId, m);
        });

      // console.log('board ready.');

      enableBtn('btn-record');
      CarTracker = getCarTracker(board, 17, 18, 19, 6, 7, 8, 9);

      setRPM(carAround, carRPM);

      /* Paint Toy Car */
      drawTrack = getDrawTrack('canvas');
      drawTrack.on(function () {
        CarTracker.replay(drawTrack._stepList, function (ret) {

          enableBtn('btn-stop');
          disableBtn('btn-record');
          disableBtn('btn-replay');

          if (ret == 1) {
            stepList.length = 0;
            stepList = [];
            stepList = drawTrack._stepList;
            enableBtn('btn-record');
            disableBtn('btn-stop');
            enableBtn('btn-replay');
            // console.log('Car Stop..');
          }
        });
      });

      var p;
      var radial = document.querySelector('.bar.radial');
      var barColor = '#599';
      radial.setAttribute('min', 10);
      radial.setAttribute('max', 600);
      radial.setAttribute('step', 10);
      radial.setAttribute('value', 60);
      p = Math.round((radial.value - 1) * 100 / (radial.max - 1));
      drawTrack.constantR = parseInt(radial.value);
      radialValue.innerHTML = parseInt(radial.value) + ' ms';

      radial.style.backgroundImage = '-webkit-linear-gradient(left ,' + barColor + ' 0%, ' + barColor + ' ' + p + '%,#000 ' + p + '%, #000 100%)';
      radial.oninput = function () {
        var _value = this.value;
        p = Math.round((_value - 1) * 100 / (this.max - 1));
        radial.style.backgroundImage = '-webkit-linear-gradient(left ,' + barColor + ' 0%,' + barColor + ' ' + p + '%,#000 ' + p + '%, #000 100%)';
        drawTrack.constantR = parseInt(_value);
        radialValue.innerHTML = parseInt(_value) + ' ms';
      };

      var degree = document.querySelector('.bar.degree');
      degree.setAttribute('min', 10);
      degree.setAttribute('max', 250);
      degree.setAttribute('step', 5);
      degree.setAttribute('value', 100);
      p = Math.round((degree.value - 1) * 100 / (degree.max - 1));
      drawTrack.constantD = parseInt(degree.value);
      degreeValue.innerHTML = parseInt(degree.value) + ' ms';
      // console.log(p);
      degree.style.backgroundImage = '-webkit-linear-gradient(left ,' + barColor + ' 0%,' + barColor + ' ' + p + '%,#000 ' + p + '%, #000 100%)';
      degree.oninput = function () {
        var _value = this.value;
        p = Math.round((_value - 1) * 100 / (this.max - 1));
        degree.style.backgroundImage = '-webkit-linear-gradient(left ,' + barColor + ' 0%,' + barColor + ' ' + p + '%,#000 ' + p + '%, #000 100%)';
        drawTrack.constantD = parseInt(_value);
        degreeValue.innerHTML = parseInt(_value) + ' ms';
      };

      var around = document.querySelector('.bar.around');
      around.setAttribute('min', -50);
      around.setAttribute('max', 50);
      around.setAttribute('step', 1);
      around.setAttribute('value', 0);
      p = Math.round(((around.value - around.min) - 1) * 100 / ((around.max - around.min) - 1));
      aroundValue.innerHTML = '(' + parseInt(around.value) + ')';
      // console.log(p);
      around.style.backgroundImage = '-webkit-linear-gradient(left ,' + barColor + ' 0%,' + barColor + ' ' + p + '%,#000 ' + p + '%, #000 100%)';
      around.oninput = function () {
        var _value = this.value;
        p = Math.round(((_value - this.min) - 1) * 100 / ((this.max - this.min) - 1));
        around.style.backgroundImage = '-webkit-linear-gradient(left ,' + barColor + ' 0%,' + barColor + ' ' + p + '%,#000 ' + p + '%, #000 100%)';
        aroundValue.innerHTML = '(' + parseInt(_value) + ')';
        carAround = parseInt(_value);
        setRPM(carAround, carRPM);
      };

      var speed = document.querySelector('.bar.speed');
      speed.setAttribute('min', 1);
      speed.setAttribute('max', 100);
      speed.setAttribute('step', 1);
      speed.setAttribute('value', 100);
      p = Math.round((speed.value - 1) * 100 / (speed.max - 1));
      speedValue.innerHTML = '' + parseInt(speed.value) + '%';
      // console.log(p);
      speed.style.backgroundImage = '-webkit-linear-gradient(left ,' + barColor + ' 0%,' + barColor + ' ' + p + '%,#000 ' + p + '%, #000 100%)';
      speed.oninput = function () {
        var _value = this.value;
        p = Math.round((_value - 1) * 100 / (this.max - 1));
        speed.style.backgroundImage = '-webkit-linear-gradient(left ,' + barColor + ' 0%,' + barColor + ' ' + p + '%,#000 ' + p + '%, #000 100%)';
        speedValue.innerHTML = '' + parseInt(_value) + '%';
        carRPM = parseInt(_value);
        setRPM(carAround, carRPM);
      };

      controllerBtnEvent(document.getElementById('btn-record'), 'click', function () {

        // console.log('Car record.');

        disableBtn('btn-record');
        enableBtn('btn-stop');
        disableBtn('btn-replay');

        stepList.length = 0;
        stepList = [];
        CarTracker.record(function (e, t) {
          // console.log('Record : ', e, t);
        });
      });

      controllerBtnEvent(document.getElementById('btn-stop'), 'click', function () {

        disableBtn('btn-stop');
        enableBtn('btn-record');

        CarTracker.stop();
        stepList = CarTracker._stepList;
        if (stepList.length > 0) {

          enableBtn('btn-replay');
        }
      });

      controllerBtnEvent(document.getElementById('btn-replay'), 'click', function () {
        if (stepList.length > 0) {
          disableBtn('btn-record');
          enableBtn('btn-stop');
          disableBtn('btn-replay');

          CarTracker.replay(stepList, function (ret) {
            if (ret == 1) {
              // console.log('Car Stop.');
              disableBtn('btn-stop');
              enableBtn('btn-record');
              enableBtn('btn-replay');
            }
          });
        } else {
          // console.log('No Data.');
        }
      });
    });
  };

}, false);
