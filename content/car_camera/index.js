

var param = location.hash.substring(1).split('@');

console.log("deviceID:",param[0]);
console.log("camera URL:",param[1]);

new Camera(param[1] /*"http://192.168.0.251:81/stream"*/).onCanvas('c1',function(c){

});

var servo;
var car;

function getElement(dom) {
  var element = document.querySelector(dom);
  return element;
}

function controllerBtnEvent(c, e, callback) {
  if (e !== 'click') {
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


boardReady({board: 'Smart', device: param[0], transport: 'mqtt'}, function (board) {
  document.querySelector("#demo-area-09 .btn-show").innerHTML = 'Ready !';
  board.samplingInterval = 50;
  servo = getServo(board, 0);
  car = getToyCar(board, 14, 16, 2, 5);
  car.setLeftSpeed(77);
  controllerBtnEvent(getElement('#demo-area-09 .btn-up'),['mousedown', 'touchstart'], function () {
    car.goFront();
  });
  controllerBtnEvent(getElement('#demo-area-09 .btn-down'),['mousedown', 'touchstart'], function () {
    car.goBack();
  });
  controllerBtnEvent(getElement('#demo-area-09 .btn-left'),['mousedown', 'touchstart'], function () {
    car.turnLeft();
  });
  controllerBtnEvent(getElement('#demo-area-09 .btn-right'),['mousedown', 'touchstart'], function () {
    car.turnRight();
  });
  controllerBtnEvent(getElement('#demo-area-09 .btn-up'),['mouseup', 'touchend'], function () {
    car.stop();
  });
  controllerBtnEvent(getElement('#demo-area-09 .btn-down'),['mouseup', 'touchend'], function () {
    car.stop();
  });
  controllerBtnEvent(getElement('#demo-area-09 .btn-left'),['mouseup', 'touchend'], function () {
    car.stop();
  });
  controllerBtnEvent(getElement('#demo-area-09 .btn-right'),['mouseup', 'touchend'], function () {
    car.stop();
  });
  var p;
  var range = document.querySelector('.demo-area-09-input');
  range.setAttribute('min', 130);
  range.setAttribute('max', 170);
  range.setAttribute('step', 5);
  range.setAttribute('value', 180);
  p = Math.round((180 - 130) * 100 / (180 - 130));
  range.style.backgroundImage = '-webkit-linear-gradient(left, #246 0%, #246 ' + p + '%, #222 ' + p + '%, #222 100%)';
  range.oninput = function () {
    var _value = this.value;
    p = Math.round((_value - 130) * 100 / (180 - 130));
    range.style.backgroundImage = '-webkit-linear-gradient(left, #246 0%, #246 ' + p + '%, #222 ' + p + '%, #222 100%)';
    document.querySelector("#demo-area-09 .btn-show").innerHTML = _value;
    servo.angle = _value;
  };
});
