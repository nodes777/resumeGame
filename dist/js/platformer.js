var platformer=function(){function t(){return window.performance&&window.performance.now?window.performance.now():(new Date).getTime()}function e(t,e,n){return Math.max(e,Math.min(n,t))}function i(t,e){var n=new XMLHttpRequest;n.onreadystatechange=function(){4==n.readyState&&200==n.status&&e(n)},n.open("GET",t,!0),n.send()}function c(t,e,n,i,c,d,a,r){return!(t+n-1<c||c+a-1<t||e+i-1<d||d+r-1<e)}function d(t){(t.classList.contains("hidden")||t.classList.contains("fadeOut"))&&(t.classList.remove("hidden"),t.classList.remove("fadeOut"),t.classList.add("fadeIn"))}function a(t){t.classList.contains("fadeIn")&&(t.classList.remove("fadeIn"),t.classList.add("fadeOut"))}function r(t,e){this.x=t,this.y=e,this.x_speed=Math.floor(10*Math.random()+1),this.y_speed=Math.floor(10*Math.random()+1),this.radius=5}function o(){for(var t=0;t<z.length;t++)z[t].render()}function l(){for(var t=0;t<z.length;t++)z[t].x+=z[t].x_speed,z[t].y+=z[t].y_speed,(z[t].x>q||z[t].y>D)&&z.splice(t,1)}function h(){if(z.length<100){var t=new r(100,200);z.push(t)}}function s(t,e,n){switch(e){case M.LEFT:return G.left=n,t.preventDefault(),!1;case M.RIGHT:return G.right=n,t.preventDefault(),!1;case M.SPACE:return G.jump=n,t.preventDefault(),!1}}function u(t){f(t),x(G),l()}function f(t){y(G,t)}function y(t,n){var i=t.dx<0,c=t.dx>0,d=t.falling,a=t.friction*(d?.5:1),r=t.accel*(d?.5:1);t.ddx=0,t.ddy=t.gravity,t.left?t.ddx=t.ddx-r:i&&(t.ddx=t.ddx+a),t.right?t.ddx=t.ddx+r:c&&(t.ddx=t.ddx-a),!t.jump||t.jumping||d||(t.ddy=t.ddy-t.impulse,t.jumping=!0),t.x=t.x+n*t.dx,t.y=t.y+n*t.dy,t.dx=e(t.dx+n*t.ddx,-t.maxdx,t.maxdx),t.dy=e(t.dy+n*t.ddy,-t.maxdy,t.maxdy),(i&&t.dx>0||c&&t.dx<0)&&(t.dx=0);var o=U(t.x),l=U(t.y),h=t.x%C,s=t.y%C,u=_(o,l),f=_(o+1,l),y=_(o,l+1),x=_(o+1,l+1);t.dy>0?(y&&!u||x&&!f&&h)&&(t.y=K(l),t.dy=0,t.falling=!1,t.jumping=!1,s=0):t.dy<0&&(u&&!y||f&&!x&&h)&&(t.y=K(l+1),t.dy=0,u=y,f=x,s=0),t.dx>0?(f&&!u||x&&!y&&s)&&(t.x=K(o),t.dx=0):t.dx<0&&(u&&!f||y&&!x&&s)&&(t.x=K(o+1),t.dx=0),t.falling=!(y||h&&x)}function x(t){for(n=0;n<S.length;n++)c(t.x,t.y,C,C,S[n].start.x,S[n].start.y,S[n].width,S[n].height)&&(d($[n]),4==n&&h()),c(t.x,t.y,C,C,S[n].start.x,S[n].start.y,S[n].width,S[n].height)||S[n].clicked!==!1||a($[n]),c(t.x,t.y,C,C,S[n].start.x,S[n].start.y,S[n].width,S[n].height)||S[n].clicked!==!0||d($[n])}function m(t,e,n){t.clearRect(0,0,q,D),w(S),g(t,n),o()}function p(t){var e,n,i;for(n=0;n<R.th;n++)for(e=0;e<R.tw;e++)i=_(e,n),i&&(t.fillStyle=Y[i-1],t.fillRect(e*C,n*C,C,C))}function g(t,e){t.fillStyle=T.BLUE,t.fillRect(G.x+G.dx*e,G.y+G.dy*e,C,C)}function w(t){for(n=0;n<t.length;n++)j.font="40px Titillium Web",j.fillStyle=T.YELLOW,j.fillText(t[n].display,t[n].start.x,t[n].start.y+t[n].height-20)}function k(){mapCache=document.getElementById("canvas2"),cachedContext=mapCache.getContext("2d"),mapCache.width=N.width,mapCache.height=N.height,p(cachedContext),j.drawImage(mapCache,0,0)}function v(t){var e,n,i,c=t.layers[0].data,d=t.layers[1].objects;for(e=0;e<d.length;e++)switch(n=d[e],i=L(n),n.type){case"player":G=i;break;case"platform":S.push(i)}for(e=0;e<S.length;e++)$.push(document.getElementById(S[e].id));console.log($),P=c;for(var a=4,r=3.2,o=2048/768,l=2048/896,h=2,s=0;s<S.length;s++)4!==s?et<=839||nt<=529?(S[s].clickX=S[s].x/a,S[s].clickY=S[s].y/a,S[s].clickWidth=S[s].width/a,S[s].clickHeight=S[s].height/a):et<=967||nt<=625?(S[s].clickX=S[s].x/r,S[s].clickY=S[s].y/r,S[s].clickWidth=S[s].width/r,S[s].clickHeight=S[s].height/r):et<=1095||nt<=721?(S[s].clickX=S[s].x/o,S[s].clickY=S[s].y/o,S[s].clickWidth=S[s].width/o,S[s].clickHeight=S[s].height/o):et<=1223||nt<=817?(S[s].clickX=S[s].x/l,S[s].clickY=S[s].y/l,S[s].clickWidth=S[s].width/l,S[s].clickHeight=S[s].height/l):(et>1223||nt>817)&&(S[s].clickX=S[s].x/h,S[s].clickY=S[s].y/h,S[s].clickWidth=S[s].width/h,S[s].clickHeight=S[s].height/h):(S[s].clickX=null,S[s].clickY=null,S[s].clickWidth=null,S[s].clickHeight=null)}function L(t){var e={};return e.name=t.name.charAt(0).toUpperCase()+t.name.slice(1),e.display=t.properties.display,e.id=t.properties.id,e.clicked=!1,e.x=t.x,e.y=t.y,e.width=t.width,e.height=t.height,e.dx=0,e.dy=0,e.gravity=W*(t.properties.gravity||A),e.maxdx=W*(t.properties.maxdx||B),e.maxdy=W*(t.properties.maxdy||H),e.impulse=W*(t.properties.impulse||I),e.accel=e.maxdx/(t.properties.accel||O),e.friction=e.maxdx/(t.properties.friction||F),e.player="player"==t.type,e.left=t.properties.left,e.right=t.properties.right,e.start={x:t.x,y:t.y},e}function E(){for(tt=t(),ct+=Math.min(1,(tt-dt)/1e3);ct>b;)ct-=b,u(b);m(j,it,ct),dt=tt,it++,requestAnimationFrame(E)}window.requestAnimationFrame||(window.requestAnimationFrame=window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(t,e){window.setTimeout(t,1e3/60)});var R={tw:64,th:48},C=32,W=C,A=9.8*6,B=15,H=60,O=.5,F=1/6,I=1500,T={BLACK:"#111111",YELLOW:"#fffd98",GREEN:"#40a000",LIGHTGREEN:"#80e000",BROWN:"#c06000",DARKBROWN:"#602000",BLUE:"#0006FF",GOLD:"gold"},Y=[T.YELLOW,T.GREEN,T.BLACK,T.BROWN,T.DARKBROWN],M={SPACE:32,LEFT:37,UP:38,RIGHT:39,DOWN:40},X=60,b=1/X,N=document.getElementById("canvas"),j=N.getContext("2d"),q=N.width=R.tw*C,D=N.height=R.th*C,G={},S=[],P=[],K=function(t){return t*C},U=function(t){return Math.floor(t/C)},_=function(t,e){return P[t+e*R.tw]},z=[],J={},Q=document.getElementById("canvas").getBoundingClientRect(),V=Q.top+document.body.scrollTop,Z=Q.left+document.body.scrollLeft,$=[];N.addEventListener("click",function(t){var e=t.pageX-Z,n=t.pageY-V;J.x=e,J.y=n;for(var i=4,c=0;c<S.length;c++)J.y>S[c].clickY&&J.y<S[c].clickY+S[c].clickHeight&&J.x>S[c].clickX&&J.x<S[c].clickX+S[c].clickWidth?(d($[c]),S[c].clicked=!0,S[i].clicked=!1,i=c):S[c].clicked=!1}),r.prototype.render=function(){j.beginPath(),j.arc(this.x,this.y,this.radius,2*Math.PI,!1),j.fillStyle="white",j.fill()};var tt,et=window.innerWidth,nt=window.innerHeight,it=0,ct=0,dt=t();document.addEventListener("keydown",function(t){return s(t,t.keyCode,!0)},!1),document.addEventListener("keyup",function(t){return s(t,t.keyCode,!1)},!1),i("js/taylorMap.json",function(t){v(JSON.parse(t.responseText)),k(),E(),touchFile(G)})};platformer(),console.log("Hmmm, maybe try changing the background color to gray \n");