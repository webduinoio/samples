!async function () {
  console.log(window.Nuwa);
  //window.Nuwa.say('測試一下');

  function lottery() {
    let result = [];
    for (let i = 0; i < 6; i++) {
      let num = ~~(Math.random() * 49);
      if (!result.includes(num)) {
        result.push(num);
      }
    }
    return result.sort((x, y) => x - y);
  }
  window.Nuwa.say(lottery());
}();
