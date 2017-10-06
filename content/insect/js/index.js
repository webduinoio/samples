$(function() {

  var url = location.href;
  var deviceId = url.split('#')[1];

  var car, buzzer;

  var $window = $(window);

  var windowWidth = $(window).width();
  var windowHeight = $(window).height();

  var $btnLF = $('#left-btn .front');
  var $btnLB = $('#left-btn .back');
  var $btnRF = $('#right-btn .front');
  var $btnRB = $('#right-btn .back');

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

  var rf = 0;
  var rb = 0;
  var lf = 0;
  var lb = 0;
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
    move();
    if ((lf + rf + lb + rb) != 0) {
      bgPosition = bgPosition + x;
      $insect.css({
        'background-position': '0 ' + bgPosition + 'px'
      });
      timer = setTimeout(function() {
        bg(x);
      }, 100);
    }
  }

  function move() {
    if (lf == 0 && lb == 0 && rf == 0 && rb == 0) {
      car.stop();
    } else if (lf == 1 && lb == 0 && rf == 0 && rb == 0) {
      car.goRight();
    } else if (lf == 0 && lb == 1 && rf == 0 && rb == 0) {
      car.backLeft();
    } else if (lf == 0 && lb == 0 && rf == 1 && rb == 0) {
      car.goLeft();
    } else if (lf == 0 && lb == 0 && rf == 0 && rb == 1) {
      car.backRight();
    } else if (lf == 1 && lb == 1 && rf == 0 && rb == 0) {
      car.stop();
    } else if (lf == 1 && lb == 1 && rf == 1 && rb == 0) {
      car.goLeft();
    }else if (lf == 1 && lb == 1 && rf == 0 && rb == 1) {
      car.backRight();
    }else if (lf == 1 && lb == 1 && rf == 1 && rb == 1) {
      car.stop();
    }else if (lf == 0 && lb == 1 && rf == 1 && rb == 1) {
      car.backLeft();
    }else if (lf == 1 && lb == 0 && rf == 1 && rb == 1) {
      car.goRight();
    }else if (lf == 0 && lb == 0 && rf == 1 && rb == 1) {
      car.stop();
    }else if (lf == 1 && lb == 0 && rf == 1 && rb == 0) {
      car.goFront();
    }else if (lf == 0 && lb == 1 && rf == 0 && rb == 1) {
      car.goBack();
    }else if (lf == 0 && lb == 1 && rf == 1 && rb == 0) {
      car.turnLeft();
    }else if (lf == 1 && lb == 0 && rf == 0 && rb == 1) {
      car.turnRight();
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


  boardReady({
    device: deviceId
  }, function(board) {
    board.systemReset();
    board.samplingInterval = 250;
    buzzer = getBuzzer(board, 14);
    buzzer.play(buzzer_music([{
      notes: ["C6", "D6", "E6", "F6", "G6", "A6", "B6"],
      tempos: ["8", "8", "8", "8", "8", "8", "8"]
    }]).notes, buzzer_music([{
      notes: ["C6", "D6", "E6", "F6", "G6", "A6", "B6"],
      tempos: ["8", "8", "8", "8", "8", "8", "8"]
    }]).tempos);
    car = getToyCar(board, 6, 7, 8, 9);
    car.stop();

    controllerBtnEvent($btnLF, ["mousedown", "touchstart"], function() {
      lf = 1;
      $ladybug.addClass('move');
      bg(20);
    });
    controllerBtnEvent($btnLF, ["mouseup", "touchend"], function() {
      lf = 0;
      if ((lf + rf + lb + rb) == 0) {
        $ladybug.removeClass('move');
        clearTimeout(timer);
        car.stop();
      }
    });

    controllerBtnEvent($btnRF, ["mousedown", "touchstart"], function() {
      rf = 1;
      $ladybug.addClass('move');
      bg(20);
    });
    controllerBtnEvent($btnRF, ["mouseup", "touchend"], function() {
      rf = 0;
      if ((lf + rf + lb + rb) == 0) {
        $ladybug.removeClass('move');
        clearTimeout(timer);
        car.stop();
      }
    });

    controllerBtnEvent($btnLB, ["mousedown", "touchstart"], function() {
      lb = 1;
      $ladybug.addClass('move');
      bg(-20);
    });
    controllerBtnEvent($btnLB, ["mouseup", "touchend"], function() {
      lb = 0;
      if ((lf + rf + lb + rb) == 0) {
        $ladybug.removeClass('move');
        clearTimeout(timer);
        car.stop();
      }
    });

    controllerBtnEvent($btnRB, ["mousedown", "touchstart"], function() {
      rb = 1;
      $ladybug.addClass('move');
      bg(-20);
    });
    controllerBtnEvent($btnRB, ["mouseup", "touchend"], function() {
      rb = 0;
      if ((lf + rf + lb + rb) == 0) {
        $ladybug.removeClass('move');
        clearTimeout(timer);
        car.stop();
      }
    });

  });

});
