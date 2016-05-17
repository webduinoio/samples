window.addEventListener('load', function() {

  var s = document.getElementById('s');
  var fingerNum = 0;
  var ar = [];
  var div = document.querySelectorAll('.btn');
  var content = document.getElementById('content');
  var menu = document.getElementById('menu');
  var close = document.getElementById('close-btn');
  var hammer = new Hammer(window);

  hammer.on('swipeleft',function(){
    menu.style.width="100%";
  });
  hammer.on('swiperight',function(){
    menu.style.width="0";
  });

  close.addEventListener('touchend',function(){
    menu.style.width="0";
  });

  function joypad(m) {
    if (m == 'a') {
      s.innerHTML = '左前';
    }
    if (m == 'b') {
      s.innerHTML = '左後';
    }
    if (m == 'c') {
      s.innerHTML = '右前';
    }
    if (m == 'd') {
      s.innerHTML = '右後';
    }
    if (m == 'ac' || m == 'ca') {
      s.innerHTML = '往前';
    }
    if (m == 'ad' || m == 'da') {
      s.innerHTML = '左轉';
    }
    if (m == 'cb' || m == 'bc') {
      s.innerHTML = '右轉';
    }
    if (m == 'bd' || m == 'db') {
      s.innerHTML = '後退';
    }
    if (m == 'ab' || m == 'ba') {
      s.innerHTML = '';
    }
    if (m == 'cd' || m == 'dc') {
      s.innerHTML = '';
    }
  }

  function down(e) {
    e.target.style.borderWidth = "10px";
    e.target.style.borderRadius = "20px";
    var name = e.target.getAttribute('data-name');
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
      s.innerHTML = '停止';
    }
    if (ar[0] == name) {
      ar.splice(0, 1);
      joypad((ar[0]));
    }
    if (ar[1] == name) {
      ar.splice(1, 2);
      joypad((ar[0]));
    }
  }


  for (var i = 0; i < div.length; i++) {
    div[i].addEventListener('touchstart', down);
    div[i].addEventListener('touchend', up);
  }


}, false);
