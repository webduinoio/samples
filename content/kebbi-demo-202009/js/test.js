!async function () {
  const Nuwa = window.Nuwa;

  function lottery() {
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
      else{
        this.resultt = result.sort((x,y) => x - y);
      }
    }
  }

  let a = new lottery();
  a.cal();
  console.log(a.result);
  Nuwa.say(a.result.join(','));
}();
