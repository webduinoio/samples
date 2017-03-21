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
    this.prevPixel = 0;

    this.constantR = 250;
    this.constantD = 250;

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
    // this.degreeL = 0;
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

    this.cvs.addEventListener(this.start, function (e) {
      var touch = e;

      $('*').bind('touchmove', false);

      if (self.pad) {
        touch = e.touches[0];
      }
      var x = touch.clientX + window.scrollX - touch.target.offsetLeft;
      var y = touch.clientY + window.scrollY - touch.target.offsetTop;

      self.clear();

      self.getPoint(self.pixel, x, y);
      self.drawPoint(self.pixel);
      painted = true;
    });

    this.cvs.addEventListener(this.move, function (e) {
      if (painted) {
        var touch = e;

        $('*').bind('touchmove', false);

        if (self.pad) {
          touch = e.touches[0];
        }
        var x = touch.clientX + window.scrollX - touch.target.offsetLeft;
        var y = touch.clientY + window.scrollY - touch.target.offsetTop;

        self.getPoint(self.pixel, x, y);
        self.drawPoint(self.pixel);
      }
    });

    this.cvs.addEventListener(this.end, function () {
      painted = false;
      self.track(self.pixel);
      self.callback();
      $('*').unbind('touchmove');
    });
  };

  proto.clear = function () {
    this.cxt.clearRect(0, 0, this.cvs.width, this.cvs.height);

    this.pixel.length = 0;
    this.pixel = [];
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

  proto.drawPoint = function (_pixel) {

    var pixelA = _pixel.length - 2;
    var pixelB = _pixel.length - 1;

    this.cxt.beginPath();
    if (pixelA < 0) {
      this.cxt.moveTo(_pixel[0].x, _pixel[0].y);
      this.cxt.lineTo(_pixel[0].x, _pixel[0].y - 1);
    } else {
      this.cxt.moveTo(_pixel[pixelA].x, _pixel[pixelA].y);
      this.cxt.lineTo(_pixel[pixelB].x, _pixel[pixelB].y);
    }

    this.cxt.closePath();
    this.cxt.stroke();
  };

  proto.getPoint = function (_pixel, _x, _y) {
    _pixel.push({
      x: _x,
      y: _y
    });
  };

  proto.getStep = function (dstPixels, srcPixels, last, callback) {
    var degS = 0;
    var r = 0;
    var degreeN = 0.0;
    var x2, y2;

    var x1 = dstPixels[dstPixels.length - 1].x;
    var y1 = dstPixels[dstPixels.length - 1].y;

    if (last >= srcPixels.length) {
      x2 = srcPixels[srcPixels.length - 1].x;
      y2 = srcPixels[srcPixels.length - 1].y;
    } else {
      x2 = srcPixels[last].x;
      y2 = srcPixels[last].y;
    }

    console.log(last, x2, y2);

    if (typeof callback != 'function') {
      callback = function () {};
    }

    r = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));

    if (x1 == x2 && y1 == y2) {
      degreeN = 0;
    } else {
      degreeN = 180 + ((Math.atan2((x2 - x1), (y2 - y1)) / Math.atan(1)) * 45);
    }
    //    console.log(x1,y1,x2,y2,"deg :",this.degree,"degN :",degreeN.toFixed(2));

    degS = (360 - degreeN + this.degree) % 360;
    if (degS > 180) {
      degS = degS - 360;
    } else if (degS == 180) {
      degS = 0;
    }

    if ((degS != 0 && r > 10) || last >= srcPixels.length - 1) {
      this.degree = degreeN;
      callback();
    } else {
      //      console.log("OOOO:",x1,y1,x2,y2,"ral :",r.toFixed(2),"deg :",this.degreeL.toFixed(2));
    }
  };

  proto.stepConver = function (_stepPixels) {
    var x1, y1, x2, y2;
    var s, time;
    var r;
    var i;
    var degS = 0;
    var degree = 0;
    var degreeN = 0;
    var degL = 0;

    for (i = 0; i < _stepPixels.length - 1; i++) {
      x1 = _stepPixels[i].x;
      y1 = _stepPixels[i].y;

      x2 = _stepPixels[i + 1].x;
      y2 = _stepPixels[i + 1].y;

      r = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
      if (x1 == x2 && y1 == y2) {
        degreeN = 0;
      } else {
        degreeN = 180 + ((Math.atan2((x2 - x1), (y2 - y1)) / Math.atan(1)) * 45);
      }

      if (degree == 0) {
        degS = 0;
      } else {
        degS = (360 - degreeN + degree) % 360;
        if (degS > 180) {
          degS = degS - 360;
        } else if (degS == 180) {
          degS = 0;
        }
      }

      // console.log('stepConver :', degree.toFixed(2), degreeN.toFixed(2), degS.toFixed(2));

      degree = degreeN;

      // console.log('stepConver :', x1, y1, x2, y2, 'degL :', degL.toFixed(2), '(', degS.toFixed(2), ') ral :', r.toFixed(2));

      if (degS > 0) {
        s = 1;
      } else if (degS < 0) {
        s = 4;
      } else {
        s = 2;
      }

      time = parseInt((Math.abs(degS) * this.constantD) / 30);
      // console.log('stepConver :', s, time); //, parseInt(r * this.constantR * 50 / 360));

      if (s != 2) {
        this._stepList.push({
          status: s,
          timeval: parseInt(time)
        });
        // console.log('stepConver :', s, time);
      }

      this._stepList.push({
        status: 2,
        timeval: parseInt(r * this.constantR / 10)
      });
      // console.log('stepConver : 2', time);
      //console.log(this.constantD,this.constantR,s,time,parseInt(((this.constantR*30)/100) * r));

      degL = degS;
    }
  };

  proto.track = function (srcPixels) {
    var self = this;
    this.cxt.strokeStyle = '#000000';
    this._stepList = [];
    this._stepList.length = 0;
    var stepPixels = [];

    stepPixels.push(srcPixels[0]);
    // console.log('track : ', stepPixels.length, stepPixels[stepPixels.length - 1].x, stepPixels[stepPixels.length - 1].y);
    this.drawPointXY(srcPixels[0].x, srcPixels[0].y);

    for (var i = 0; i <= srcPixels.length; i++) {
      this.getStep(stepPixels, srcPixels, i, function () {
        stepPixels.push(srcPixels[i - 1]);
        // console.log('track : ', stepPixels.length, stepPixels[stepPixels.length - 1].x, stepPixels[stepPixels.length - 1].y);
        self.drawPointXY(stepPixels[stepPixels.length - 1].x, stepPixels[stepPixels.length - 1].y);
      });
    }

    //    this.drawPointXY(srcPixels[srcPixels.length-1].x, srcPixels[srcPixels.length-1].y);

    this.stepConver(stepPixels);

    this._stepList.push({
      status: 0,
      timeval: 0
    });
/*
    for (i = 0; i < this._stepList.length; i++) {
      console.log(this._stepList[i].status, this._stepList[i].timeval);
    }
*/
    this.cxt.strokeStyle = '#FF0000';
  };

  scope.module.DrawTrack = DrawTrack;
}));
