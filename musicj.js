//API来自 https://120.79.36.48/
var GetF=function(url){var xmlhttp;if(window.XMLHttpRequest){xmlhttp=new XMLHttpRequest();}else{xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");}/*xmlhttp.onreadystatechange=function(){if(xmlhttp.readyState==4&&xmlhttp.status==200){value=xmlhttp.responseText;}};*/xmlhttp.open("GET",url,false);xmlhttp.send();if(xmlhttp.readyState==4&&xmlhttp.status==200){return xmlhttp.responseText}else{xmlhttp.status}}
function play(a){alert(a.id);
var data=GetF("http://120.79.36.48/song/detail?ids="+a.id);
data=JSON.parse(data);alert(JSON.stringify(data));
//if(!a.p)a.p="Api..........";
if(a.src){void(0)}else if(a.m){a.src=a.p+a.q}else{eval('a.src='+GetF('http://120.79.36.48/music/url?id='+a.id));a.src=a.src.url;}
var d={pic:data.songs[0].al.picUrl,title:data.songs[0].name,src:a.src};
if(a.func){a.func(d);}else{musicd.mplay(d);}
alert(JSON.stringify(d));}
alert(1);