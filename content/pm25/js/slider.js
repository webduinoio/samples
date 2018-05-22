var btnNext1 = $('#btnNext1');
        var btnNext2 = $('#btnNext2');
        var pageBack = $('#pageBack');
        var pages = $('#pages');
        var pageA = $('#pageA');
        var pageB = $('#pageB');
        var pageC = $('#pageC');

        btnNext1.click(function(){
            pages.css({'-webkit-transform' : 'translate3d(-100%, 0px, 0px)' , '-webkit-transition' : '300ms'});
            pageA.css({'display' : 'none'});
            pageB.css({'display' : 'block'});
            pageC.css({'display' : 'none'});
        });

        btnNext2.click(function(){
            pages.css({'-webkit-transform' : 'translate3d(-200%, 0px, 0px)' , '-webkit-transition' : '300ms'});
            pageA.css({'display' : 'none'});
            pageB.css({'display' : 'none'});
            pageC.css({'display' : 'block'});
        });
        pageBack.click(function(){
            pages.css({'-webkit-transform' : 'translate3d(-100%, 0px, 0px)' , '-webkit-transition' : '300ms'});
            pageA.css({'display' : 'none'});
            pageB.css({'display' : 'block'});
            pageC.css({'display' : 'none'});
        });