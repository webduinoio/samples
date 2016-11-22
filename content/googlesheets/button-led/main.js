var deviceID = document.getElementById('deviceID');
var ledPin = document.getElementById('ledPin');
var buttonPin = document.getElementById('buttonPin');
var buttonType = document.getElementById('buttonType');
var sheetUrl = document.getElementById('sheetUrl');
var sheetUrName = document.getElementById('sheetName');
var submit = document.getElementById('submit');
var refresh = document.getElementById('refresh');
var light = document.getElementById('light');
var lightOn = document.getElementById('lightOn');
var lightOff = document.getElementById('lightOff');

var led, button;
var myData = {};
var a = -1;

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

if (window.localStorage.googlesheetSave) {
  var jsonObj = JSON.parse(window.localStorage.googlesheetSave);
  deviceID.value = jsonObj.deviceID;
  ledPin.value = jsonObj.ledPin;
  buttonPin.value = jsonObj.buttonPin;
  buttonType.value = jsonObj.buttonType;
  sheetUrl.value = jsonObj.sheetUrl;
  sheetName.value = jsonObj.sheetName;
}

function localStorageSave() {
  var jsonOString = JSON.stringify({
    'deviceID': deviceID.value,
    'ledPin': ledPin.value,
    'buttonPin': buttonPin.value,
    'buttonType': buttonType.value,
    'sheetUrl': sheetUrl.value,
    'sheetName': sheetName.value
  });
  window.localStorage.googlesheetSave = jsonOString;
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
    led = getLed(board, ledPin.value * 1);
    led.on();
    if (buttonType == 1) {
      button = getButton(board, buttonPin.value * 1);
    } else {
      button = getPullupButton(board, buttonPin.value * 1);
    }
    myData = {};
    myData.sheetUrl = sheetUrl.value;
    myData.sheetName = sheetName.value;
    console.log(myData);
    button.on("pressed", function(){
      toggle();
    });
    light.addEventListener('click',function(){
      toggle();
    });
    function toggle() {
      console.log(get_time("hms"));
      a = a * -1;
      if (a < 0) {
        led.off();
        lightOff.style.display = 'inline-block';
        lightOn.style.display = 'none';
        myData.column0 = get_time("hms");
        myData.column1 = '關燈';
      } else {
        led.on();
        lightOff.style.display = 'none';
        lightOn.style.display = 'inline-block';
        myData.column1 = '燈打開了';
      }
      writeSheetData(myData);
    }
  });
};

refresh.onclick = function() {
  localStorageSave();
  location.reload();
};
