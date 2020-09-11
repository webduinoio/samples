!async function () {
  const Nuwa = window.Nuwa;
  const lottery = document.getElementById('lottery');
  const sumikko = document.getElementById('sumikko');
  const pokemon = document.getElementById('pokemon');
  const disney = document.getElementById('disney');
  const lucky = document.getElementById('lucky');
  const lotteryBall = document.querySelectorAll('#lottery b');

  // 角落生物
  const sumikkoMsg = {
    a1: [
      '你是白熊',
      '不單純只會讀書，只要找到自己的興趣並努力學習，往後一定會成為發光發熱的人們！'
    ],
    a2: [
      '你是企鵝',
      '有時會沒有自信，但是只要堅持下去一定會找到方向，最重要的東西其實一直在身邊哦！',
    ],
    a3: [
      '你是豬排屑',
      '生活中有時會遇到小小挫折，不過只要學習自我肯定，你就是那獨一無二的存在！'
    ],
    a4: [
      '你是恐龍',
      '雖然必須裝成蜥蜴混入角落生物中，卻很重視小夥伴們之間的感情，是個重情重義的人呢！'
    ],
    a5: [
      '你是貓咪',
      '很愛吃經常打瞌睡，生性害羞卻常常關照旁人的感受，心思相當細膩哦！'
    ]
  };

  // 寶可夢
  const pokemonMsg = {
    a1: [
      '你是皮卡丘',
      '總是為團隊帶來活力，是個適合團體合作的人。'
    ],
    a2: [
      '你是卡比獸',
      '喜歡按自己的節奏做事。大多時間喜歡睡覺。',
    ],
    a3: [
      '你是鯉魚王',
      '雖然大器晚成，但總有一天會變成一個厲害的角色。'
    ],
    a4: [
      '你是小火龍',
      '內心充滿著熱情與活力，希望別人也都能跟你一樣。'
    ],
    a5: [
      '你是可達鴨',
      '你有意識到自己多有才華嗎？雖然可能讓你頭疼，但再多想一下吧！'
    ]
  }

  // 迪士尼
  const disneyMsg = {
    a1: [
      '你是樂佩公主，',
      '開朗活潑、身手矯捷，就算面對未知的新挑戰也能樂觀面對一切。'
    ],
    a2: [
      '你是安娜公主',
      '心地善良，擁有一顆明亮潔淨又單純的心，有著可以照亮他人的個性。',
    ],
    a3: [
      '你是茉莉公主',
      '有點叛逆但勇敢冒險無所畏懼，追求事物的本質並尋求自己所信仰的幸福。'
    ],
    a4: [
      '你是貝兒公主',
      '善良、聰明和堅韌，懂得去珍惜自己的想法與價值觀，而不會輕易被他人的觀點所迷惑。'
    ],
    a5: [
      '你是仙度瑞拉公主',
      '不但勤勞善良，也十分樂觀！總能輕鬆看待所有不如意的事。有著堅定不移的信念什麼困難都可以克服！'
    ]
  }

  // 運勢
  const luckyMsg = {
    a1: [
      '你的運勢大吉',
      '趕快去買大樂透吧！好運擋不住！'
    ],
    a2: [
      '你的運勢中吉',
      '運氣滿好的喔！',
    ],
    a3: [
      '你的運勢小吉',
      '每天都有一點小確幸，很棒喔！'
    ],
    a4: [
      '你的運勢平吉',
      '平平淡淡就是福氣！'
    ],
    a5: [
      '你的運勢凶',
      '應該是表情太兇，笑瞇瞇的再卜卦一次吧！'
    ]
  }

  // 凱比動作
  const kebbiMotion1 = [
    '666_DA_Washhair',
    '666_DA_Wear',
    '666_SP_Cheer',
    '666_LE_ListenSong'
  ];
  const kebbiMotion2 = [
    '666_DA_Hit',
    '666_DA_Drink',
    '666_DA_Bathe',
    '666_SP_HorizontalBar',
    '666_SP_Chest',
    '666_TA_Roar',
    '666_TA_TalkY'
  ];

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
    Nuwa.shutUp();     // 凱比靜音
    Nuwa.motionStop(); // 凱比停止動作
    switch (msg) {
      case 'd':
        lotteryFn();
        break;
      case 'e':
        run(sumikko, sumikkoMsg, '你是哪一種角落生物呢？');
        break;
      case 'f':
        run(pokemon, pokemonMsg, '你是哪一種寶可夢呢？');
        break;
      case 'g':
        run(disney, disneyMsg, '你是哪一種公主呢？');
        break;
      case 'h':
        run(lucky, luckyMsg, '你的運勢如何呢？');
        break;
      default:
        divHidden();
        break;
    }
  });

  // 發送 MQTT 訊息
  function sendMQTT() {
    webduinoBroadcastor.send({
      topic: rfidChannel,
      message: ('ok').toString()
    });
  }

  // delay
  function delay(sec) {
    return new Promise(resolve => {
      setTimeout(resolve, sec);
    });
  }

  // 隱藏 div
  function divHidden() {
    let img5 = document.querySelectorAll('div[img5]');
    lottery.setAttribute('hidden', '');
    img5.forEach(e => {
      e.setAttribute('hidden', '');
    });
  }

  // 隨機數
  function random(length) {
    return (~~Math.random() * length + 1);
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
    lotteryBall.forEach((e, i) => {
      console.log(a.result[i]);
      e.innerText = a.result[i];
    });
    let msg = `我算出來的大樂透號碼是：${a.result.join('， ')}`;
    console.log(msg);
    lottery.className = '';
    lottery.classList.add('run');
    lottery.removeAttribute('hidden');
    Nuwa.say('讓我來預測看看這次的大樂透');
    await Nuwa.syncMotionPlay(kebbiMotion1[random(kebbiMotion1.length)]);
    await delay(2000);
    lottery.className = '';
    lottery.classList.add('result');
    Nuwa.say(msg);
    Nuwa.syncMotionPlay(kebbiMotion2[random(kebbiMotion2.length)]);
    sendMQTT();
  }

  // 四種卡牌算命
  async function run(ele, msg, text) {
    divHidden();
    ele.className = '';
    ele.classList.add('run');
    ele.removeAttribute('hidden');
    console.log(text);
    Nuwa.say(text);
    await Nuwa.syncMotionPlay(kebbiMotion1[random(kebbiMotion1.length)]);
    await delay(2000);
    let charactor = ~~(Math.random() * 5) + 1;
    ele.className = '';
    ele.classList.add(`a${charactor}`);
    let m1 = msg[`a${charactor}`][0];
    let m2 = msg[`a${charactor}`][1];
    console.log(`${m1}，${m2}`);
    Nuwa.say(`${m1}，${m2}`);
    Nuwa.syncMotionPlay(kebbiMotion2[random(kebbiMotion2.length)]);
    sendMQTT();
  }

}();
