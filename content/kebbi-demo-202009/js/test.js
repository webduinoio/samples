!async function () {
  const Nuwa = window.Nuwa;

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
    Nuwa.facePlay('001_P5_Pendulum', true);
    Nuwa.say('讓我來想想看喔');
    await Nuwa.syncMotionPlay("666_EM_Blush");
    Nuwa.say(msg);
    Nuwa.facePlay('001_J2_GMFive_B1', true);
    await Nuwa.syncMotionPlay("666_TA_DrawCircle");
  }

  lottery();
}();
