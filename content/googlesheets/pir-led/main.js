var deviceID = document.getElementById('deviceID');
var ledPin = document.getElementById('ledPin');
var pirPin = document.getElementById('pirPin');
var sheetUrl = document.getElementById('sheetUrl');
var sheetUrName = document.getElementById('sheetName');
var submit = document.getElementById('submit');
var refresh = document.getElementById('refresh');
var msg = document.getElementById('msg');
var c_on = 0;
var c_off = 1;
var v;

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
  pirPin.value = jsonObj.pirPin;
  sheetUrl.value = jsonObj.sheetUrl;
  sheetName.value = jsonObj.sheetName;
}

function localStorageSave() {
  var jsonOString = JSON.stringify({
    'deviceID': deviceID.value,
    'ledPin': ledPin.value,
    'pirPin': pirPin.value,
    'sheetUrl': sheetUrl.value,
    'sheetName': sheetName.value
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
    pir = getPir(board, pirPin.value);
    myData = {};
    myData.sheetUrl = sheetUrl.value;
    myData.sheetName = sheetName.value;
    console.log(myData);
    pir.on("detected", function() {
      led.on();
      msg.innerHTML = '有人靠近！';
      myData.column0 = get_time("hms");
      myData.column1 = '開燈';
      writeSheetData(myData);
    });
    pir.on("ended", function() {
      led.off();
      msg.innerHTML = '偵測中...';
      myData.column0 = get_time("hms");
      myData.column1 = '關燈';
      writeSheetData(myData);
    });
  });
};

refresh.onclick = function() {
  localStorageSave();
  location.reload();
};
