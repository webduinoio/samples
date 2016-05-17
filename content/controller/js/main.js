window.addEventListener('load', function() {

  var btnColorOn = '#9f9';
  var btnColorOnText = '#0f0';
  var btnColorOff = '#c00';
  var btnColorOffText = '#f00';
  var btnColorDisabled = '#ccc';
  var btnColorDisabledText = '#fff';
  var btnColorDisabledBorder = '#999';

  var menu = document.getElementById('menu');
  var boardGroup = document.getElementById('boardGroup');

  var myFirebase = new Firebase('https://smarthouse20160519.firebaseio.com/');

  var state = {
    device1: {
      Led1: 'off',
      Led2: 'off',
      Led3: 'off',
      Led4: 'off',
      Led5: 'off',
      Led6: 'off',
      Led7: 'off',
      Servo: 'off'
    },
    device2: {
      Led1: 'off',
      Led2: 'off',
      Led3: 'off',
      Led4: 'off',
      Led5: 'off',
      Led6: 'off',
      Servo: 'off'
    }
  };

  /* device 1 */

  var board1, device1Components;
  var device1 = document.getElementById('device1');
  var device1BtnOn = document.getElementById('device1BtnOn');
  var device1BtnOff = document.getElementById('device1BtnOff');
  var device1State = document.getElementById('device1State');
  var device1BtnGroup = document.querySelector('.device1BtnGroup');
  var device1Btn = [
    document.getElementById('device1Btn1'),
    document.getElementById('device1Btn2'),
    document.getElementById('device1Btn3'),
    document.getElementById('device1Btn4'),
    document.getElementById('device1Btn5'),
    document.getElementById('device1Btn6'),
    document.getElementById('device1Btn7'),
    document.getElementById('device1Btn8')
  ];
  var device1DHT;

  /* device 2 */

  var board2, device2Components;
  var device2 = document.getElementById('device2');
  var device2BtnOn = document.getElementById('device2BtnOn');
  var device2BtnOff = document.getElementById('device2BtnOff');
  var device2State = document.getElementById('device2State');
  var device2BtnGroup = document.querySelector('.device2BtnGroup');
  var device2Btn = [
    document.getElementById('device2Btn1'),
    document.getElementById('device2Btn2'),
    document.getElementById('device2Btn3'),
    document.getElementById('device2Btn4'),
    document.getElementById('device2Btn5'),
    document.getElementById('device2Btn6'),
    document.getElementById('device2Btn7')
  ];
  var device2DHT;

  /* device 3 */

  var device3 = document.getElementById('device3');
  var device3BtnOn = document.getElementById('device3BtnOn');
  var device3BtnOff = document.getElementById('device3BtnOff');
  var device3State = document.getElementById('device3State');
  var device3RFID;
  var device3BtnGroup = document.querySelector('.device3BtnGroup');
  var device3RFIDCode = document.getElementById('device3RFIDCode');

  /* firebase */

  myFirebase.limitToLast(1).on('child_added', function(snapshot) {
    state = snapshot.val();
    if (board1) {
      checkDevice1State();
    }
    if (board2) {
      checkDevice2State();
    }
  });

  /* menu event */

  menu.onclick = function() {
    if (boardGroup.className == 'show') {
      boardGroup.className = '';
    } else {
      boardGroup.className = 'show';
    }
  };


  /* device 1 online event */

  device1BtnOn.onclick = function() {
    boardReady({
      device: device1.value,
      multi: true
    }, function(board) {
      board1 = board;
      device1BtnGroup.style.opacity = 1;
      device1BtnOn.className = 'hidden';
      device1BtnOff.className = '';
      device1Components = [
        getLed(board, 11),
        getLed(board, 10),
        getLed(board, 9),
        getLed(board, 8),
        getLed(board, 7),
        getLed(board, 6),
        getLed(board, 5),
        getServo(board, 12)
      ];
      device1DHT = getDht(board, 2);

      checkDevice1State();

      for (var i = 0; i < device1Btn.length; i++) {
        device1Btn[i].disabled = false;
        device1Btn[i].onclick = function() {
          var self = this;
          var o = self.getAttribute('data-order');
          var c = self.getAttribute('data-components');
          if (i < (device1Btn.length - 1)) {
            if (state.device1[c] == 'off') {
              device1Components[o].on(function() {
                state.device1[c] = 'on';
                deviceStateOn(self);
              });
            } else {
              device1Led1.off(function() {
                state.device1[c] = 'off';
                deviceStateOff(self);
              });
            }
          } else {
            if (state.device1[c] == 'off') {
              device1Components[o].angle = 170;
              state.device1[c] = 'on';
              deviceStateOn(self);
            } else {
              device1Components[o].angle = 10;
              state.device1[c] = 'off';
              deviceStateOff(self);
            }
          }
        };
      }

      device1DHT.read(function(e) {
        document.getElementById("dht1").innerHTML = '<span class="t">' +
          e.temperature + ' 度</span> / <span class="h">' + e.humidity + ' %</span>';
      }, 30000);

      device1BtnOff.onclick = function() {
        board.disconnect();
        device1BtnGroup.style.opacity = 0.4;
        document.getElementById("dht1").innerHTML = ' -- / -- ';
        device1Offline();
        alert('一樓離線');
      }

      board.on('error', function(err) {
        board.error = err;
        device1BtnGroup.style.opacity = 0.4;
        document.getElementById("dht1").innerHTML = ' -- / -- ';
        device1Offline();
        alert('一樓離線');
      });
    });
  };


  /* device 2 online event */

  device2BtnOn.onclick = function() {
    boardReady({
      device: device2.value,
      multi: true
    }, function(board) {
      board2 = board;
      device2BtnGroup.style.opacity = 1;
      device2BtnOn.className = 'hidden';
      device2BtnOff.className = '';
      device2Components = [
        getLed(board, 11),
        getLed(board, 10),
        getLed(board, 9),
        getLed(board, 8),
        getLed(board, 7),
        getLed(board, 6),
        getServo(board, 12)
      ];

      device2DHT = getDht(board, 2);

      checkDevice2State();

      for (var i = 0; i < device2Btn.length; i++) {
        device2Btn[i].disabled = false;
        device2Btn[i].onclick = function() {
          var self = this;
          var o = self.getAttribute('data-order');
          var c = self.getAttribute('data-components');
          if (i < (device2Btn.length - 1)) {
            if (state.device2[c] == 'off') {
              device2Components[o].on(function() {
                state.device2[c] = 'on';
                deviceStateOn(self);
              });
            } else {
              device2Led1.off(function() {
                state.device2[c] = 'off';
                deviceStateOff(self);
              });
            }
          } else {
            if (state.device2[c] == 'off') {
              device2Components[o].angle = 170;
              state.device2[c] = 'on';
              deviceStateOn(self);
            } else {
              device2Components[o].angle = 10;
              state.device2[c] = 'off';
              deviceStateOff(self);
            }
          }
        };
      }

      device2DHT.read(function(e) {
        document.getElementById("dht2").innerHTML = '<span class="t">' + e.temperature + ' 度</span> / <span class="h">' + e.humidity + ' %</span>';
      }, 300000);

      device2BtnOff.onclick = function() {
        board.disconnect();
        device2BtnGroup.style.opacity = 0.4;
        document.getElementById("dht2").innerHTML = ' -- / -- ';
        alert('二樓離線');
        device2Offline();
      }

      board.on('error', function(err) {
        board.error = err;
        device2BtnGroup.style.opacity = 0.4;
        document.getElementById("dht2").innerHTML = ' -- / -- ';
        alert('二樓離線');
        device2Offline();
      });
    });
  };

  /* device 3 online event */

  device3BtnOn.onclick = function() {
    boardReady({
      device: device3.value,
      multi: true
    }, function(board) {
      board3 = board;
      device3BtnGroup.style.opacity = 1;
      device3BtnOn.className = 'hidden';
      device3BtnOff.className = '';
      device3RFID = getRFID(board);
      device3RFID.read();

      function get_time(t) {
        var varTime = new Date(),
          varHours = varTime.getHours(),
          varMinutes = varTime.getMinutes(),
          varSeconds = varTime.getSeconds();
        var varNow;
        if (t == "hms") {
          varNow = varHours + ":" + varMinutes + ":" + varSeconds;
        } else if (t == "h") {
          varNow = varHours;
        } else if (t == "m") {
          varNow = varMinutes;
        } else if (t == "s") {
          varNow = varSeconds;
        }
        return varNow;
      }

      var code;
      device3RFID.on("enter", function(uid) {
        if (uid == '0604C63B') {
          //藍
          code = device3RFIDCode.innerHTML || '';
          device3RFIDCode.innerHTML = code + '開門 / ' + uid + ' / ' + get_time("hms") + '<br/>';
          state.device1.Servo = 'on';
          device1Components[5].angle = 10;
          device1Btn[5].querySelector('i').style.color = btnColorOnText;
          myFirebase.push(state);
        }
        if (uid == '26195C14') {
          //綠
          code = device3RFIDCode.innerHTML || '';
          device3RFIDCode.innerHTML = code + '全開 / ' + uid + ' / ' + get_time("hms") + '<br/>';
          for (var i = 0; i < device1Btn.length; i++) {
            var cc = device1Btn[i].getAttribute('data-components');
            state.device1[cc] = 'on';
            if (i < (device1Btn.length - 1)) {
              device1Components[i].on();
            } else {
              device1Components[i].angle = 170;
            }
            device1Btn[i].querySelector('i').style.color = btnColorOffText;
          }
          for (var i = 0; i < device2Btn.length; i++) {
            var cc = device2Btn[i].getAttribute('data-components');
            state.device2[cc] = 'on';
            if (i < (device2Btn.length - 1)) {
              device2Components[i].on();
            } else {
              device2Components[i].angle = 170;
            }
            device2Btn[i].querySelector('i').style.color = btnColorOffText;
          }
          myFirebase.push(state);
        }
        if (uid == '6520DE52') {
          //橘
          code = device3RFIDCode.innerHTML || '';
          device3RFIDCode.innerHTML = code + '全關 / ' + uid + ' / ' + get_time("hms") + '<br/>';
          for (var i = 0; i < device1Btn.length; i++) {
            var cc = device1Btn[i].getAttribute('data-components');
            state.device1[cc] = 'off';
            if (i < (device1Btn.length - 1)) {
              device1Components[i].off();
            } else {
              device1Components[i].angle = 10;
            }
            device1Btn[i].querySelector('i').style.color = btnColorOffText;
          }
          for (var i = 0; i < device2Btn.length; i++) {
            var cc = device2Btn[i].getAttribute('data-components');
            state.device2[cc] = 'off';
            if (i < (device2Btn.length - 1)) {
              device2Components[i].off();
            } else {
              device2Components[i].angle = 10;
            }
            device2Btn[i].querySelector('i').style.color = btnColorOffText;
          }
          myFirebase.set({});
          myFirebase.push(state);

        }
        if (uid == '5685C43B') {
          //黃
          code = device3RFIDCode.innerHTML || '';
          device3RFIDCode.innerHTML = code + '關門 / ' + uid + ' / ' + get_time("hms") + '<br/>';
          state.device1.Servo = 'off';
          device1Components[5].angle = 10;
          device1Btn[5].querySelector('i').style.color = btnColorOffText;
          myFirebase.push(state);
        }
      });

      device3BtnOff.onclick = function() {
        board.disconnect();
        device3BtnGroup.style.opacity = 0.4;
        alert('門禁監控離線');
        device3Offline();
      }

      board.on('error', function(err) {
        board.error = err;
        device3BtnGroup.style.opacity = 0.4;
        alert('門禁監控離線');
        device3Offline();
      });
    });
  };

  /* check device's init pin status */

  function checkDevice1State() {
    for (var i = 0; i < device1Btn.length; i++) {
      var o = device1Btn[i].getAttribute('data-order');
      var c = device1Btn[i].getAttribute('data-components');
      if (i < (device1Btn.length - 1)) {
        if (state.device1[c] == 'on') {
          checkDeviceStateOn(device1Btn, i)
          device1Components[i].on();
        } else {
          checkDeviceStateOff(device1Btn, i)
          device1Components[i].off();
        }
      } else {
        if (state.device1[c] == 'on') {
          checkDeviceStateOn(device1Btn, i)
          device1Btn[i].querySelector('i').className = 'icon-radio-unchecked';
          device1Components[i].angle = 10;
        } else {
          checkDeviceStateOff(device1Btn, i)
          device1Btn[i].querySelector('i').className = 'icon-blocked';
          device1Components[i].angle = 170;
        }
      }
    }
  }

  function checkDevice2State() {
    for (var i = 0; i < device2Btn.length; i++) {
      var o = device2Btn[i].getAttribute('data-order');
      var c = device2Btn[i].getAttribute('data-components');
      if (i < (device2Btn.length - 1)) {
        if (state.device2[c] == 'on') {
          checkDeviceStateOn(device2Btn, i)
          device2Components[i].on();
        } else {
          checkDeviceStateOff(device2Btn, i)
          device2Components[i].off();
        }
      } else {
        if (state.device2[c] == 'on') {
          checkDeviceStateOn(device2Btn, i)
          device2Components[i].angle = 10;
          device2Btn[i].querySelector('i').className = 'icon-radio-unchecked';
        } else {
          checkDeviceStateOff(device2Btn, i)
          device2Components[i].angle = 170;
          device2Btn[i].querySelector('i').className = 'icon-blocked';
        }
      }
    }
  }

  /* UI event */

  function deviceStateOn(d) {
    d.style.borderLeftColor = btnColorOnText;
    d.querySelector('i').style.color = btnColorOnText;
    myFirebase.push(state);
  }

  function deviceStateOff(d) {
    d.style.borderLeftColor = btnColorOffText;
    d.querySelector('i').style.color = btnColorOffText;
    myFirebase.push(state);
  }

  function checkDeviceStateOn(d, s) {
    d[s].style.borderLeftColor = btnColorOnText;
    d[s].querySelector('i').style.color = btnColorOnText;
  }

  function checkDeviceStateOff(d, s) {
    d[s].style.borderLeftColor = btnColorOffText;
    d[s].querySelector('i').style.color = btnColorOffText;
  }

  /* device offline event */

  function device1Offline() {
    device1BtnOn.className = '';
    device1BtnOff.className = 'hidden';
    for (var i = 0; i < device1Btn.length; i++) {
      device1Btn[i].disabled = true;
      device1Btn[i].style.color = btnColorDisabledText;
      device1Btn[i].style.borderLeftColor = btnColorDisabledBorder;
      device1Btn[i].querySelector('i').style.color = btnColorDisabledText;
    }
  }

  function device2Offline() {
    device2BtnOn.className = '';
    device2BtnOff.className = 'hidden';
    for (var i = 0; i < device2Btn.length; i++) {
      device2Btn[i].disabled = true;
      device2Btn[i].style.color = btnColorDisabledText;
      device2Btn[i].style.borderLeftColor = btnColorDisabledBorder;
      device2Btn[i].querySelector('i').style.color = btnColorDisabledText;
    }
  }

  function device3Offline() {
    device3BtnOn.className = '';
    device3BtnOff.className = 'hidden';
    device3State.style.background = '#c00';
    device3RFIDCode.innerHTML = '';
  }
}, false);
