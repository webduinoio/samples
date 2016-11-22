var deviceID = document.getElementById('deviceID');
var dhtPin = document.getElementById('dhtPin');
var dhtTime = document.getElementById('dhtTime');
var sheetUrl = document.getElementById('sheetUrl');
var sheetUrName = document.getElementById('sheetName');
var submit = document.getElementById('submit');
var refresh = document.getElementById('refresh');
var msg = document.getElementById('msg');

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
  dhtPin.value = jsonObj.dhtPin;
  dhtTime.value = jsonObj.dhtTime;
  sheetUrl.value = jsonObj.sheetUrl;
  sheetName.value = jsonObj.sheetName;
}

function localStorageSave() {
  var jsonOString = JSON.stringify({
    'deviceID': deviceID.value,
    'dhtPin': dhtPin.value,
    'sheetUrl': sheetUrl.value,
    'sheetName': sheetName.value,
    'dhtTime': dhtTime.value
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
    dht = getDht(board, dhtPin.value * 1);
    myData = {};
    myData.sheetUrl = sheetUrl.value;
    myData.sheetName = sheetName.value;
    console.log(myData);
    dht.read(function(evt) {
      console.log(dht.temperature + ',' + dht.humidity);
      console.log(msg);
      msg.innerHTML = '溫度：' + dht.temperature + ' 度<br/>濕度：' + dht.humidity + '%';
      myData.column0 = get_time("hms");
      myData.column1 = dht.temperature;
      myData.column2 = dht.humidity;
      writeSheetData(myData);
    }, dhtTime.value * 1);
  });
};

refresh.onclick = function() {
  localStorageSave();
  location.reload();
};

