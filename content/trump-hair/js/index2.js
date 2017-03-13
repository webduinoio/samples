$(function() {
  var $window = $(window),
    $hairStyle = $('.hair-style'),
    $head = $('.head'),
    $hair = $('.hair'),
    $left = $('.inputLeft'),
    $right = $('.inputRight'),
    $note = $('.note'),
    $connect = $('.connect');

  var windowWidth = $window.width(),
    windowHeight = $window.height();

  var soundLeft, soundRight, aLeft, aRight;

  var num = 0;

  if (localStorage.leftBoard) {
    $left.val(localStorage.leftBoard);
  }
  if (localStorage.rightBoard) {
    $right.val(localStorage.rightBoard);
  }


  $connect.on('click', function() {
    $note.text('connecting...');
    _connect($left.val(), $right.val());
    localStorage.leftBoard = $left.val();
    localStorage.rightBoard = $right.val();
  });

  function _connect(leftBoard, rightBoard) {
    boardReady({
      device: leftBoard
    }, function(board) {
      num = num + 1;
      board.systemReset();
      board.samplingInterval = 250;
      soundLeft = getUltrasonic(board, 11, 10);
      if (num == 2) {
        _go();
      }
    });

    boardReady({
      device: rightBoard
    }, function(board) {
      num = num + 1;
      board.systemReset();
      board.samplingInterval = 250;
      soundRight = getUltrasonic(board, 11, 10);
      if (num == 2) {
        _go();
      }
    });
  }

  function _go() {
    $note.text('Board Ready!!');
    soundLeft.ping(function(cm) {
      aLeft = soundLeft.distance;
      console.log(aLeft);
      _blow(aLeft, aRight);
    }, 300);

    soundRight.ping(function(cm) {
      aRight = soundRight.distance;
      console.log(aRight);
      _blow(aLeft, aRight);

    }, 300);

  }

  function _blow(a, b) {
    if (a < 10 && b >= 10) {
      _hairRight();
      console.log('right');
    } else if (a >= 10 && b < 10) {
      _hairLeft();
      console.log('left');
    } else if (a < 10 && b < 10) {
      _hairUp();
      console.log('up');
    } else {
      _hair();
    }
  }

  function _hairLeft() {
    $hairStyle.removeClass('hair-up hair-left');
    $hairStyle.addClass('hair-right');
    $head.addClass('blow');
    $hair.css('opacity', '0');
  }

  function _hairRight() {
    $hairStyle.removeClass('hair-up hair-right');
    $hairStyle.addClass('hair-left');
    $head.addClass('blow');
    $hair.css('opacity', '0');
  }

  function _hairUp() {
    $hairStyle.removeClass('hair-left hair-right');
    $hairStyle.addClass('hair-up');
    $head.addClass('blow');
    $hair.css('opacity', '0');
  }

  function _hair() {
    $hairStyle.removeClass('hair-left hair-right hair-up');
    $head.removeClass('blow');
    $hair.css('opacity', '1');
  }

});
