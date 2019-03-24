let Camera = (function () {
  const webCam = 0;
  const wsCam = 1;
  const jpgCam = 2;
  const imgStreamCam = 3;

  class Camera {
    // webCam: 0,1,2
    // jpgCam: http://192.168.0.11/jpg
    // wsCam:  ws://192.168.43.110:8889/rws/ws
    constructor(camType) {
      if (arguments.length == 0) {
        camType = 0;
      }
      this.setCamType(camType);
      this.setFlip(false);
    }

    setCamType(camType) {
      this.cameraList = [];
      if (isNaN(parseInt(camType))) {
        this.URL = camType;
        if (camType.indexOf("ws://") == 0) {
          this.camType = wsCam;
        } else if (camType.indexOf("http://") == 0) {
          if (camType.indexOf(":81/stream") > 0) {
            this.camType = imgStreamCam;
          } else {
            this.camType = jpgCam;
          }
          this.rotate = false;
        }
      } else {
        this.camType = webCam;
        this.webCamSelect = camType;
      }
    }

    setRotate(bool) {
      this.rotate = bool;
      return this;
    }

    setFlip(bool) {
      this.flip = bool;
      return this;
    }

    list(callback) {
      var self = this;
      this.enumerateDevices(function () {
        callback(self.cameraList);
      });
    }

    enumerateDevices(cb) {
      var self = this;
      return new Promise(function (resolve, reject) {
        navigator.mediaDevices.enumerateDevices()
          .then(function (o) {
            self.gotDevices(self, o);
            if (cb) cb();
            resolve();
          }).catch(self.handleError);
      });
    }

    gotDevices(self, deviceInfos) {
      for (var i = 0; i !== deviceInfos.length; ++i) {
        var deviceInfo = deviceInfos[i];
        if (deviceInfo.kind === 'videoinput') {
          self.cameraList.push(deviceInfo);
        }
      }
    }

    async startCam() {
      switch (this.camType) {
        case webCam:
          await this.enumerateDevices();
          if (window.stream) {
            window.stream.getTracks().forEach(function (track) {
              track.stop();
            });
          }
          var deviceId = 0;
          try {
            deviceId = this.cameraList[this.webCamSelect].deviceId;
          } catch (e) {
            console.log("can't found camType:", this.camType, "error:", e);
            console.log(this.cameraList);
          }
          var constraints = {
            video: {
              deviceId: { exact: deviceId }
            }
          };
          var self = this;
          navigator.mediaDevices.getUserMedia(constraints).
          then(function (stream) {
            if (self.video) {
              self.video.srcObject = stream;
            }
          }).catch(function (error) {
            console.log('Error: ', error);
          });
          break;
          /* WebRTC */
        case wsCam:
          console.log("WebRTC:", this.camType);
          ConnectWebSocket(this.URL);
          break;
        case jpgCam:
          // http://192.168.43.201:9966/ok.png
          console.log("JPGCam:", this.camType);
          console.log("URL:", this.URL);
          break;
        case imgStreamCam:
          // http://192.168.43.201:9966/ok.png
          console.log("imgStreamCam:", this.camType);
          console.log("URL:", this.URL);
          break;
      }
    }

    getEle(eleOrId) {
      return typeof eleOrId === 'object' ?
        eleOrId : document.getElementById(eleOrId);
    }

    onImage(imageId_or_ele, callback) {
      var self = this;
      var image = this.getEle(imageId_or_ele);
      image.setAttribute("crossOrigin", 'Anonymous');
      var camSnapshotDelay = 0.5;
      var param = this.URL.indexOf("?");
      if (param > 0) {
        camSnapshotDelay = parseFloat(this.URL.substring(param + 1)) * 1000;
        this.URL = this.URL.substring(0, param);
      } else {
        camSnapshotDelay = camSnapshotDelay * 1000;
      }
      image.src = this.URL;
      image.onload = function () {
        setTimeout(function () {
          if (typeof callback == 'function') {
            callback(image);
          }
          image.src = self.URL + "?" + Math.random();
        }, camSnapshotDelay);
      }
    }

    onCanvas(eleOrId, callback) {
      var self = this;
      var canvas = self.getEle(eleOrId);
      this.buttonTrigger(canvas, function () {
        self.startCam();
        switch (self.camType) {
          case webCam:
          case wsCam:
            var video = self.createVideo();
            window.remoteVideo = self.video = video;
            video.onloadeddata = function () {
              var loop = function () {
                var ctx = canvas.getContext('2d');
                ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight,
                  0, 0, canvas.width, canvas.height);
                if (typeof callback == 'function') {
                  callback(canvas, video);
                }
                requestAnimationFrame(loop);
              }
              requestAnimationFrame(loop);
            }
            break;
          case jpgCam:
            var ele = document.createElement('img');
            //ele.width = canvas.width;
            //ele.height = canvas.height;
            self.onImage(ele, function (img) {
              var ctx = canvas.getContext('2d');
              //ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
              self.drawRotated(canvas, img, self.rotate);
              if (typeof callback == 'function') {
                callback(canvas);
              }
            });
            break;
          case imgStreamCam:
            var ele = document.createElement('img');
            ele.src = self.URL;
            ele.setAttribute("crossOrigin", 'Anonymous');
            ele.style.display = 'none';
            document.getElementsByTagName("body")[0].append(ele);
            var ctx = canvas.getContext('2d');
            var loop = function () {
              // ctx.drawImage(ele, 0, 0, ele.width, ele.height,0, 0, canvas.width, canvas.height);
              try {
                self.drawRotated(canvas, ele, self.rotate);
                if (typeof callback == 'function') {
                  callback(canvas);
                }
              } catch (e) { console.log("img err:", e) };
              requestAnimationFrame(loop);
            }
            requestAnimationFrame(loop);
            break;
        }
      });
      return this;
    }

    toVideo(eleOrId) {
      var self = this;
      window.remoteVideo = self.video = this.getEle(eleOrId);
      this.buttonTrigger(self.video, function () {
        self.startCam();
      });
    }

    createVideo() {
      var video = document.createElement('video');
      video.autoplay = true;
      return video;
    }

    drawRotated(canvas, image, degrees) {
      degrees = this.rotate ? 90 : 0;
      var context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.save();
      context.translate(canvas.width / 2, canvas.height / 2);
      context.rotate(degrees * Math.PI / 180);
      var w = (canvas.width - image.width) / 2;
      var h = (canvas.height - image.height) / 2;
      if (degrees != 0) {
        context.drawImage(image,
          (-image.height / 2) - h, (-image.width / 2) - w,
          canvas.height, canvas.width);
      } else {
        context.drawImage(image,
          (-image.width / 2) - w, (-image.height / 2) - h,
          canvas.width, canvas.height);
      }
      context.restore();
    }

    buttonTrigger(ele, callback) {
      if (this.camType != 0 && this.camType != jpgCam && this.camType != imgStreamCam) {
        var btn = document.createElement("BUTTON");
        btn.setAttribute("style", "background-color: #e0f0e0;position: fixed;z-index:2;top:5px;left:5px;font-size:96px");
        document.getElementsByTagName("body")[0].append(btn);
        var rect = ele.getBoundingClientRect();
        btn.style.top = rect.top;
        btn.style.left = rect.left;
        btn.style.width = rect.width;
        btn.style.height = rect.height;
        btn.innerHTML = "Start Camera";
        btn.addEventListener('click', function (e) {
          btn.parentNode.removeChild(btn);
          callback();
        });
      } else {
        callback();
      }
    }
  }

  return Camera;
})();