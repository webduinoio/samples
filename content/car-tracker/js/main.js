window.addEventListener('load', function () {
  document.body.addEventListener('touchmove', function (event) {
    event.preventDefault();
  }, false);

  var drawTrack;
  var CarTracker;
  var deviceId = '';
  var stepList = [];
  var deviceInput = document.querySelector('.deviceInput');
  var deviceBtn = document.querySelector('.deviceBtn');
  var radialValue = document.getElementById('radialValue');
  var degreeValue = document.getElementById('degreeValue');
  var drawCanvas = document.getElementById('canvas');
  var bar = document.querySelectorAll('.bar');
  var ready = document.querySelectorAll('.ready');

  if(localStorage.toyCarDeviceId){
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

  deviceBtn.onclick = function () {
    deviceId = deviceInput.value;
    localStorage.toyCarDeviceId = deviceId;
    deviceBtn.innerHTML = 'Connecting...';
    deviceBtn.style.opacity = '.7';
    boardReady(deviceId, function (board) {
      board.systemReset();
      board.samplingInterval = 20;
      deviceBtn.innerHTML = 'Board Online!!';
      setTimeout(function(){
        deviceBtn.innerHTML = 'Connect';
        deviceBtn.style.opacity = '1';
      },1500);
      bar.forEach(function(item){
        item.removeAttribute('disabled');
      });
      ready.forEach(function(item){
        item.className = 'container';
      });
      board.on(webduino.BoardEvent.STRING_MESSAGE,
        function (event) {
          var m = event.message;
          console.log(deviceId, m);
        });

      // console.log('board ready.');

      enableBtn('btn-record');
      CarTracker = getCarTracker(board, 17, 18, 19, 6, 7, 8, 9);

      /* Paint Toy Car */
      drawTrack = getDrawTrack('canvas');
      drawTrack.on(function () {
        CarTracker.replay(drawTrack._stepList, function (ret) {

          enableBtn('btn-stop');
          disableBtn('btn-record');
          disableBtn('btn-replay');

          if (ret == 1) {
            enableBtn('btn-record');
            disableBtn('btn-stop');
            // console.log('Car Stop..');
          }
        });
      });

      var p;
      var radial = document.querySelector('.bar.radial');
      var barColor = '#599';
      radial.setAttribute('min', 0);
      radial.setAttribute('max', 200);
      radial.setAttribute('step', 5);
      radial.setAttribute('value', 100);
      p = Math.round((100 - 1) * 100 / (200 - 1));
        radialValue.innerHTML = '100 (ms)';
      // console.log(p);
      radial.style.backgroundImage = '-webkit-linear-gradient(left ,'+barColor+' 0%, '+barColor+' ' + p + '%,#000 ' + p + '%, #000 100%)';
      radial.oninput = function () {
        var _value = this.value;
        p = Math.round((_value - 1) * 100 / (200 - 1));
        radial.style.backgroundImage = '-webkit-linear-gradient(left ,'+barColor+' 0%,'+barColor+' ' + p + '%,#000 ' + p + '%, #000 100%)';
        drawTrack.constantR = parseInt(_value);
        radialValue.innerHTML = parseInt(_value) + ' (ms)';
      };

      var degree = document.querySelector('.bar.degree');
      degree.setAttribute('min', 0);
      degree.setAttribute('max', 200);
      degree.setAttribute('step', 5);
      degree.setAttribute('value', 100);
      p = Math.round((100 - 1) * 100 / (200 - 1));
      degreeValue.innerHTML = '100 (ms)';
      // console.log(p);
      degree.style.backgroundImage = '-webkit-linear-gradient(left ,'+barColor+' 0%,'+barColor+' ' + p + '%,#000 ' + p + '%, #000 100%)';
      degree.oninput = function () {
        var _value = this.value;
        p = Math.round((_value - 1) * 100 / (200 - 1));
        degree.style.backgroundImage = '-webkit-linear-gradient(left ,'+barColor+' 0%,'+barColor+' ' + p + '%,#000 ' + p + '%, #000 100%)';
        drawTrack.constantD = parseInt(_value);
        degreeValue.innerHTML = parseInt(_value) + ' (ms)';
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
