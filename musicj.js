//API来自 https://github.com/messoer/
function GetF(url,func){var xmlhttp;if(window.XMLHttpRequest){xmlhttp=new XMLHttpRequest();}else{xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");}xmlhttp.onreadystatechange=function(){if(xmlhttp.readyState==4&&xmlhttp.status==200){var value=xmlhttp.responseText;func(value);}};xmlhttp.open("GET",url,true);xmlhttp.send();}
function play(a){
GetF("https://v1.itooi.cn/netease/song?id="+a.id,function(data){data=JSON.parse(data);/*alert(JSON.stringify(data));*/
if(!a.p)a.p="Api..........";
if(a.src){void(0)}else if(a.m){a.src=a.p+a.q}else{a.src="https://v1.itooi.cn/netease/url?id="+a.id+"&quality=128"}
var d={title:data.data.songs[0].al.name,pic:data.data.songs[0].al.picUrl,id:data.data.songs[0].al.id,src:a.src};
if(a.func){a.func(d);}else{musicd.mplay(d);}
/*alert(JSON.stringify(d));*/})}