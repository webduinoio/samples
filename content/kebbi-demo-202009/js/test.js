!async function () {
  const Nuwa = window.Nuwa;
  const sumikko = document.getElementById('sumikko');

  // MQTT
  const robotChannel = 'b4da8d/robot';
  const rfidChannel = 'b4da8d/rfid';
  let webduinoBroadcastor;
  if (!webduinoBroadcastor) {
    webduinoBroadcastor = new webduino.module.mqttClient();
    await webduinoBroadcastor.connect();
    console.log('mqtt ok');
  }

  // 接收 MQTT 訊息
  await webduinoBroadcastor.onMessage(robotChannel, async (msg) => {
    console.log(msg);
    switch (msg) {
      case 'd':
        lotteryFn();
        break;
      case 'e':
        sumikkoFn();
        break;
      default:
        break;
    }
  });

  function sendMQTT() {
    webduinoBroadcastor.send({
      topic: rfidChannel,
      message: ('ok').toString()
    });
  }

  function delay(sec) {
    return new Promise(resolve => {
      setTimeout(resolve, sec);
    });
  }

  // 計算大樂透號碼
  class genLottery {
    constructor() {
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
      };
    }
  }

  // 凱比幫忙算大樂透
  async function lotteryFn() {
    let a = new genLottery();
    a.cal();
    let msg = `我算出來的大樂透號碼是：${a.result.join('， ')}`
    console.log(msg);
    Nuwa.say('讓我來想想看喔');
    await Nuwa.syncMotionPlay("666_EM_Blush");
    Nuwa.say(msg);
    await Nuwa.syncMotionPlay("666_TA_DrawCircle");
    sendMQTT();
  }


  // 角落生物
  async function sumikkoFn() {
    sumikko.classList.add('run');
    sumikko.removeAttribute('hidden');
    await Nuwa.say('你是什麼類型的角落小夥伴呢？');

    let msg = {
      a1: [
        '白熊',
        '不單純只會讀書，只要找到自己的興趣並努力學習，往後一定會成為發光發熱的人們！'
      ],
      a2: [
        '企鵝',
        '有時會沒有自信，但是只要堅持下去一定會找到方向，最重要的東西其實一直在身邊哦！',
      ],
      a3: [
        '豬排屑',
        '生活中有時會遇到小小挫折，不過只要學習自我肯定，你就是那獨一無二的存在！'
      ],
      a4: [
        '恐龍',
        '雖然必須裝成蜥蜴混入角落生物中，卻很重視小夥伴們之間的感情，是個重情重義的人呢！'
      ],
      a5: [
        '貓咪',
        '很愛吃經常打瞌睡，生性害羞卻常常關照旁人的感受，心思相當細膩哦！'
      ]
    }
    let charactor = ~~(Math.random() * 5) + 1;
    sumikko.className = '';
    sumikko.classList.add(`a${charactor}`);
    let m1 = msg[`a${charactor}`][0];
    let m2 = msg[`a${charactor}`][1];
    console.log(`你是${m1}，${m2}`);
    Nuwa.say(`你是${m1}，${m2}`);
    sendMQTT();
  }

}();
