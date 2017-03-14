+(function (factory) {
  if (typeof exports === 'undefined') {
    factory(webduino || {});
  } else {
    module.exports = factory;
  }
}(function (scope) {
  'use strict';
  var Module = scope.Module,
    proto;
  // BoardEvent = scope.BoardEvent,
  // proto;

  function DrawTrack(canvasId) {
    Module.call(this);
    this.cvs = document.getElementById(canvasId);

    this.cxt = this.cvs.getContext('2d');
    this.cxt.lineJoin = 'round';
    this.cxt.lineWidth = 5;
    this.cxt.strokeStyle = '#FF0000';

    /*this.text = document.getElementById('demo-area-01-show');
    this.text.innerHTML = 'test';*/

    this.pixel = [];
    this.trackPixel = [];
    this.prevPixel = 0;

    this.constantR = 100;
    this.constantD = 100;

    this.pad = ('createTouch' in document);
    if (this.pad) {
      this.start = 'touchstart';
      this.move = 'touchmove';
      this.end = 'touchend';
    } else {
      this.start = 'mousedown';
      this.move = 'mousemove';
      this.end = 'mouseup';
    }
    this.degree = 0;
    this.degreeL = 0;
    this._stepList;
    this.callback = function () {};
  }

  DrawTrack.prototype = proto = Object.create(Module.prototype, {
    constructor: {
      value: DrawTrack
    },
    stepList: {
      get: function () {
        return this._stepList;
      }
    }
  });

  proto.drawCircle = function () {

    this.cxt.beginPath();
    this.cxt.strokeStyle = '#FF8040';
    this.cxt.arc(15, 15, 5, 0, 2 * Math.PI);
    this.cxt.closePath();
    this.cxt.stroke();
    this.cxt.fillStyle = '#A0F0A0';
    this.cxt.fill();
    this.cxt.strokeStyle = '#FF0000';
  };

  proto.on = function (callback) {
    var self = this;
    var painted = false;

    if (typeof callback != 'function') {
      callback = function () {};
    }

    this.callback = callback;

    // this.drawCircle();

    this.cvs.addEventListener(this.start, function (e) {
      var touch = e;

      if (self.pad) {
        touch = e.touches[0];
      }
      var x = touch.clientX - touch.target.offsetLeft;
      var y = touch.clientY - touch.target.offsetTop;

      self.clear();

      self.getPoint(x, y);
      self.drawPoint(true);
      painted = true;
    });

    this.cvs.addEventListener(this.move, function (e) {
      if (painted) {
        var touch = e;

        if (self.pad) {
          touch = e.touches[0];
        }
        var x = touch.clientX - touch.target.offsetLeft;
        var y = touch.clientY - touch.target.offsetTop;

        self.getPoint(x, y);
        self.drawPoint(true);
      }
    });

    this.cvs.addEventListener(this.end, function () {
      painted = false;
      self.pixel.length = 0;
      self.pixel = [];
      self.track();
      self.callback();
    });
  };

  proto.clear = function () {
    this.cxt.clearRect(0, 0, this.cvs.width, this.cvs.height);

    // this.drawCircle();

    this.pixel.length = 0;
    this.trackPixel.length = 0;
    this.pixel = [];
    this.trackPixel = [];
    this.degree = 0;
    this.degreeL = 0;
    this.arcSec = 0;
    this.prevPixel = 0;
  };

  proto.drawPointXY = function (x, y) {
    this.cxt.beginPath();
    this.cxt.moveTo(x, y);
    this.cxt.lineTo(x, y - 1);
    this.cxt.closePath();
    this.cxt.stroke();
  };

  proto.drawPoint = function (dragging) {

    var pixelA = this.pixel.length - 2;
    var pixelB = this.pixel.length - 1;

    this.cxt.beginPath();
    if (pixelA < 0) {
      this.cxt.moveTo(this.pixel[0].x, this.pixel[0].y);
      this.cxt.lineTo(this.pixel[0].x, this.pixel[0].y - 1);
    } else {
      if (dragging) {
        this.cxt.moveTo(this.pixel[pixelA].x, this.pixel[pixelA].y);
        this.cxt.lineTo(this.pixel[pixelB].x, this.pixel[pixelB].y);
      } else {
        // console.log(this.pixel[pixelB].x,this.pixel[pixelB].y);
        this.cxt.moveTo(this.pixel[pixelB].x, this.pixel[pixelB].y);
        this.cxt.lineTo(this.pixel[pixelB].x, this.pixel[pixelB].y - 1);
      }
    }

    this.cxt.closePath();
    this.cxt.stroke();
  };

  proto.getPoint = function (_x, _y) {
    this.pixel.push({
      x: _x,
      y: _y
    });
    this.trackPixel.push({
      x: _x,
      y: _y
    });
  };

  proto.getStep = function (last, callback) {

    var pixelA = this.pixel.length - 2;
    var pixelB = this.pixel.length - 1;

    var degS = 0;
    var r = 0;
    var degreeN = 0;

    if (typeof callback != 'function') {
      callback = function () {};
    }

    if (pixelA >= 0) {

      if (this.prevPixel == 0) {
        pixelA = 0;
      } else {
        pixelA = this.prevPixel;
      }

      // console.log(pixelB,pixelA);

      var x1 = this.pixel[pixelA].x;
      var y1 = this.pixel[pixelA].y;
      var x2 = this.pixel[pixelB].x;
      var y2 = this.pixel[pixelB].y;

      degreeN = 180 + ((Math.atan2((x2 - x1), (y2 - y1)) / Math.atan(1)) * 45);

      if (this.degree == 0) {
        degS = 0;
      } else {
        degS = (360 - degreeN + this.degree) % 360;
        if (degS > 180) {
          degS = degS - 360;
        }
      }

      this.degree = degreeN;

      r = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));

      if ((Math.abs(degS) > 0 || last == true) && r > 0) {

        // console.log(x1,y1,x2,y2,r.toFixed(2),this.degreeL.toFixed(2));

        var s, time;

        if (this.degreeL > 0) {
          s = 1;
        } else if (this.degreeL < 0) {
          s = 4;
        } else {
          s = 0;
        }

        time = parseInt(Math.abs(this.degreeL) * ((this.constantD * 7) / 100));
        if (s != 0) {
          this._stepList.push({
            status: s,
            timeval: parseInt(time)
          });
        }
        this._stepList.push({
          status: 2,
          timeval: parseInt(((this.constantR * 30) / 100) * r)
        });
        // console.log(this.constantD,this.constantR,s,time,parseInt(((this.constantR*30)/100) * r));

        this.degreeL = degS;
        this.prevPixel = pixelB;
        this.drawPointXY(x2, y2);
        callback();
        // } else {
      }
    } else {
      this.degree = 0;
      callback();
      this.drawPointXY(this.pixel[0].x, this.pixel[0].y);
    }
  };

  proto.track = function () {
    var self = this;
    this.cxt.strokeStyle = '#000000';
    this._stepList = [];
    this._stepList.length = 0;

    for (var i = 0; i < this.trackPixel.length; i++) {
      this.pixel.push(this.trackPixel[i]);

      this.getStep(false, function () {
        self.drawPoint(false);
      });
    }

    this.pixel.push(this.trackPixel[this.trackPixel.length - 1]);
    this.getStep(true, function () {
      self.drawPoint(false);
    });

    this._stepList.push({
      status: 0,
      timeval: 0
    });

    this.cxt.strokeStyle = '#FF0000';
  };

  scope.module.DrawTrack = DrawTrack;
}));
