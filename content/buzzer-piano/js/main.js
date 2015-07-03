window.addEventListener('WebComponentsReady', function () {
  var setBtn = document.getElementById('set'),
    device = document.getElementById('device'),
    board = document.getElementById('board'),
      show = document.getElementById("show"),
      showTempo = document.getElementById("showtempo"),
      replay = document.getElementById("replay"),
      recode = document.getElementById("recode"),
      tempoInput = document.getElementById("num"),
      test = document.getElementById("test"),
      stop = document.getElementById("stop"),
      back = document.getElementById("delete"),
      body = document.querySelector('body'),
      b = document.querySelectorAll('button'),
      buzzerArray =[],
      tempoArray =[],
      music,
      a,ts,pt,pb,
      tempoNum=8,
      check=0;

            for(var i=0; i<b.length; i++){
    b[i].innerText = b[i].getAttribute('notes');
  }

  
  tempoNum = tempo.value;

  msg.className = "ready";
  device.setAttribute('value', localStorage.device || "");

  setBtn.addEventListener('click', function (e) {
    msg.className = "setting";

    board.device = device.value;
    board.on('ready', ready);
    board.init();

    localStorage.device = device.value;

    e.stopPropagation();
    e.preventDefault();
    return false;
  }, false);

  function ready() {
    var  buzzer = document.getElementById('buzzer');
    
    _buzzer(0);
    
    tempo.addEventListener('change',function(){
      tempoNum = tempo.value;
      tempoInput.innerText = tempoNum;
    });
    
    recode.addEventListener('click',function(){
      tempoArray =[];
      buzzerArray =[];
      recode.setAttribute('disabled','disabled');
      recode.className = 'disabled';
      stop.removeAttribute('disabled');
      stop.className = '';
      replay.setAttribute('disabled','disabled');
      replay.className = 'disabled';
      back.removeAttribute('disabled');
      back.className = '';
      test.removeAttribute('disabled');
      test.className = '';
      recode.innerText = '錄音進行中...';
      show.innerText= '';
      showTempo.innerText= '';
      _buzzer(1);  

    });
    
    back.addEventListener('click',function(){
      tempoArray.pop();
      pt = tempoArray.toString();
      buzzerArray.pop();
      pb = buzzerArray.toString();
      showTempo.innerText= pt;
      show.innerText= pb;
      buzzer.setAttribute('notes',buzzerArray);
      buzzer.setAttribute('tempos',tempoArray);
      console.log('back:'+buzzerArray);
    });
    
    stop.addEventListener('click',function(){
      recode.removeAttribute('disabled');
      recode.className = '';
      stop.setAttribute('disabled','disabled');
      stop.className = 'disabled';
      replay.removeAttribute('disabled');
      replay.className = '';
      back.setAttribute('disabled','disabled');
      back.className = 'disabled';
      test.setAttribute('disabled','disabled');
      test.className = 'disabled';
      recode.innerText = '重新記錄';
      _buzzer(0);
      console.log('stop:'+buzzerArray);
    });

    replay.addEventListener('click',function(){
      console.log('replay:'+buzzerArray);
      buzzer.setAttribute('notes',buzzerArray);
      buzzer.setAttribute('tempos',tempoArray);
      buzzer.play();
    });

    test.addEventListener('click',function(){
      console.log('replay:'+buzzerArray);
      buzzer.setAttribute('notes',buzzerArray);
      buzzer.setAttribute('tempos',tempoArray);
      buzzer.play();
    });
    
    function _buzzer(check){
      if(check===1){
        body.addEventListener('click',rr);
        body.removeEventListener('click',ss);
      }else{
        body.addEventListener('click',ss);
        body.removeEventListener('click',rr);
      }
    }
    
    function rr(e){
        if(e.target.tagName === 'BUTTON' && e.target.id!= 'replay'&& e.target.id!= 'set' && e.target.id!= 'recode' && e.target.id!= 'stop'&& e.target.id!= 'delete'&& e.target.id!= 'test'){
          a = e.target.getAttribute('notes');
          buzzer.setAttribute('notes',a);
          buzzer.setAttribute('tempos',tempoNum);
          buzzerArray.push(a);
          tempoArray.push(tempoNum);
          ts = tempoArray.toString();
          music = buzzerArray.toString();
          show.innerHTML= music;
          showTempo.innerHTML= ts;
          buzzer.play();  
        }
    }
    
    function ss(e){
        if(e.target.tagName === 'BUTTON' && e.target.id!= 'replay'&& e.target.id!= 'set' && e.target.id!= 'recode' && e.target.id!= 'stop'&& e.target.id!= 'delete'&& e.target.id!= 'test'){
          a = e.target.getAttribute('notes');
          buzzer.setAttribute('notes',a);
          buzzer.setAttribute('tempos',tempoNum);
          buzzer.play();
        }
    }
    
    msg.className = "set";
  };

}, false);
