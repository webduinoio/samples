var deviceID = document.getElementById('deviceID');
var trigPin = document.getElementById('trigPin');
var echoPin = document.getElementById('echoPin');
var detectTime = document.getElementById('detectTime');
var distance = document.getElementById('distance');
var mapAddress = document.getElementById('mapAddress');
var mapAddressName = document.getElementById('mapAddressName');
var submit = document.getElementById('submit');
var refresh = document.getElementById('refresh');
var errorMsg = document.getElementById('errorMsg');
var light, lightOn, lightOff, note, showTime;
var led, button;
var c_on = 0;
var c_off = 1;
var v;

//var gmapKey = 'AIzaSyB6TBwRrd2pQeyD0COblf4uADkO1EMjSCw';
var gmapCenter = '高雄市前鎮區復興四路20號';
var gmapZoom = 16;
var gmapZIndex = 1;
var gmap;
var gmapPosArray = [];
var gmapMarkerArray = [];
var marker, m;
var a = -1;
var b = 0;

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

if (window.localStorage.googleMapShow) {
  var jsonObj = JSON.parse(window.localStorage.googleMapShow);
  deviceID.value = jsonObj.deviceID;
  ledPin.value = jsonObj.ledPin;
  trigPin.value = jsonObj.trigPin;
  echoPin.value = jsonObj.echoPin;
  detectTime.value = jsonObj.detectTime;
  distance.value = jsonObj.distance;
  mapAddress.value = jsonObj.mapAddress;
  mapAddressName.value = jsonObj.mapAddressName;
}

function localStorageSave() {
  var jsonOString = JSON.stringify({
    'deviceID': deviceID.value,
    'ledPin': ledPin.value,
    'trigPin': trigPin.value,
    'echoPin': echoPin.value,
    'detectTime': detectTime.value,
    'distance': distance.value,
    'mapAddress': mapAddress.value,
    'mapAddressName': mapAddressName.value
  });
  window.localStorage.googleMapShow = jsonOString;
}


function gmapFn() {

  initialize();

  function initialize() {
    gmap = new google.maps.Map(document.getElementById('map'), {
      zoom: gmapZoom
    });
    setCenter(gmapCenter);
  }

  function setCenter(address) {
    marker = new google.maps.Marker({
      map: gmap
    });
    geocoder = new google.maps.Geocoder();
    geocoder.geocode({
      address: address
    }, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        LatLng = results[0].geometry.location;
        gmap.setCenter(LatLng);
      } else {
        gmap.setCenter({
          lat: 22.604,
          lng: 120.299
        });
      }
    });
  }

  function addressMarker(address, title, markerID, callback, icon) {
    if (gmapPosArray.indexOf(markerID) == -1) {

      gmapPosArray.push(markerID);

      gmapZIndex = gmapZIndex + 1;

      var marker = new google.maps.Marker({
        map: gmap,
        zIndex: gmapZIndex,
        icon: 'off.png'
      });

      gmapMarkerArray.push(marker);

      geocoder = new google.maps.Geocoder();
      geocoder.geocode({
        address: address
      }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          LatLng = results[0].geometry.location;
          marker.setPosition(LatLng);
          gmap.setCenter(LatLng);
          console.log('lat:' + LatLng.lat() + ',lng:' + LatLng.lng());

          var infowindow = new google.maps.InfoWindow({
            content: '<div id="' + markerID + '" class="mapMarker" style="z-index:' + gmapZIndex + ';"><h3>' + title + '</h3><div class="markerContent"></div></div>'
          });

          infowindow.open(gmap, marker);

          marker.addListener('click', function() {
            infowindow.open(gmap, marker);
          });

          m = marker;

          google.maps.event.addListener(infowindow, 'domready', function() {
            if (callback && b == 0) {
              b = 1;
              callback();
            };
          });

        } else {
          errorMsg.innerHTML = '無法定義「' + address + '」';
          console.log(address + ' is error');
        }
      });
    }
  }

  submit.onclick = function() {
    submit.disabled = true;
    refresh.disabled = false;
    localStorageSave();
    console.log(mapAddress.value);
    addressMarker(mapAddress.value, mapAddressName.value, 'a1', ok);
  };

  refresh.onclick = function() {
    localStorageSave();
    location.reload();
  };


  function ok() {
    console.log('prepare...');
    boardReady(deviceID.value, function(board) {
      console.log(deviceID.value + ' ready');
      board.systemReset();
      board.samplingInterval = 250;
      led = getLed(board, ledPin.value);
      ultrasonic = getUltrasonic(board, trigPin.value, echoPin.value);
      led.off();
      document.querySelector('#a1 .markerContent').innerHTML = '<span id="note">上線</span>：<span id="showTime"></span><br/><div id="light"><img src="switch-on.png" id="lightOn"><img src="switch-off.png" id="lightOff"></div>';

      note = document.getElementById('note');
      showTime = document.getElementById('showTime');
      light = document.getElementById('light');
      lightOn = document.getElementById('lightOn');
      lightOff = document.getElementById('lightOff');

      showTime.innerHTML = get_time('hms');
      ultrasonic.ping(function(cm) {
        console.log(ultrasonic.distance);
        showTime.innerHTML = get_time('hms') + '<br/>距離：' + ultrasonic.distance +' ';
        if (ultrasonic.distance <= distance.value) {
          c_on = c_on + 1;
          c_off = 0;
          if (c_on == 1) {
            toggle(1);
          }
        } else {
          c_on = 0;
          c_off = c_off + 1;
          if (c_off == 1) {
            toggle(-1);
          }
        }
      }, detectTime.value);
      //button.on("pressed", toggle);
      light.addEventListener('click', function() {
        a = a * -1;
        if(a>0){
          c_on = 1;
          c_off = 0;
        }else{
          c_on = 0;
          c_off = 1;
        }
        toggle(a);
      });
    });
  }

  function toggle(c) {
    showTime.innerHTML = get_time('hms');
    if (c == -1) {
      a = -1;
      m.setIcon('off.png');
      lightOn.style.display = 'none';
      lightOff.style.display = 'inline-block';
      note.innerHTML = '關燈';
      led.off();
    } else {
      a = 1;
      m.setIcon('on.png');
      lightOff.style.display = 'none';
      lightOn.style.display = 'inline-block';
      note.innerHTML = '開燈';
      led.on();
    }
  }

}
