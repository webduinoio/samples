+(function (factory) {
  if (typeof exports === 'undefined') {
    factory(webduino || {});
  } else {
    module.exports = factory;
  }
}((scope) => {
  const { Module } = scope;
  const { EventEmitter } = scope;
  let self;
  let proto;

  Nuwa.Constants = {
    SENSOR_NONE: 0,
    SENSOR_TOUCH: 1,
    SENSOR_PIR: 2,
    SENSOR_DROP: 4,
    SENSOR_SYSTEM_ERROR: 8,
    SENSOR_RAW_TOUCH: 16,
    FOLLOW_START: 1,
    FOLLOW_UPDATE: 2,
    FOLLOW_STOP: 4,
    SLAM_ROUTE_MAP: 8,
    SLAM_GOTO_GO: 9,
    SLAM_GOTO_STOP: 10,
    CAMERA_NONE: 0,
    CAMERA_FACE_DETECTION: 1,
    CAMERA_FACE_RECOGNITION: 2,
    CAMERA_FACE_TRACK: 4,
    CAMERA_OBJ_RECOGNITION: 8,
    CAMERA_GESTURE_RECOGNITION: 16,
    HEAD: 1,
    CHEST: 2,
    RIGHT_HAND: 3,
    LEFT_HAND: 4,
  };

  /**
	 * Create a new Nuwa instance
	 * @class
	 */
  function Nuwa() {
    self = this;
    self.cameraType = Nuwa.Constants.CAMERA_NONE;
    mRobotAgent.nuwaRequestSensor(Nuwa.Constants.SENSOR_TOUCH | Nuwa.Constants.SENSOR_PIR);
    mRobotAgent.nuwaListenWakeUp();
    mRobotAgent.nuwaStartCamera(self.cameraType);
    mRobotAgent.nuwaStopCamera();
    mRobotAgent.nuwaStopTTS();
    self._horn;
    self._event = new EventEmitter();
    self._tap_part = null;
    self._longPress_part = null;
    self._touch_callback = {
      tap: {},
      longPress: {},
    };
    self._moveID = null;
    self._turnID = null;
  }

  Nuwa.prototype = proto = Object.create(Module.prototype, {
    constructor: {
      value: Nuwa,
    },
  });

  /**
	 * register touch event
	 * event
	 * 	- tap
	 * 	- longPress  (eye not support)
	 */
  mRobotAgent.onTouchEvent = function (event, body) {
    if (event === 'tap') {
      const tapCallback = self._touch_callback.tap[body];
      self._tap_part = body;
      self._event.emit(event, self._tap_part);
      tapCallback && tapCallback();
    }
    if (event === 'longPress') {
      const pressCallback = self._touch_callback.longPress[body];
      self._longPress_part = body;
      self._event.emit(event, self._longPress_part);
      pressCallback && pressCallback();
    }
  };
  proto.onTouch = function (event, callback) {
    if (typeof (callback) !== 'function') {
      callback = function () {};
    }
    self._event.addListener(event, callback);
  };

  proto.on = function (event, part, cb) {
    if (!event || !part || !cb) {
      throw new Error('Missing parameter. usage: `on(event, part, cb)`');
    }
    self._touch_callback[event][part] = cb;
  };

  /**
	 * register pir event
	 */
  mRobotAgent.onPIREvent = function (val) {
    if (val == 1) { self._event.emit('pir'); }
  };
  proto.onPIR = function (callback) {
    if (typeof (callback) !== 'function') {
      callback = function () {};
    }
    self._event.addListener('pir', callback);
  };

  /**
	 * register Camera event
	 * type
	 * 	- FaceRecognition
	 *  - ObjectRecognition
	 *  - GestureRecognition
	 * 	- FaceDetection
	 *  - FaceTrack
	 */
  mRobotAgent.onCameraEvent = function (event, argv1, argv2, argv3, argv4) {
    self._event.emit(event, argv1, argv2, argv3, argv4);
    if (event == 'FaceRecognition') {
      self._face_confidence = argv1;
      self._face_id = argv2;
      self._face_name = argv3;
    } else if (event == 'ObjectRecognition') {
      self._object_confidence = argv1;
      self._object_id = argv2;
      self._object_engName = argv3;
      self._object_chtName = argv4;
    } else if (event == 'GestureRecognition') {
      self._gesture_confidence = argv1;
      self._gesture_id = argv2;
      self._gesture_name = argv3;
    } else if (event == 'FaceDetection') {
      self._face_track_bottom = argv1;
      self._face_track_left = argv2;
      self._face_track_right = argv3;
      self._face_track_top = argv4;
    } else if (event == 'FaceTrack') {
      self._face_detected_height = argv1;
      self._face_detected_width = argv2;
      self._face_detected_x = argv3;
      self._face_detected_y = argv4;
    }
  };
  proto.onCamera = function (event, callback) {
    if (typeof (callback) !== 'function') {
      callback = function () {};
    }
    if (event == 'FaceRecognition') {
      self.cameraType |= Nuwa.Constants.CAMERA_FACE_RECOGNITION;
    } else if (event == 'ObjectRecognition') {
      self.cameraType |= Nuwa.Constants.CAMERA_OBJ_RECOGNITION;
    } else if (event == 'GestureRecognition') {
      self.cameraType |= Nuwa.Constants.CAMERA_GESTURE_RECOGNITION;
    } else if (event == 'FaceDetection') {
      self.cameraType |= Nuwa.Constants.CAMERA_FACE_DETECTION;
    } else if (event == 'FaceTrack') {
      self.cameraType |= Nuwa.Constants.CAMERA_FACE_TRACK;
    }
    mRobotAgent.nuwaStartCamera(self.cameraType);
    self._event.addListener(event, callback);
  };

 	// Action
  function map(x, in_min, in_max, out_min, out_max) {
    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
 	}

  function doAction(id, angle, speed, min, max, cvsMin, cvsMax) {
	 // limit value
	 if (angle > max) {
		 angle = max;
	 } else if (angle < min) {
		 angle = min;
	 }

	 // converse
	 const cvsAngle = map(angle, max, min, cvsMax, cvsMin);

	 // do
	 mRobotAgent.nuwaSetMotor(id, cvsAngle, 100/* speed */);
  }
  /*
		motorid:
		neck_y:1
		neck_z:2

		right_shoulder_z:3
		right_shoulder_y:4
		right_shoulder_x:5
		right_bow_y:6

		left_shoulder_z:7
		left_shoulder_y:8
		left_shoulder_x:9
		left_bow_y:10

		setPositionInDegree: target positon in degree
		setSpeedInDegreePerSec: speed in degree per sec (range: 0 ~ 200)
	*/

  proto.headUp = function (setPositionInDegree/* 0 ~ 20 */, setSpeedInDegreePerSec) {
    doAction(1, setPositionInDegree, setSpeedInDegreePerSec, 0, 20, 0, -20);
  };

  proto.headDown = function (setPositionInDegree/* 0 ~ 20 */, setSpeedInDegreePerSec) {
    doAction(1, setPositionInDegree, setSpeedInDegreePerSec, 0, 20, 0, 20);
  };

  proto.headLeft = function (setPositionInDegree/* 0 ~ 30 */, setSpeedInDegreePerSec) {
    doAction(2, setPositionInDegree, setSpeedInDegreePerSec, 0, 30, 0, 30);
  };

  proto.headRight = function (setPositionInDegree/* 0 ~ 30 */, setSpeedInDegreePerSec) {
    doAction(2, setPositionInDegree, setSpeedInDegreePerSec, 0, 30, 0, -30);
  };

  proto.rightShoulderInterTurn = function (setPositionInDegree/* 0 ~ 90 */, setSpeedInDegreePerSec) {
    doAction(3, setPositionInDegree, setSpeedInDegreePerSec, 0, 90, 5, -85);
  };

  proto.rightShoulderLiftUp = function (setPositionInDegree/* 0 ~ 255 */, setSpeedInDegreePerSec) {
    doAction(4, setPositionInDegree, setSpeedInDegreePerSec, 0, 255, 65, -190);
  };

  proto.rightShoulderSideLift = function (setPositionInDegree/* 0 ~ 90 */, setSpeedInDegreePerSec) {
    doAction(5, setPositionInDegree, setSpeedInDegreePerSec, 0, 90, 0, 90);
  };

  proto.rightElbowLiftUp = function (setPositionInDegree/* 0 ~ 75 */, setSpeedInDegreePerSec) {
    doAction(6, setPositionInDegree, setSpeedInDegreePerSec, 0, 75, 0, -75);
  };

  proto.leftShoulderInterTurn = function (setPositionInDegree/* 0 ~ 90 */, setSpeedInDegreePerSec) {
    doAction(7, setPositionInDegree, setSpeedInDegreePerSec, 0, 90, 5, -85);
  };

  proto.leftShoulderLiftUp = function (setPositionInDegree/* 0 ~ 255 */, setSpeedInDegreePerSec) {
    doAction(8, setPositionInDegree, setSpeedInDegreePerSec, 0, 255, 65, -190);
  };

  proto.leftShoulderSideLift = function (setPositionInDegree/* 0 ~ 90 */, setSpeedInDegreePerSec) {
    doAction(9, setPositionInDegree, setSpeedInDegreePerSec, 0, 90, 0, 90);
  };

  proto.leftElbowLiftUp = function (setPositionInDegree/* 0 ~ 75 */, setSpeedInDegreePerSec) {
    doAction(10, setPositionInDegree, setSpeedInDegreePerSec, 0, 75, 0, -75);
  };

  // move
  /**
	 * fast : 0.2 (meter/sec)
	 * medium : 0.15
	 * slow : 0.1
	 * forward: + , back: -
	 *
	 * fast : 30 (deg/sec)
	 * medium : 20
	 * slow : 10
	 * left: + , right: -
	 */

  proto.forward = function (speed, distance/* cm */) {
    if (speed > 0.2) {
      speed = 0.2;
    } else if (speed < 0) {
      speed = 0;
    }

    if (arguments.length == 1) {
      mRobotAgent.numaMove(speed);
    } else {
      if (self._moveID != null)	clearTimeout(self._moveID);
      if (distance < 0) distance = 0;
      return new Promise((resolve) => {
        const period = distance / (speed * 100);
        // console.log("time: " + period);
        mRobotAgent.numaMove(speed);
        setTimeout(() => {
          mRobotAgent.numaMove(0);
          resolve();
        }, period * 1000);
      });
    }
  };

  proto.back = function (speed, distance/* cm */) {
    if (speed > 0.2) {
      speed = -0.2;
    } else if (speed < 0) {
      speed = 0;
    } else {
      speed = -speed;
    }

    if (arguments.length == 1) {
      mRobotAgent.numaMove(speed);
    } else {
      if (self._moveID != null)	clearTimeout(self._moveID);
      if (distance < 0) distance = 0;
      return new Promise((resolve) => {
        const period = Math.abs(distance / (speed * 100));
        // console.log("time: " + period);
        mRobotAgent.numaMove(speed);
        setTimeout(() => {
          mRobotAgent.numaMove(0);
          resolve();
        }, period * 1000);
      });
    }
  };

  proto.stopMove = function () {
    if (self._moveID != null)	clearTimeout(self._moveID);
    mRobotAgent.numaMove(0);
  };

  proto.turnLeft = function (speed, angle) {
    if (speed > 30) {
      speed = 30;
    } else if (speed < 0) {
      speed = 0;
    }

    if (arguments.length == 1) {
      mRobotAgent.numwTurn(speed);
    } else {
      if (self._turnID != null)	clearTimeout(self._turnID);
      if (angle < 0) angle = 0;
      return new Promise((resolve) => {
        const period = angle / speed;
        // console.log("time: " + period);
        mRobotAgent.numwTurn(speed);
        self._timeoutID = setTimeout(() => {
          mRobotAgent.numwTurn(0);
          resolve();
        }, period * 1000);
      });
    }
  };

  proto.turnRight = function (speed, angle) {
    if (speed > 30) {
      speed = -30;
    } else if (speed < 0) {
      speed = 0;
    } else {
      speed = -speed;
    }
    if (arguments.length == 1) {
      mRobotAgent.numwTurn(speed);
    } else {
      if (self._turnID != null)	clearTimeout(self._turnID);
      if (angle < 0) angle = 0;
      return new Promise((resolve) => {
        const period = Math.abs(angle / speed);
        // console.log("time: " + period);
        mRobotAgent.numwTurn(speed);
        self._timeoutID = setTimeout(() => {
          mRobotAgent.numwTurn(0);
          resolve();
        }, period * 1000);
      });
    }
  };

  proto.stopTurn = function () {
    if (self._turnID != null)	clearTimeout(self._turnID);
    mRobotAgent.numwTurn(0);
  };

  // light
  /*
		id:0 = All
		id:1 = Face LED
		id:2 = Chest LED
		id:3 = Right hand LED
		id:4 = Left hand LED
		onOff: 0 or 1
		brightness, Color-R, Color-G, Color-B: 0 ~ 255
		interval: 0 ~ 15
		ratio: 0 ~ 15
	*/

  proto.setLedColor = function (id, colorHex) {
    hexToRgb(colorHex);
    const red = hexToRgb(colorHex).r;
    const green = hexToRgb(colorHex).g;
    const blue = hexToRgb(colorHex).b;
    if (id == 0) {
      for (let i = 1; i <= 4; i++) {
        mRobotAgent.nuwaSetLedColor(i, 255, red, green, blue);
      }
    } else {
      mRobotAgent.nuwaSetLedColor(id, 255, red, green, blue);
    }
  };

  proto.setLedBreath = function (id, colorHex, interval, ratio) {
    self.setLedColor(id, colorHex);
    if (id == 0) {
      for (let i = 1; i <= 4; i++) {
        mRobotAgent.nuwaSetLedBreath(i, interval, ratio);
      }
    } else {
      mRobotAgent.nuwaSetLedBreath(id, interval, ratio);
    }
  };

  proto.closeLed = function (id) {
    self.setLedColor(id, '#000000');
  };

  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    } : null;
  }

  // sense
  proto.requestSensor = function () {
    mRobotAgent.nuwaRequestSensor();
  };

  proto.stopSensor = function () {
    mRobotAgent.nuwaStopSensor();
  };

  // Wake Up
  mRobotAgent.onWakeup = function (score) {
    this.emit('wakeUp', score);
  };
  proto.onWakeUp = function (callback) {
    mRobotAgent.nuwaListenWakeUp(); // start wake up
    if (typeof (callback) !== 'function') { callback = function () {}; }
    self.addListener('wakeUp', callback);
  };

  proto.stopWakeUp = function () {
    mRobotAgent.nuwaStopListen();
  };

  // Camera
  proto.startCamera = function (requestModules) {
    mRobotAgent.nuwaStartCamera(requestModules);
  };

  proto.stopCamera = function () {
    mRobotAgent.nuwaStopCamera();
  };

  proto.takePicture = function () {
    mRobotAgent.nuwaTakePicture();
  };

  // Local TTS
  proto.say = function (msg) {
    return new Promise(async (resolve) => {
      setTimeout(() => {
        mRobotAgent.nuwaStopTTS();
        mRobotAgent.nuwaTTS(msg);
        mRobotAgent.onTTSComplete = resolve;
      }, 500);
    });
  };

  proto.shutUp = function () {
    mRobotAgent.nuwaStopTTS();
  };

  proto.isTTSBusy = function () {
    return mRobotAgent.nuwaIsTTSBusy();
  };

  mRobotAgent.onTTSComplete = function (isError) {
    self.emit('sayComplete', isError);
  };
  proto.sayComplete = function (callback) {
    if (typeof (callback) !== 'function') { callback = function () {}; }
    self.addListener('sayComplete', callback);
  };

  proto.playMusic = function (song) {
    if (typeof (self._horn) === 'undefined') {
      self._horn = new Audio(song);
    } else {
      self._horn.src = song;
    }
    self._horn.play();
  };

  proto.pauseMusic = function () {
    self._horn.pause();
  };

  // motion
  mRobotAgent.onCompleteOfMotionPlay = function (motionName) {
    self.emit(motionName, null);
  };

  proto.motionPlay = function (name) {
    mRobotAgent.nuwaMotionPlay(name, false);
  };

  proto.syncMotionPlay = function (name) {
    mRobotAgent.nuwaMotionPlay(name, false);
    return new Promise((resolve) => {
      self.removeAllListeners(name, resolve);
      self.addListener(name, resolve);
    });
  };

  proto.motionStop = function () {
    mRobotAgent.nuwaMotionStop(false);
  };

  proto.motionPause = function () {
    mRobotAgent.nuwaMotionPause();
  };

  proto.motionResume = function () {
    mRobotAgent.nuwaMotionResume();
  };

  proto.facePlay = (faceName, mute) => new Promise((resolve) => {
    const localMP4 = `media/kebbi-face/mp4/${faceName}.mp4`;
    const localPoster = `media/kebbi-face/poster/${faceName}.jpg`;
    const appMP4 = `http://android_asset/media/face/mp4/${faceName}.mp4`;
    const appPoster = `http://android_asset/media/face/poster/${faceName}.jpg`;
    let faceVideo;
    let everload = false;

    $('#bg').hide();
    $('#demoMonster01').hide();
    $('#demoMonster02').hide();
    $('#demoMonster03').hide();
    $('#demoMonster04').hide();
    if (!(faceVideo = document.getElementById('kebbi-face'))) {
      faceVideo = document.createElement('video');
      faceVideo.id = 'kebbi-face';
      document.body.appendChild(faceVideo);
    }
    faceVideo.autoplay = true;
    faceVideo.style.width = '1024px';
    faceVideo.style.height = '600px';
    faceVideo.style.objectFit = 'fill';
    faceVideo.src = appMP4;
    faceVideo.poster = appPoster;
    faceVideo.muted = mute;

    faceVideo.onerror = () => {
      if (!everload) {
        faceVideo.src = localMP4;
        faceVideo.poster = localPoster;
      }
      everload = true;
    };
    faceVideo.onended = () => {
      resolve();
    };
  });

  scope.module.Nuwa = Nuwa;
}));
