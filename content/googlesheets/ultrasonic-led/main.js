var deviceID = document.getElementById('deviceID');
var ledPin = document.getElementById('ledPin');
var trigPin = document.getElementById('trigPin');
var echoPin = document.getElementById('echoPin');
var detectTime = document.getElementById('detectTime');
var distance = document.getElementById('distance');
var sheetUrl = document.getElementById('sheetUrl');
var sheetUrName = document.getElementById('sheetName');
var submit = document.getElementById('submit');
var refresh = document.getElementById('refresh');
var msg = document.getElementById('msg');
var c_on = 0;
var c_off = 1;

function writeSheetData(d) {
  $.get("https://script.google.com/macros/s/AKfycbyrYjDKcUswV_9VADdmHZ7WHnT5KmBp13k0-1NNCcDQ9w8H463m/exec", d);
}

function readSheetData(d, callback) {
  $.get("https://script.google.com/macros/s/AKfycbxJjv240G64yTmUyIzkCKi9r7Jux2c1YvEsaDWS-eawMjQz-nQ/exec", d, function(data) {
    callback(data);
  });
}

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

var dht;
var myData = {};

if (window.localStorage.googlesheetDhtSave) {
  var jsonObj = JSON.parse(window.localStorage.googlesheetDhtSave);
  deviceID.value = jsonObj.deviceID;
  ledPin.value = jsonObj.ledPin;
  trigPin.value = jsonObj.trigPin;
  echoPin.value = jsonObj.echoPin;
  detectTime.value = jsonObj.detectTime;
  distance.value = jsonObj.distance;
  sheetUrl.value = jsonObj.sheetUrl;
  sheetName.value = jsonObj.sheetName;
}

function localStorageSave() {
  var jsonOString = JSON.stringify({
    'deviceID': deviceID.value,
    'ledPin': ledPin.value,
    'trigPin': trigPin.value,
    'echoPin': echoPin.value,
    'sheetUrl': sheetUrl.value,
    'sheetName': sheetName.value,
    'detectTime': detectTime.value,
    'distance': distance.value
  });
  window.localStorage.googlesheetDhtSave = jsonOString;
}


submit.onclick = function() {
  submit.disabled = true;
  refresh.disabled = false;
  localStorageSave();
  console.log('prepare...');
  boardReady(deviceID.value, function(board) {
    console.log('board ready');
    board.systemReset();
    board.samplingInterval = 250;
    led = getLed(board, ledPin.value);
    ultrasonic = getUltrasonic(board, trigPin.value, echoPin.value);
    myData = {};
    myData.sheetUrl = sheetUrl.value;
    myData.sheetName = sheetName.value;
    console.log(myData);
    ultrasonic.ping(function(cm) {
      if (ultrasonic.distance <= distance.value) {
        led.on();
        c_on = c_on + 1;
        c_off = 0;
        if (c_on == 1) {
          msg.innerHTML = '距離：' + ultrasonic.distance + ' 公分';
          myData.column0 = get_time("hms");
          myData.column1 = ultrasonic.distance;
          myData.column2 = '開燈';
          writeSheetData(myData);
        }
      } else{
        led.off();
        c_on = 0;
        c_off = c_off + 1;
        if (c_off == 1) {
          msg.innerHTML = '距離：' + ultrasonic.distance + ' 公分';
          myData.column0 = get_time("hms");
          myData.column1 = ultrasonic.distance;
          myData.column2 = '關燈';
          writeSheetData(myData);
        }
      }
    }, detectTime.value);
  });
};

refresh.onclick = function() {
  localStorageSave();
  location.reload();
};
