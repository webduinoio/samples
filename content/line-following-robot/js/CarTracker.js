+(function (factory) {
  if (typeof exports === 'undefined') {
    factory(webduino || {});
  } else {
    module.exports = factory;
  }
}(function (scope) {
  'use strict';
  var Module = scope.Module,
    BoardEvent = scope.BoardEvent,
    proto;
  /*
      var MIN_REPLAY_INTERVAL = 30,
          MIN_RESPONSE_TIME = 50,
          RETRY_INTERVAL = 5000;       
  */
  var CARTRACKER_MESSAGE = [0x04, 0x17];

  var ReplayEvent = {
    STATUS: 'status'
  };

  var CarTrackerEvent = {
    MESSAGE: 'message'
  };

  function CarTracker(board, slPin, smPin, srPin, mrfPin, mrbPin, mlfPin, mlbPin) {
    Module.call(this);
    this._board = board;
    this._slPin = !isNaN(slPin) ? board.getDigitalPin(slPin) : slPin;
    this._smPin = !isNaN(smPin) ? board.getDigitalPin(smPin) : smPin;
    this._srPin = !isNaN(srPin) ? board.getDigitalPin(srPin) : srPin;
    this._mlfPin = !isNaN(mlfPin) ? board.getDigitalPin(mlfPin) : mlfPin;
    this._mlbPin = !isNaN(mlbPin) ? board.getDigitalPin(mlbPin) : mlbPin;
    this._mrfPin = !isNaN(mrfPin) ? board.getDigitalPin(mrfPin) : mrfPin;
    this._mrbPin = !isNaN(mrbPin) ? board.getDigitalPin(mrbPin) : mrbPin;
    this._readTimer = null;
    this._init = false;
    this._nstatus = 0;
    this._status = 0;
    this._timeVal = 0;
    this._counter = 0;
    this._syncCounter = 0;
    this._tcallback = function () {};
    this._replayCallback = function () {};
    this._messageHandler = onMessage.bind(this);
    this._board.send([0xf0, 0x04, 0x17, 0x00,
      this._slPin._number, this._smPin._number, this._srPin._number, this._mlfPin._number, this._mlbPin._number, this._mrfPin._number, this._mrbPin._number, 0xf7
    ]);
    this._stepList = [];
    this._board.on(BoardEvent.SYSEX_MESSAGE, this._messageHandler);
  }

  function onMessage(event) {
    var msg = event.message;
    if (msg[0] == CARTRACKER_MESSAGE[0] && msg[1] == CARTRACKER_MESSAGE[1]) {
      if (msg[2] == 0x1a) {
        if (msg[3] == 2) {
          // console.log('onMessage1 : ', msg.slice(3));
          this.removeListener(CarTrackerEvent.MESSAGE, this._tcallback);
          this.removeListener(ReplayEvent.STATUS, this._replayCallback);
        } else {
          // console.log('onMessage2 : ',msg.slice(3));
          this.emit(ReplayEvent.STATUS, msg.slice(3));
        }
      } else {
        this.emit(CarTrackerEvent.MESSAGE, msg.slice(2));
      }

    }
  }

  CarTracker.prototype = proto = Object.create(Module.prototype, {
    constructor: {
      value: CarTracker
    },
    status: {
      get: function () {
        return this._status;
      }
    },
    state: {
      get: function () {
        return this._state;
      },
      set: function (val) {
        this._state = val;
      }
    }
  });

  proto.record = function (callback) {
    var self = this;
    this._board.send([0xf0, 0x4, 0x17, 0x01, 0xf7]);

    if (typeof callback !== 'function') {
      callback = function () {};
    }

    this._stepList.length = 0;

    this._tcallback = function (rawData) {
      var nstatus = rawData;
      var timeVal = '';

      self._nstatus = nstatus[0];

      for (var i = 0; i < rawData.length; i++) {
        timeVal += (rawData[i + 1] - 0x30);
      }

      self._timeVal = parseFloat(timeVal);

      this._stepList.push({ status: self._nstatus, timeval: self._timeVal });

      callback(self._nstatus, self._timeVal);
    };

    this._state = 'record';
    this.addListener(CarTrackerEvent.MESSAGE, this._tcallback);
  };

  proto.stop = function () {
    var self = this;

    this._state = 'stop';
    this._board.send([0xf0, 0x04, 0x17, 0x03, 0xf7]);

    if (this._replayTimer) {
      // console.log('stop timeout');
      clearTimeout(this._replayTimer);
      delete this._replayTimer;
    }

    self._counter = 0;
    self._syncCounter = 0;
  };

  proto.setSpeed = function (tire, speed) {
    var self = this;
    var sysexData = [];

    console.log('CarTracker.setSpeed : ', tire, speed);

    sysexData[0] = 0xf0;
    sysexData[1] = 0x4;
    sysexData[2] = 0x17;
    sysexData[3] = 0x5;

    sysexData[4] = tire;
    sysexData[5] = speed;

    sysexData[6] = 0xf7;

    self._board.send(sysexData);
  };

  proto.replay = function (stepList, callback) {
    var self = this;

    this._counter = 0;
    this._syncCounter = 0;

    this._state = 'replay';
    this._board.send([0xf0, 0x4, 0x17, 0x02, 0xf7]);

    // console.log('replay steps : ', stepList.length);

    if (typeof callback != 'function') {
      callback = function () {};
    }

    function timer() {
      // var j = 0;
      // var str;
      var sysexData = [];

      if (self._counter < stepList.length) {
        var strLen = 0;

        sysexData[0] = 0xf0;
        sysexData[1] = 0x4;
        sysexData[2] = 0x17;
        sysexData[3] = 0x4;

        while ((strLen + 3) < 59) {
          var n = 2;
          var status = parseInt(stepList[self._counter].status, 10);
          var ms = parseInt(stepList[self._counter].timeval, 10);
          var data = [0, 0, 0];

          data[0] = n << 3 | status;
          data[1] = ms & 127;
          data[2] = ms >> 7;

          sysexData[4 + (strLen++)] = data[0];
          sysexData[4 + (strLen++)] = data[1];
          sysexData[4 + (strLen++)] = data[2];

          self._counter++;

          if (self._counter >= stepList.length) {
            // j++;
            break;
          }
        }
        sysexData[4 + strLen] = 0xf7;
        // console.log('replay : ',sysexData);
        self._board.send(sysexData);
      }
    }

    self._replayCallback = function (rawData) {
      var tInterval;
      self._status = rawData;

      if (rawData == 0) {
        // console.log('Data ready .... ',this._syncCounter,' ~ ',self._counter-1);
        this._syncCounter = self._counter;
        tInterval = 30;
      } else if (rawData == 1 || rawData == 4) {
        // console.log('Replay over...', rawData);
        callback(self._status);
        self.stop();
        return;
      } else if (rawData > 2) { // rawData = 3 ~
        // console.log('buffer not ready ,retry...',this._syncCounter);
        self._counter = this._syncCounter;
        tInterval = 300;
      }

      callback(self._status);
      self._replayTimer = setTimeout(timer, tInterval);
    };

    self.addListener(ReplayEvent.STATUS, self._replayCallback);

    timer();
  };

  scope.module.CarTracker = CarTracker;
}));
