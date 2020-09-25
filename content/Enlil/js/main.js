// 8kjga

let submit = document.getElementById('submit');
let deviceId = document.getElementById('deviceId');

deviceId.value = location.hash.replace('#', '')

window.addEventListener('hashchange', function (e) {
  console.log(e.newURL);
  deviceId.value = e.newURL;
}, false);

submit.onclick = (e) => {
  run()
}

run()

async function run() {
  var rgbled;
  var myData;
  var _E4_BA_AE_E5_BA_A6;
  var _E6_BA_AB_E5_BA_A6;
  var _E6_BF_95_E5_BA_A6;
  var PM25;
  var PM10;
  var max44009;
  var sht31;
  var g3;

  function get_date(t) {
    var varDay = new Date(),
      varYear = varDay.getFullYear(),
      varMonth = varDay.getMonth() + 1,
      varDate = varDay.getDate();
    var varNow;
    if (t == "ymd") {
      varNow = varYear + "/" + varMonth + "/" + varDate;
    } else if (t == "mdy") {
      varNow = varMonth + "/" + varDate + "/" + varYear;
    } else if (t == "dmy") {
      varNow = varDate + "/" + varMonth + "/" + varYear;
    } else if (t == "y") {
      varNow = varYear;
    } else if (t == "m") {
      varNow = varMonth;
    } else if (t == "d") {
      varNow = varDate;
    }
    return varNow;
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

  function _E5_8D_B3_E6_99_82_E8_A8_8A_E6_81_AF() {
    document.getElementById('demo-area-01-show').innerHTML = (['時間：', get_date("ymd"), ' ', get_time("hms"), ("<br/>"), '亮度：', _E4_BA_AE_E5_BA_A6, ("<br/>"), '溫度：', _E6_BA_AB_E5_BA_A6, ("<br/>"), '濕度：', _E6_BF_95_E5_BA_A6, ("<br/>"), 'PM2.5：', PM25, ("<br/>"), 'PM1.0：', PM10].join(''));
  }


  boardReady({ board: 'Smart', device: deviceId.value, transport: 'mqtt' }, async function (board) {
    console.log("ready")
    board.samplingInterval = 50;
    rgbled = getRGBLedCathode(board, 15, 12, 13);
    document.getElementById('demo-area-01-show').style.fontSize = 20 + 'px';
    rgbled.setColor('#33ff33');
    max44009 = getMAX44009(board, 4, 5);

    sht31 = getSHT31(board, 4, 5);
    g3 = getG3(board, 14, 16);


    _E4_BA_AE_E5_BA_A6 = 0;
    _E6_BA_AB_E5_BA_A6 = 0;
    _E6_BF_95_E5_BA_A6 = 0;
    PM25 = 0;
    PM10 = 0;

    max44009.on(async function (_lux) {
      max44009._lux = _lux;
      _E4_BA_AE_E5_BA_A6 = max44009._lux;
    });
    g3.read(async function (val) {
      PM25 = g3.pm25;
      PM10 = g3.pm10;
    }, 1000);
    sht31.on(async function (_temperature, _humidity) {
      sht31._temperature = _temperature;
      sht31._humidity = _humidity;
      _E6_BA_AB_E5_BA_A6 = sht31._temperature;
      _E6_BF_95_E5_BA_A6 = sht31._humidity;
    });

    document.getElementById('demo-area-01-show').innerHTML = '啟動中...';
    await delay(2);
    _E5_8D_B3_E6_99_82_E8_A8_8A_E6_81_AF();
    setInterval(async function () {
      _E5_8D_B3_E6_99_82_E8_A8_8A_E6_81_AF();
    }, 1000 * 2);
  });
}
