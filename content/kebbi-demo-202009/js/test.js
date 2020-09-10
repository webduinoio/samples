!async function () {
  const Nuwa = window.Nuwa;

  // MQTT
  const robotChannel = 'b4da8d/robot';
  const rfidChannel = 'b4da8d/rfid';
  let webduinoBroadcastor;
  if (!webduinoBroadcastor) {
    webduinoBroadcastor = new webduino.module.mqttClient();
    await webduinoBroadcastor.connect();
  }

  // 計算大樂透號碼
  function genLottery() {
    this.result = [];
    this.cal = function () {
      let num = ~~(Math.random() * 49) + 1;
      let result = this.result;
      if (!result.includes(num)) {
        this.result.push(num);
      }
      if (result.length < 6) {
        this.cal();
      }
      else {
        this.resultt = result.sort((x, y) => x - y);
      }
    }
  }

  async function lottery() {
    let a = new genLottery();
    a.cal();
    let msg = `我算出來的大樂透號碼是：${a.result.join('， ')}`
    console.log(msg);
    Nuwa.say('讓我來想想看喔');
    await Nuwa.syncMotionPlay("666_EM_Blush");
    Nuwa.say(msg);
    await Nuwa.syncMotionPlay("666_TA_DrawCircle");
    webduinoBroadcastor.send({
      topic: rfidChannel,
      message: ('ok').toString()
    });
  }



  await webduinoBroadcastor.onMessage(robotChannel, async (msg) => {
    switch (msg) {
      case 'd':
        lottery();
        break;
      default:
        break;
    }
  });

}();
