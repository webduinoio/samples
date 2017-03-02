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

  var soundLeft, soundRight, timer1, timer2, timer;

  var aLeft = 0,
    aRight = 0,
    num = 0;

  if (localStorage.leftBoard) {
    $left.val(localStorage.leftBoard);
  }
  if (localStorage.rightBoard) {
    $right.val(localStorage.rightBoard);
  }


  $connect.on('click', function() {
    $note.text('Connecting...');
    _connect($left.val(), $right.val());
    localStorage.leftBoard = $left.val();
    localStorage.rightBoard = $right.val();
  });


  function _connect(leftBoard, rightBoard) {
    boardReady({
      device: leftBoard
    }, function(board) {
      console.log(1);
      num = num + 1;
      board.systemReset();
      board.samplingInterval = 250;
      soundLeft = getSound(board, 7);
      if (num == 2) {
        _go();
      }
    });

    boardReady({
      device: rightBoard
    }, function(board) {
      console.log(2);
      num = num + 1;
      board.systemReset();
      board.samplingInterval = 250;
      soundRight = getSound(board, 7);
      if (num == 2) {
        _go();
      }
    });
  }



  function _go() {
    $note.text('Boards Ready!!');
    soundLeft.on("detected", function() {
      aLeft = 1;
      _blow();
    });
    soundRight.on("detected", function() {
      aRight = 1;
      _blow();
    });
  }

  function _blow() {
    clearTimeout(timer);
    if (aLeft == 1 && aRight == 0) {
      _hairRight();
      console.log('right');
    } else if (aLeft == 0 && aRight == 1) {
      _hairLeft();
      console.log('left');
    } else if (aLeft == 1 && aRight == 1) {
      _hairUp();
      console.log('up');
    }
    timer = setTimeout(function() {
      aLeft = 0;
      aRight = 0;
      _hair();
    }, 500);
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
