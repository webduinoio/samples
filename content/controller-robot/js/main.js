window.addEventListener('load', function() {

  var s = document.getElementById('s');
  var fingerNum = 0;
  var ar = [];
  var div = document.querySelectorAll('.btn');
  var content = document.getElementById('content');
  var menu = document.getElementById('menu');
  var boxing = 0;
  var close = document.getElementById('close-btn');

  var hammer = new Hammer(window);

  var timer;
  var barHeight = 0;
  var bar = document.getElementById('bar');
  var fire = document.getElementById('fire');
  var fight = document.getElementById('superFight');

  var device = document.getElementById('device');
  var button = document.getElementById('button');
  var check = document.getElementById('check');
  var mobile1 = document.getElementById('mobile1');
  var mobileCheck1 = document.getElementById('mobileCheck1');
  var mobile2 = document.getElementById('mobile2');
  var mobileCheck2 = document.getElementById('mobileCheck2');

  var car;

  hammer.on('swipeleft', function() {
    menu.style.width = "100%";
  });
  hammer.on('swiperight', function() {
    menu.style.width = "0";
  });

  close.addEventListener('touchend', function() {
    menu.style.width = "0";
  });

  for (var i = 0; i < div.length; i++) {
    div[i].addEventListener('touchstart', down);
    div[i].addEventListener('touchend', up);
  }

  fire.onclick = function() {
    fight.style.display = 'block';

    function a1() {
      car.goLeft();
    }

    function a2() {
      car.goRight();
    }

    function a3() {
      car.goFront();
    }

    function a4() {
      car.goLeft();
    }

    function a5() {
      car.goRight();
    }

    function end() {
      car.stop();
      fight.style.display = 'none';
      bar.className = '';
      barHeight = 0;
      bar.style.height = barHeight + 'px';
      fire.style.display = 'none';
    }
    a1();
    setTimeout(a2, 500);
    setTimeout(a3, 1000);
    setTimeout(a4, 3000);
    setTimeout(a5, 3500);
    setTimeout(end, 4000);
  };

  menu.addEventListener('touchstart', function() {
    boxing = 1;
  });
  menu.addEventListener('touchend', function() {
    boxing = 0;
  });

  button.onclick = function() {
    boardReady({
      device: device.value,
      multi: true
    }, function(board) {
      button.style.color = '#0f0';
      check.style.display = 'none';
      mobile1.style.opacity = 1;
      mobileCheck1.disabled = false;
      mobile2.style.opacity = 1;
      mobileCheck2.disabled = false;
      car = getToyCar(board, 6, 7, 8, 9);
      mobileCheck1.addEventListener('change',hand);
      mobileCheck2.addEventListener('change',hand);
      function hand() {
        if (mobileCheck1.checked && !mobileCheck2.checked) {
          setDeviceMotionListener(function(x, y, z) {
            if ((Math.round(x)) > 5) {
              car.onlyRightFront();
              _bar();
              setTimeout(function() {
                car.onlyRightStop();
                clearTimeout(timer);
              }, 500);
            }
          });
        } else if(!mobileCheck1.checked && mobileCheck2.checked){
          setDeviceMotionListener(function(x, y, z) {
            if ((Math.round(x)) > 5) {
              car.onlyLeftFront();
              _bar();
              setTimeout(function() {
                car.onlyLeftStop();
                clearTimeout(timer);
              }, 500);
            }
          });
        } else if(mobileCheck1.checked && mobileCheck2.checked){
          setDeviceMotionListener(function(x, y, z) {
            if ((Math.round(x)) > 5) {
              car.goFront();
              _bar();
              setTimeout(function() {
                car.stop();
                clearTimeout(timer);
              }, 500);
            }
          });
        }else {
          removeDeviceMotionListener();
        }
      }
    });
  };

  function joypad(m) {
    if (m == 'a') {
      car.goLeft();
      //s.innerHTML = '左前';
    }
    if (m == 'b') {
      car.backLeft();
      //s.innerHTML = '左後';
    }
    if (m == 'c') {
      car.goRight();
      //s.innerHTML = '右前';
    }
    if (m == 'd') {
      car.backRight();
      //s.innerHTML = '右後';
    }
    if (m == 'ac' || m == 'ca') {
      car.goFront();
      //s.innerHTML = '往前';
    }
    if (m == 'ad' || m == 'da') {
      car.turnLeft();
      //s.innerHTML = '左轉';
    }
    if (m == 'cb' || m == 'bc') {
      car.turnRight();
      //s.innerHTML = '右轉';
    }
    if (m == 'bd' || m == 'db') {
      car.goBack();
      //s.innerHTML = '後退';
    }
    if (m == 'ab' || m == 'ba') {
      car.stop();
      //s.innerHTML = '';
    }
    if (m == 'cd' || m == 'dc') {
      car.stop();
      //s.innerHTML = '';
    }
  }

  function down(e) {
    e.target.style.borderWidth = "10px";
    e.target.style.borderRadius = "20px";
    var name = e.target.getAttribute('data-name');
    _bar();
    fingerNum = fingerNum + 1;
    if (fingerNum == 1) {
      ar[0] = name;
      joypad(ar[0]);
    } else if (fingerNum == 2) {
      ar.push(name);
      joypad((ar[0] + ar[1]));
    }
  }

  function up(e) {
    e.target.style.borderWidth = "0";
    e.target.style.borderRadius = "10px";
    var name = e.target.getAttribute('data-name');
    fingerNum = fingerNum - 1;
    if (fingerNum === 0) {
      clearTimeout(timer);
      car.stop();
      //s.innerHTML = '停止';
    }
    if (ar[0] == name) {
      ar.splice(0, 1);
    }
    if (ar[1] == name) {
      ar.splice(1, 2);
    }
    joypad((ar[0]));
  }


  function _bar() {
    clearTimeout(timer);
    if (car) {
      if (barHeight < 100) {
        barHeight = barHeight + 1;
        bar.style.height = barHeight + 'px';
        timer = setTimeout(_bar, 100);
      } else {
        fire.style.display = 'block';
        bar.className = 'fire';
      }
    }
  }


}, false);
