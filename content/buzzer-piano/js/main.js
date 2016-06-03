window.addEventListener('load', function() {

  var cc1 = new Clipboard('#cc1');
  var cc2 = new Clipboard('#cc2');

  var setBtn = document.getElementById('set'),
    device = document.getElementById('device'),
    pin = document.getElementById('pin'),
    keyboard = document.querySelectorAll('.keyboard'),
    buzzer,
    show = document.getElementById("show"),
    showTempo = document.getElementById("showtempo"),
    replay = document.getElementById("replay"),
    recode = document.getElementById("recode"),
    c1 = document.getElementById("cc1"),
    c2 = document.getElementById("cc2"),
    tempoInput = document.getElementById("num"),
    tempo = document.getElementById("tempo"),
    test = document.getElementById("test"),
    stop = document.getElementById("stop"),
    back = document.getElementById("delete"),
    clear = document.getElementById("clear"),
    buzzerArray = [],
    tempoArray = [],
    music,
    a, ts, pt, pb,
    tempoNum = 8,
    check = 0;

  for (var i = 0; i < keyboard.length; i++) {
    keyboard[i].setAttribute('disabled', 'disabled');
    keyboard[i].style.opacity = ".3";
  }

  tempoNum = tempo.value;

  msg.innerHTML = "裝置尚未連線";
  device.setAttribute('value', localStorage.device || "");
  if (localStorage.pin) {
    var p = localStorage.pin - 2;
    pin[p].setAttribute('selected', 'selected');
  }

  setBtn.onclick = function() {
    msg.innerHTML = "裝置連線中...";
    boardReady({
      device: device.value,
      multi: true
    }, function(board) {
      msg.innerHTML = "裝置已連線";
      for (var i = 0; i < keyboard.length; i++) {
        keyboard[i].removeAttribute('disabled');
        keyboard[i].style.opacity = "1";
      }
      localStorage.device = device.value;
      localStorage.pin = pin.value;
      buzzer = getBuzzer(board, pin.value);
      ready();
    });
  };


  function ready() {
    console.log('ready');

    _buzzer(0);

    tempo.oninput = function() {
      tempoNum = tempo.value;
      tempoInput.innerText = tempoNum;
    };

    recode.addEventListener('click', function() {
      tempoArray = [];
      buzzerArray = [];
      recode.setAttribute('disabled', 'disabled');
      recode.className = 'menu disabled';
      stop.removeAttribute('disabled');
      stop.className = 'menu';
      replay.setAttribute('disabled', 'disabled');
      replay.className = 'menu disabled';
      back.removeAttribute('disabled');
      back.className = 'menu';
      clear.removeAttribute('disabled');
      clear.className = 'menu';
      test.removeAttribute('disabled');
      test.className = 'menu';
      recode.innerText = '錄音進行中...';
      show.innerText = '';
      showTempo.innerText = '';
      _buzzer(1);

    });

    back.addEventListener('click', function() {
      tempoArray.pop();
      pt = tempoArray.toString();
      buzzerArray.pop();
      pb = buzzerArray.toString();
      showTempo.innerText = pt;
      show.innerText = pb;
      console.log('back:' + buzzerArray);
    });

    clear.addEventListener('click', function() {
      tempoArray = [];
      buzzerArray = [];
      show.innerText = '';
      showTempo.innerText = '';
    });

    stop.addEventListener('click', function() {
      recode.removeAttribute('disabled');
      recode.className = 'menu';
      stop.setAttribute('disabled', 'disabled');
      stop.className = 'menu disabled';
      replay.removeAttribute('disabled');
      replay.className = 'menu';
      back.setAttribute('disabled', 'disabled');
      back.className = 'menu disabled';
      clear.setAttribute('disabled', 'disabled');
      clear.className = 'menu disabled';
      test.setAttribute('disabled', 'disabled');
      test.className = 'menu disabled';
      recode.innerText = '重新記錄';
      _buzzer(0);
      console.log('stop:' + buzzerArray);
    });

    replay.addEventListener('click', function() {
      console.log('replay:' + buzzerArray);
      buzzer.play(buzzerArray, tempoArray);
    });

    test.addEventListener('click', function() {
      console.log('test:' + buzzerArray);
      buzzer.play(buzzerArray, tempoArray);
    });

    function _buzzer(check) {
      if (check === 1) {
        for (var i = 0; i < keyboard.length; i++) {
          keyboard[i].addEventListener('click', rr);
          keyboard[i].removeEventListener('click', ss);
        }
      } else {
        for (var i = 0; i < keyboard.length; i++) {
          keyboard[i].addEventListener('click', ss);
          keyboard[i].removeEventListener('click', rr);
        }
      }
    }

    function rr(e) {
      a = e.target.getAttribute('notes');
      buzzer.play([a], [tempoNum]);
      buzzerArray.push(a);
      tempoArray.push(tempoNum);
      ts = tempoArray.toString();
      music = buzzerArray.toString();
      show.innerHTML = music;
      showTempo.innerHTML = ts;
    }

    function ss(e) {
      a = e.target.getAttribute('notes');
      buzzer.play([a], [tempoNum]);
    }

  };

}, false);
