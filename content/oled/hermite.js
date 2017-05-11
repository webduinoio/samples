//Hermite resize - fast image resize/resample using Hermite filter.
//Version: 2.2
//Author: ViliusL
//https://github.com/viliusle/Hermite-resize
//http://viliusle.github.io/miniPaint/
function Hermite_class(){var a,c,b=[];this.init=function(){a=navigator.hardwareConcurrency||4}(),this.getCores=function(){return a},this.resample_auto=function(a,b,c,d,e){var f=this.getCores();window.Worker&&f>1?this.resample(a,b,c,d,e):(this.resample_single(a,b,c,!0),e())},this.resize_image=function(a,b,c,d,e){var f=document.getElementById(a),g=document.createElement("canvas");g.width=f.width,g.height=f.height;var h=g.getContext("2d");if(h.drawImage(f,0,0),void 0==b&&void 0==c&&void 0!=d&&(b=f.width/100*d,c=f.height/100*d),void 0==c){var i=f.width/b;c=f.height/i}b=Math.round(b),c=Math.round(c);var j=function(){var a=g.toDataURL();f.width=b,f.height=c,f.src=a,delete a,delete g};void 0==e||1==e?this.resample(g,b,c,!0,j):(this.resample_single(g,b,c,!0),j())},this.resample=function(d,e,f,g,h){var i=d.width,j=d.height;e=Math.round(e),f=Math.round(f);var k=j/f;if(b.length>0)for(var l=0;l<a;l++)void 0!=b[l]&&(b[l].terminate(),delete b[l]);b=new Array(a);for(var m=d.getContext("2d"),n=[],o=2*Math.ceil(j/a/2),p=-1,l=0;l<a;l++){var q=p+1;if(!(q>j)){p=q+o-1,p=Math.min(p,j-1);var r=o;r=Math.min(o,j-q),n[l]={},n[l].source=m.getImageData(0,q,i,o),n[l].target=!0,n[l].start_y=Math.ceil(q/k),n[l].height=r}}g===!0?(d.width=e,d.height=f):m.clearRect(0,0,i,j);for(var s=0,l=0;l<a;l++)if(void 0!=n[l].target){s++;var t=new Worker(c);b[l]=t,t.onmessage=function(a){s--;var c=a.data.core;delete b[c];var d=Math.ceil(n[c].height/k);n[c].target=m.createImageData(e,d),n[c].target.data.set(a.data.target),m.putImageData(n[c].target,0,n[c].start_y),s<=0&&h()};var u={width_source:i,height_source:n[l].height,width:e,height:Math.ceil(n[l].height/k),core:l,source:n[l].source.data.buffer};t.postMessage(u,[u.source])}},c=URL.createObjectURL(new Blob(["(",function(){onmessage=function(a){for(var b=a.data.core,c=a.data.width_source,d=a.data.height_source,e=a.data.width,f=a.data.height,g=c/e,h=d/f,i=Math.ceil(g/2),j=Math.ceil(h/2),k=new Uint8ClampedArray(a.data.source),m=(k.length/c/4,e*f*4),n=new ArrayBuffer(m),o=new Uint8ClampedArray(n,0,m),p=0;p<f;p++)for(var q=0;q<e;q++){var r=4*(q+p*e),s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=p*h,A=Math.floor(q*g),B=Math.ceil((q+1)*g),C=Math.floor(p*h),D=Math.ceil((p+1)*h);B=Math.min(B,c),D=Math.min(D,d);for(var E=C;E<D;E++)for(var F=Math.abs(z-E)/j,G=q*g,H=F*F,I=A;I<B;I++){var J=Math.abs(G-I)/i,K=Math.sqrt(H+J*J);if(!(K>=1)){s=2*K*K*K-3*K*K+1;var L=4*(I+E*c);y+=s*k[L+3],u+=s,k[L+3]<255&&(s=s*k[L+3]/250),v+=s*k[L],w+=s*k[L+1],x+=s*k[L+2],t+=s}}o[r]=v/t,o[r+1]=w/t,o[r+2]=x/t,o[r+3]=y/u}var M={core:b,target:o};postMessage(M,[o.buffer])}}.toString(),")()"],{type:"application/javascript"})),this.resample_single=function(a,b,c,d){var e=a.width,f=a.height;b=Math.round(b),c=Math.round(c);for(var g=e/b,h=f/c,i=Math.ceil(g/2),j=Math.ceil(h/2),k=a.getContext("2d"),l=k.getImageData(0,0,e,f),m=k.createImageData(b,c),n=l.data,o=m.data,p=0;p<c;p++)for(var q=0;q<b;q++){var r=4*(q+p*b),s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=p*h,A=Math.floor(q*g),B=Math.ceil((q+1)*g),C=Math.floor(p*h),D=Math.ceil((p+1)*h);B=Math.min(B,e),D=Math.min(D,f);for(var E=C;E<D;E++)for(var F=Math.abs(z-E)/j,G=q*g,H=F*F,I=A;I<B;I++){var J=Math.abs(G-I)/i,K=Math.sqrt(H+J*J);if(!(K>=1)){s=2*K*K*K-3*K*K+1;var L=4*(I+E*e);y+=s*n[L+3],u+=s,n[L+3]<255&&(s=s*n[L+3]/250),v+=s*n[L],w+=s*n[L+1],x+=s*n[L+2],t+=s}}o[r]=v/t,o[r+1]=w/t,o[r+2]=x/t,o[r+3]=y/u}d===!0?(a.width=b,a.height=c):k.clearRect(0,0,e,f),k.putImageData(m,0,0)}}