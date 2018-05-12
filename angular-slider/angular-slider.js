(function(){var n,t,e,a,r,o,s,l,u,i,c,p,f,d,v,h,g;n="uiSlider",t="slider",e=function(n){return angular.element(n)},p=function(n){return""+n+"px"},s=function(n){return n.css({opacity:0})},v=function(n){return n.css({opacity:1})},i=function(n,t){return n.css({left:t})},o=function(n){return n[0].offsetWidth/2},c=function(n){return n[0].offsetLeft},g=function(n){return n[0].offsetWidth},r=function(n,t){return c(t)-c(n)-g(n)},a=function(n,t){return n.attr("ng-bind-html-unsafe",t)},d=function(n,t,e,a){var r,o,s,l;return null==a&&(a=0),null==e&&(e=1/Math.pow(10,t)),o=(n-a)%e,l=o>e/2?n+e-o:n-o,r=Math.pow(10,t),s=l*r/r,s.toFixed(t)},l={mouse:{start:"mousedown",move:"mousemove",end:"mouseup"},touch:{start:"touchstart",move:"touchmove",end:"touchend"}},h=function(n){return{restrict:"EA",scope:{floor:"@",ceiling:"@",step:"@",precision:"@",ngModel:"=?",ngModelLow:"=?",ngModelHigh:"=?",translate:"&"},template:'<span class="bar"></span><span class="bar selection"></span><span class="pointer"></span><span class="pointer"></span><span class="bubble selection"></span><span ng-bind-html-unsafe="translate({value: floor})" class="bubble limit"></span><span ng-bind-html-unsafe="translate({value: ceiling})" class="bubble limit"></span><span class="bubble"></span><span class="bubble"></span><span class="bubble"></span>',compile:function(t,u){var f,h,m,b,M,w,F,C,L,x,$,y,H,I,E,R,W,X,z;if(u.translate&&u.$set("translate",""+u.translate+"(value)"),x=null==u.ngModel&&null!=u.ngModelLow&&null!=u.ngModelHigh,X=function(){var n,a,r,o;for(r=t.children(),o=[],n=0,a=r.length;a>n;n++)m=r[n],o.push(e(m));return o}(),M=X[0],H=X[1],L=X[2],C=X[3],I=X[4],b=X[5],f=X[6],F=X[7],w=X[8],h=X[9],y=x?"ngModelLow":"ngModel",$="ngModelHigh",a(I,"'Range: ' + translate({value: diff})"),a(F,"translate({value: "+y+"})"),a(w,"translate({value: "+$+"})"),a(h,"translate({value: "+y+"}) + ' - ' + translate({value: "+$+"})"),!x)for(z=[H,C,I,w,h],R=0,W=z.length;W>R;R++)t=z[R],t.remove();return E=[y,"floor","ceiling"],x&&E.push($),{post:function(t,a,u){var m,R,W,X,z,A,B,D,P,S,j,k,q,G,J;for(R=!1,D=e(document),u.translate||(t.translate=function(n){return n.value}),S=m=A=X=B=z=k=P=void 0,W=function(){var n,e,a,r,s;for(null==(r=t.precision)&&(t.precision=0),null==(s=t.step)&&(t.step=1),e=0,a=E.length;a>e;e++)n=E[e],t[n]=d(parseFloat(t[n]),parseInt(t.precision),parseFloat(t.step),parseFloat(t.floor));return t.diff=d(t[$]-t[y],parseInt(t.precision),parseFloat(t.step),parseFloat(t.floor)),S=o(L),m=g(M),A=0,X=m-g(L),B=parseFloat(u.floor),z=parseFloat(u.ceiling),k=z-B,P=X-A},j=function(){var n,e,u,M,E,z,j,q;return W(),M=function(n){return 100*((n-A)/P)},z=function(n){return 100*((n-B)/k)},E=function(n){return p(n*P/100)},u=function(n){return i(n,p(Math.min(Math.max(0,c(n)),m-g(n))))},q=function(){var n,e;return i(f,p(m-g(f))),e=z(t[y]),i(L,E(e)),i(F,p(c(L)-o(F)+S)),x?(n=z(t[$]),i(C,E(n)),i(w,p(c(C)-o(w)+S)),i(H,p(c(L)+S)),H.css({width:E(n-e)}),i(I,p(c(H)+o(H)-o(I))),i(h,p(c(H)+o(H)-o(h)))):void 0},n=function(){var n;return u(F),n=w,x&&(u(w),u(I),10>r(F,w)?(s(F),s(w),u(h),v(h),n=h):(v(F),v(w),s(h),n=w)),5>r(b,F)?s(b):x?5>r(b,n)?s(b):v(b):v(b),5>r(F,f)?s(f):x?5>r(n,f)?s(f):v(f):v(f)},e=function(n,e,r){var o,s,l;return o=function(){return n.removeClass("active"),D.unbind(r.move),D.unbind(r.end)},s=function(n){var r,o,s,l;return r=n.clientX||n.touches[0].clientX,o=r-a[0].getBoundingClientRect().left-S,o=Math.max(Math.min(o,X),A),s=M(o),l=B+k*s/100,x&&(e===y?l>t[$]&&(e=$,L.removeClass("active"),C.addClass("active")):t[y]>l&&(e=y,C.removeClass("active"),L.addClass("active"))),l=d(l,parseInt(t.precision),parseFloat(t.step),parseFloat(t.floor)),t[e]=l,t.$apply()},l=function(t){return n.addClass("active"),W(),t.stopPropagation(),t.preventDefault(),D.bind(r.move,s),D.bind(r.end,o)},n.bind(r.start,l)},j=function(){var n,t,a,r,o,s;for(R=!0,n=function(n){return e(L,y,l[n]),e(C,$,l[n])},o=["touch","mouse"],s=[],a=0,r=o.length;r>a;a++)t=o[a],s.push(n(t));return s},q(),n(),R?void 0:j()},n(j),G=0,J=E.length;J>G;G++)q=E[G],t.$watch(q,j);return window.addEventListener("resize",j)}}}}},f=["$timeout",h],u=function(e,a){return a.module(n,[]).directive(t,f)},u(window,window.angular)}).call(this);