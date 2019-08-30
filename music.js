// musicd.mplay({src:"musicUrl",pic:"picurl",title:"musictitle"})
(function(){var css=document.createElement("style");css.setAttribute("type","text/css");css.innerHTML=".musicd_demo{text-align: center;margin-top: 100px;}@-webkit-keyframes rotation{from{-webkit-transform: rotate(0deg);}to{-webkit-transform: rotate(360deg);}}.an{-webkit-transform: rotate(360deg);animation: rotation 12s linear infinite;-moz-animation: rotation 12s linear infinite;-webkit-animation: rotation 12s linear infinite;-o-animation: rotation 12s linear infinite;}.img{border-radius: 250px;}.play,.pause{padding: 0;outline:none;background-color: white;box-sizing: border-box;}.play{height: 48px;border-style: solid;border-width: 24px 0 24px 40px;border-color: transparent transparent transparent black;}.pause{width: 40px;height: 48px;border-style: double;border-width: 0px 0px 0px 40px;border-color: #202020;}";document.body.appendChild(css);
var div=document.createElement("div");div.innerHTML='<div style="left:0;bottom:0;width:100%;height:48px;position:fixed;background-color:#0E6"><div onclick="if(!musicd.d)document.getElementById(\'musicd_div1\').style.display=\'block\';"><img id="musicd_pic" src="data:image/gif;base64,R0lGODlhQABAAPAAAAAAAAAAACH5BAEAAAEALAAAAABAAEAAAALGjI+py+0PIZiUxotd3Tz7y4XdRybiOZYfylaqhy7xG4l1SD94tudKz0v5DEJSMXeEbYbEJdLpgz4tUSktuXIxA9ZS96p9YVVjUHj7DVK33LPRPUxj5GK4co22qyfsJv79F6c3N0hGZwbQ1xb4prjI51jFGAkISVlXeClRpqlz2NkABHrDOWoiaqqBmipjw+pZ+ur6GrpKe3ByW2ur+5h5Gwv8qRtMWyw7LPxLnGzcjLysPNlLXW1Nfcyanbpt2j36DRp+/VIAADs=" style="bottom:0;left:0;width:48px;height:auto;position:absolute;border:0;" alt="No picture"><div style="left:48px;right:40px;height:100%;width:auto;position:absolute;"><div id="musicd_title" style="width:100%;height:65%">Untitled</div><input type="range" id="musicd_range" style="bottom:0;left:1%;width:97%;height:35%;position:absolute;" value="0"></div></div><input type="button" style="bottom:0;right:0;position:absolute;" class="play" id="musicd_button" onclick="if(this.className==\'play\'){musicd.play()}else{musicd.pause()}"></div><div id="musicd_div1" style="left:0;top:0;bottom:48px;width:100%;height:auto;position:fixed;background:#656;display:none"><div style="top:0;right:0;height:32px;width:48px;position:absolute;font-size:120%;text-align:center;background-color:#06E;" onclick="document.getElementById(\'musicd_div1\').style.display=\'none\'">Back</div><div id="musicd_title1" style="top:0;left:0;right:48px;height:32px;width:auto;text-align:center;position:absolute;background:#EEF">Untitled</div><div class="musicd_demo"><img id="musicd_pic1" class="an img" src="1.jpg" width="90%" height="90%"/></div></div>';document.body.appendChild(div)})();
var musicd={"rangejs":"setTimeout('eval(musicd.rangejs)',500);if(!musicd.t&&musicd.m.src)musicd.range.value=Math.round(musicd.m.currentTime/musicd.m.duration*100);"};
musicd.range=document.getElementById("musicd_range");
musicd.m=new Audio();musicd.t=false;
musicd.play=function(){if(musicd.m.src){document.getElementById("musicd_button").className="pause";musicd.m.play()}}
musicd.pause=function(){document.getElementById("musicd_button").className="play";musicd.m.pause()}
musicd.mplay=function(d){if(d.pic){document.getElementById("musicd_pic").src=d.pic;document.getElementById("musicd_pic1").src=d.pic;}if(d.title){document.getElementById("musicd_title").innerHTML=d.title;document.getElementById("musicd_title1").innerHTML=d.title};musicd.m.src=d.src;musicd.m.currentTime=0;musicd.play();}
musicd.range.addEventListener("change",function(){musicd.t=true;musicd.m.currentTime=this.value/100*musicd.m.duration;});
musicd.m.onseeked=function(){musicd.t=false}
musicd.m.onended=function(){musicd.t.currentTime=0;musicd.pause()}
eval(musicd.rangejs);