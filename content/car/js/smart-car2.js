$(function() {

  if (!localStorage.mobileRotateNote) {
    alert('請將手機畫面設定為「不要旋轉」^_^');
    localStorage.mobileRotateNote = true;
  }

  var url = location.href;
  var deviceId;
  var pin = [];

  if (url.indexOf('?') == -1) {
    deviceId = url.split('#')[1];
  } else {
    deviceId = url.split('#')[1].split('?')[0];
    pin[0] = url.split('?')[1].split('_')[0];
    pin[1] = url.split('?')[1].split('_')[1];
    pin[2] = url.split('?')[1].split('_')[2];
    pin[3] = url.split('?')[1].split('_')[3];
  }

  var windowWidth = $(window).width();
  var windowHeight = $(window).height();

  if (windowWidth / windowHeight > 1.3) {
    if (deviceId) {
      document.location.href = "smart-car.html#" + deviceId;
    } else {
      document.location.href = "smart-car.html";
    }
  }

  var x;
  var s;
  var car;
  // var buzzer;
  var speed_right;
  var speed_max;
  var speed_left;

  var $speed = $('#speed div');
  var $s100 = $('.s100');
  var $s50 = $('.s50');
  var $s20 = $('.s20');
  var $wheel = $('#wheel');
  var $joypad = $('#joypad');

  var $wheelImg = $('#main-img .wheel');
  var $joypadImg = $('#main-img .joypad');

  var $wheelFront = $('#wheel .front');
  var $wheelBack = $('#wheel .back');

  var $joypadFront = $('#joypad .front');
  var $joypadBack = $('#joypad .back');
  var $joypadLeft = $('#joypad .left');
  var $joypadRight = $('#joypad .right');

  var $modeWheel = $('#mode .wheel');
  var $modeJoypad = $('#mode .joypad');

  $modeWheel.on('click', function() {
    $modeWheel.addClass('hide');
    $modeJoypad.removeClass('hide');
    $wheel.removeClass('hide');
    $wheelImg.removeClass('hide');
    $joypad.addClass('hide');
    $joypadImg.addClass('hide');
  });

  $modeJoypad.on('click', function() {
    $modeWheel.removeClass('hide');
    $modeJoypad.addClass('hide');
    $wheel.addClass('hide');
    $wheelImg.addClass('hide');
    $joypad.removeClass('hide');
    $joypadImg.removeClass('hide');
  });

  // function buzzer_music(m) {
  //   var musicNotes = {};
  //   musicNotes.notes = [];
  //   musicNotes.tempos = [];
  //   if (m[0].notes.length > 1) {
  //     for (var i = 0; i < m.length; i++) {
  //       if (Array.isArray(m[i].notes)) {
  //         var cn = musicNotes.notes.concat(m[i].notes);
  //         musicNotes.notes = cn;
  //       } else {
  //         musicNotes.notes.push(m[i].notes);
  //       }
  //       if (Array.isArray(m[i].tempos)) {
  //         var ct = musicNotes.tempos.concat(m[i].tempos);
  //         musicNotes.tempos = ct;
  //       } else {
  //         musicNotes.tempos.push(m[i].tempos);
  //       }
  //     }
  //   } else {
  //     musicNotes.notes = [m[0].notes];
  //     musicNotes.tempos = [m[0].tempos];
  //   }
  //   return musicNotes;
  // }


  function getElement(dom) {
    var element = document.querySelector(dom);
    return element;
  }

  function controllerBtnEvent(c, e, callback) {
    if (e != "click") {
      var _u = navigator.userAgent;
      if (_u.indexOf("Android") > -1 || _u.indexOf("iPhone") > -1 || _u.indexOf("iPad") > -1) {
        c.on(e[1], function() {
          callback();
        });
      } else {
        c.on(e[0], function() {
          callback();
        });
      }
    } else {
      c.on("click", function() {
        callback();
      });
    }
  }


  function move(x) {
    s = Math.round(((x - (0)) * (1 / ((60) - (0)))) * ((speed_max) - (0)) + (0));
    speed_right = speed_max - s;
    speed_left = speed_max + s;
    if (speed_right >= speed_max) {
      speed_right = speed_max;
    } else if (speed_right <= 0) {
      speed_right = 0;
    }
    if (speed_left >= speed_max) {
      speed_left = speed_max;
    } else if (speed_left <= 0) {
      speed_left = 0;
    }
    car.setRightSpeed(speed_right);
    car.setLeftSpeed(speed_left);
  }


  boardReady({board: 'Smart', device: '10y2XaYQ', transport: 'mqtt'}, function (board) {
    board.systemReset();
    board.samplingInterval = 250;
    // buzzer = getBuzzer(board, 14);
    // buzzer.play(buzzer_music([{
    //   notes: ["C6", "D6", "E6", "F6", "G6", "A6", "B6"],
    //   tempos: ["8", "8", "8", "8", "8", "8", "8"]
    // }]).notes, buzzer_music([{
    //   notes: ["C6", "D6", "E6", "F6", "G6", "A6", "B6"],
    //   tempos: ["8", "8", "8", "8", "8", "8", "8"]
    // }]).tempos);
    if(pin.length>0){
      car = getToyCar(board, pin[0], pin[1], pin[2], pin[3]);
    }else{
      car = getToyCar(board, 16, 14, 2, 5);
    }
    car.stop();
    speed_max = 100;
    controllerBtnEvent($wheelFront, ["mousedown", "touchstart"], function() {
      setDeviceOrientationListener(function(alpha, beta, gamma) {
        move((Math.round(beta)));
        car.goFront();
        console.log(1);
      });
    });
    controllerBtnEvent($wheelFront, ["mouseup", "touchend"], function() {
      removeDeviceOrientationListener();
      car.stop();
      console.log(0);
    });
    controllerBtnEvent($wheelBack, ["mousedown", "touchstart"], function() {
      setDeviceOrientationListener(function(alpha, beta, gamma) {
        move((Math.round(beta)));
        car.goBack();
      });
    });
    controllerBtnEvent($wheelBack, ["mouseup", "touchend"], function() {
      removeDeviceOrientationListener();
      car.stop();
    });

    controllerBtnEvent($s100, ["mouseup", "touchend"], function() {
      $speed.removeClass('selected');
      $s100.addClass('selected');
      speed_max = 100;
    });

    controllerBtnEvent($s50, ["mouseup", "touchend"], function() {
      $speed.removeClass('selected');
      $s50.addClass('selected');
      speed_max = 50;
    });

    controllerBtnEvent($s20, ["mouseup", "touchend"], function() {
      $speed.removeClass('selected');
      $s20.addClass('selected');
      speed_max = 20;
    });

    controllerBtnEvent($joypadFront, ["mousedown", "touchstart"], function() {
      car.setRightSpeed(speed_max);
      car.setLeftSpeed(speed_max);
      car.goFront();
    });
    controllerBtnEvent($joypadBack, ["mousedown", "touchstart"], function() {
      car.setRightSpeed(speed_max);
      car.setLeftSpeed(speed_max);
      car.goBack();
    });
    controllerBtnEvent($joypadLeft, ["mousedown", "touchstart"], function() {
      car.setRightSpeed(speed_max);
      car.setLeftSpeed(speed_max);
      car.turnLeft();
    });
    controllerBtnEvent($joypadRight, ["mousedown", "touchstart"], function() {
      car.setRightSpeed(speed_max);
      car.setLeftSpeed(speed_max);
      car.turnRight();
    });

    controllerBtnEvent($joypadFront, ["mouseup", "touchend"], function() {
      car.stop();
    });
    controllerBtnEvent($joypadBack, ["mouseup", "touchend"], function() {
      car.stop();
    });
    controllerBtnEvent($joypadLeft, ["mouseup", "touchend"], function() {
      car.stop();
    });
    controllerBtnEvent($joypadRight, ["mouseup", "touchend"], function() {
      car.stop();
    });
  });





});
