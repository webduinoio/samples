var deviceID = document.getElementById('deviceID');
var dhtPin = document.getElementById('dhtPin');
var dhtTime = document.getElementById('dhtTime');
var mapAddress = document.getElementById('mapAddress');
var mapAddressName = document.getElementById('mapAddressName');
var submit = document.getElementById('submit');
var refresh = document.getElementById('refresh');
var errorMsg = document.getElementById('errorMsg');

if (window.localStorage.deviceID) {
  deviceID.value = window.localStorage.deviceID;
}
if (window.localStorage.dhtPin) {
  dhtPin.value = window.localStorage.dhtPin;
}
if (window.localStorage.dhtTime) {
  dhtTime.value = window.localStorage.dhtTime;
}
if (window.localStorage.mapAddress) {
  mapAddress.value = window.localStorage.mapAddress;
}
if (window.localStorage.mapAddressName) {
  mapAddressName.value = window.localStorage.mapAddressName;
}


//var gmapKey = 'AIzaSyB6TBwRrd2pQeyD0COblf4uADkO1EMjSCw';
var gmapCenter = '高雄市前鎮區復興四路20號';
var gmapZoom = 16;
var gmapZIndex = 1;
var gmap;
var gmapPosArray = [];
var gmapMarkerArray = [];

function get_time(t) {
  var varTime = new Date(),
    varHours = varTime.getHours(),
    varMinutes = varTime.getMinutes(),
    varSeconds = varTime.getSeconds();
  if (varHours * 1 < 10) {
    varHours = '0' + varHours;
  }
  if (varMinutes * 1 < 10) {
    varMinutes = '0' + varMinutes;
  }
  if (varSeconds * 1 < 10) {
    varSeconds = '0' + varSeconds;
  }
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


function gmapFn() {

  initialize();

  function initialize() {
    gmap = new google.maps.Map(document.getElementById('map'), {
      zoom: gmapZoom
    });
    setCenter(gmapCenter);
  }

  function setCenter(address) {
    var marker = new google.maps.Marker({
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

      if (icon) {
        var marker = new google.maps.Marker({
          map: gmap,
          zIndex: gmapZIndex,
          icon: icon
        });
      } else {
        var marker = new google.maps.Marker({
          map: gmap,
          zIndex: gmapZIndex
        });
      }

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

          google.maps.event.addListener(infowindow, 'domready', function() {
            if (callback) {
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

  function localStorageSave() {
    window.localStorage.deviceID = deviceID.value;
    window.localStorage.dhtPin = dhtPin.value;
    window.localStorage.mapAddressName = mapAddressName.value;
    window.localStorage.mapAddress = mapAddress.value;
    window.localStorage.dhtTime = dhtTime.value;
  }


  submit.onclick = function() {
    submit.disabled = true;
    refresh.disabled = false;
    localStorageSave();
    addressMarker(mapAddress.value, mapAddressName.value, 'a1', test);
  };

  refresh.onclick = function() {
    localStorageSave();
    location.reload();
  };


  function test() {
    console.log('ready');
    boardReady(deviceID.value, function(board) {
      console.log('board ready');
      board.systemReset();
      board.samplingInterval = 250;
      dht = getDht(board, dhtPin.value * 1);
      dht.read(function(evt) {
        document.querySelector('#a1 .markerContent').innerHTML = '偵測時間：' + get_time("hms") + '<br/>溫度：' + dht.temperature + '度<br/>濕度：' + dht.humidity + '%';
      }, dhtTime.value * 1);
    });
  }

}
