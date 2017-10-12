$(function() {

  var url = location.href;
  var deviceId;
  var setting = {};
  var pin = [];
  var smart = false;

  if (url.indexOf('?') == -1) {
    deviceId = url.split('#')[1];
    setting = {
      device: deviceId
    };
  } else {
    deviceId = url.split('#')[1].split('?')[0];
    pin[0] = url.split('?')[1].split('_')[0];
    pin[1] = url.split('?')[1].split('_')[1];
    pin[2] = url.split('?')[1].split('_')[2];
    pin[3] = url.split('?')[1].split('_')[3];
    setting = {
      board: 'Smart',
      device: deviceId,
      transport: 'mqtt'
    };
    smart = true;
  }

  var car, buzzer;

  var $window = $(window);

  var windowWidth = $(window).width();
  var windowHeight = $(window).height();

  var $go1Front = $('#btn .front');
  var $go1Back = $('#btn .back');
  var $go1Left = $('#btn .left');
  var $go1Right = $('#btn .right');

  var $go2Front = $('#btn-2 .front');
  var $go2Back = $('#btn-2 .back');
  var $go2Left = $('#btn-2 .left');
  var $go2Right = $('#btn-2 .right');

  var $insect = $('#insect');
  var $ladybug = $('#ladybug');

  $ladybug.css({
    'height': $ladybug.width() + 'px'
  });
  $window.resize(function() {
    $ladybug.css({
      'height': $ladybug.width() + 'px'
    });
  });

  var f = 0;
  var b = 0;
  var r = 0;
  var l = 0;
  var bgPosition = 0;
  var timer;

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

  function bg(x) {
    if ((f + b + r + l) == 1) {
      bgPosition = bgPosition + x;
      $insect.css({
        'background-position': '0 ' + bgPosition + 'px'
      });
      timer = setTimeout(function() {
        bg(x);
      }, 100);
    }
  }


  function buzzer_music(m) {
    var musicNotes = {};
    musicNotes.notes = [];
    musicNotes.tempos = [];
    if (m[0].notes.length > 1) {
      for (var i = 0; i < m.length; i++) {
        if (Array.isArray(m[i].notes)) {
          var cn = musicNotes.notes.concat(m[i].notes);
          musicNotes.notes = cn;
        } else {
          musicNotes.notes.push(m[i].notes);
        }
        if (Array.isArray(m[i].tempos)) {
          var ct = musicNotes.tempos.concat(m[i].tempos);
          musicNotes.tempos = ct;
        } else {
          musicNotes.tempos.push(m[i].tempos);
        }
      }
    } else {
      musicNotes.notes = [m[0].notes];
      musicNotes.tempos = [m[0].tempos];
    }
    return musicNotes;
  }


  boardReady(setting, function(board) {
    board.systemReset();
    board.samplingInterval = 250;
    if (!smart) {
      buzzer = getBuzzer(board, 14);
      buzzer.play(buzzer_music([{
        notes: ["C6", "D6", "E6", "F6", "G6", "A6", "B6"],
        tempos: ["8", "8", "8", "8", "8", "8", "8"]
      }]).notes, buzzer_music([{
        notes: ["C6", "D6", "E6", "F6", "G6", "A6", "B6"],
        tempos: ["8", "8", "8", "8", "8", "8", "8"]
      }]).tempos);
    }
    car = getToyCar(board, 6, 7, 8, 9);
    car.stop();

    controllerBtnEvent($go1Front, ["mousedown", "touchstart"], function() {
      car.goFront();
      f = 1;
      $ladybug.addClass('move');
      bg(20);
    });
    controllerBtnEvent($go1Front, ["mouseup", "touchend"], function() {
      f = 0
      car.stop();
      $ladybug.removeClass('move');
      clearTimeout(timer);
    });

    controllerBtnEvent($go1Back, ["mousedown", "touchstart"], function() {
      car.goBack();
      b = 1;
      $ladybug.addClass('move');
      bg(-20);
    });
    controllerBtnEvent($go1Back, ["mouseup", "touchend"], function() {
      car.stop();
      b = 0;
      $ladybug.removeClass('move');
      clearTimeout(timer);
    });

    controllerBtnEvent($go1Right, ["mousedown", "touchstart"], function() {
      car.turnRight();
      r = 1;
      $ladybug.addClass('move');
      bg(20);
    });
    controllerBtnEvent($go1Right, ["mouseup", "touchend"], function() {
      car.stop();
      r = 0;
      $ladybug.removeClass('move');
      clearTimeout(timer);
    });

    controllerBtnEvent($go1Left, ["mousedown", "touchstart"], function() {
      car.turnLeft();
      l = 1;
      $ladybug.addClass('move');
      bg(20);
    });
    controllerBtnEvent($go1Left, ["mouseup", "touchend"], function() {
      car.stop();
      l = 0;
      $ladybug.removeClass('move');
      clearTimeout(timer);
    });

    controllerBtnEvent($go2Front, ["mousedown", "touchstart"], function() {
      car.goFront();
      f = 1;
      $ladybug.addClass('move');
      bg(20);
    });
    controllerBtnEvent($go2Front, ["mouseup", "touchend"], function() {
      car.stop();
      f = 0;
      $ladybug.removeClass('move');
      clearTimeout(timer);
    });

    controllerBtnEvent($go2Back, ["mousedown", "touchstart"], function() {
      car.goBack();
      b = 1;
      $ladybug.addClass('move');
      bg(-20);
    });
    controllerBtnEvent($go2Back, ["mouseup", "touchend"], function() {
      car.stop();
      b = 0;
      $ladybug.removeClass('move');
      clearTimeout(timer);
    });

    controllerBtnEvent($go2Right, ["mousedown", "touchstart"], function() {
      car.turnRight();
      r = 1;
      $ladybug.addClass('move');
      bg(20);
    });
    controllerBtnEvent($go2Right, ["mouseup", "touchend"], function() {
      car.stop();
      r = 0;
      $ladybug.removeClass('move');
      clearTimeout(timer);
    });

    controllerBtnEvent($go2Left, ["mousedown", "touchstart"], function() {
      car.turnLeft();
      l = 1;
      $ladybug.addClass('move');
      bg(20);
    });
    controllerBtnEvent($go2Left, ["mouseup", "touchend"], function() {
      car.stop();
      l = 0;
      $ladybug.removeClass('move');
      clearTimeout(timer);
    });

  });

});
