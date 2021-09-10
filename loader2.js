var loader={
	"init":function(Element=document.body)
	{
		//loadjs
		loader.defaultObj.parentNode=Element;
	},
	"g":function()// 寻找子元素
	{
		// get_child_element_array
		var arr=[];
		let len=arguments.length;
		var result;
		if(len===0||!arguments[0])
			return;
		for(var c of arguments[0].childNodes)
		{
			if(c.tagName)
				arr.push(c);
		}
		if(arguments.length===2)
			return arr[arguments[1]];
		else // >2
		{
			result=arr[0];
			for(let i=2;i<len&&result;i++)
				result=loader.g(result,arguments[i]);
			return result;
		}
		return arr;// =1
	},
	"void":function()
	{
	},
	"CreateElement":function(tag=null,attribute=null,innerHTML=null,parentNode=null,e1=null,e2=null)
	{
		if(tag==null)
			return null;
		var c=document.createElement(tag);
		if(typeof attribute=="object"&&attribute!==null)
			for(var a in attribute)
				c.setAttribute(a,attribute[a]);
		if(innerHTML!==null)
			c.innerHTML=innerHTML;
		if(typeof e1==="function")
			e1(c,e2);
		if(parentNode===null)
			parentNode=document.body;
		parentNode.appendChild(c);
		if(typeof e2==="function")
			return e2(c,e1)||c;
		return c;
	},
	"loadjs":function(src,onload=loader.void)
	{
		return loader.CreateElement("script",{"src":src,"type":"text/javascript"},null,null,function(c,o){c.onload=o;},onload);
	},
	"loadcss":function(href,onload=loader.void)
	{
		return loader.CreateElement("link",{"type":"text/css","rel":"stylesheet","href":href},null,document.getElementsByTagName("head")[0],null,null,function(c,o){c.onload=o;},onload);
	},
	"loadcsstext":function(text)
	{
		return loader.CreateElement("style",{"type":"text/css","rel":"stylesheet"},null,document.getElementsByTagName("head")[0],function(c,text){
			try{
				c.appendChild(document.createTextNode(text));
			}catch(e){
				c.styleSheet.cssText=text;// IE
		}
		},text);
	},
	"download":function(value,file,url=false)
	{
		var c;
		if(!value||!file)
			return;
		var href=(url===true)?value:"data:text/plain;charset=utf-8,"+encodeURIComponent(value);
		c=loader.CreateElement("a",{"download":file,"style":"display: none;","href":href});
		c.click();
		document.body.removeChild(c);
	},
	"copy":function(text){
		var c=loader.CreateElement("input",{"value":text});
		c.select();
		document.execCommand("copy"); 
		document.body.removeChild(c);
	},
	"a2":function(a,temp,less=false)
	{
		// 复制 & 合并
		if(a===null||a===undefined)
			return a;
		if(Array.isArray(a))
		{
			temp=temp||[];
			for(let t in a)
			{
				if(less===true&&temp[t]===undefined)
					continue;
				temp.push(loader.a2(a[t]));
			}
		}
		else if(typeof a==="object")
		{
			temp=temp||{};
			if(a.nodeType)
				return a;
			for(var t in a)
			{
				if(less===true&&temp[t]===undefined)
					continue;
				temp[t]=loader.a2(a[t],(typeof temp[t]==="object")?temp[t]:null);
			}
		}
		else return a;// 
		return temp;
	},
	"a":function()
	{
		// 专用 复制 合并 函数
		var temp={};
		for(var t of arguments)
		{
			if(t===undefined)
				continue;
			if(Array.isArray(t))
			{
				for(var x of t)
					loader.a2(x,temp);
			}
			else
				loader.a2(t,temp);
		}
		return temp;
	},
	"cat_":function(obj,arr)
	{
		var str="";
		if(!Array.isArray(arr))
			return arr;
		for(let t of arr)
		{
			if(Array.isArray(t))
			{
				if(t[0]!==undefined)
				{
					if(t.length!==1)
						str+=loader.cat_(obj,t);
					else
					if(obj[t[0]]!==undefined)
						str+=obj[t[0]];
					else
						return "";
				}
				else
					return "";
			}
			else
				str+=t;
		}
		return str;
	},
	"cat":function(obj)
	{
		let temp={};
		let val;
		var str;
		if(obj.attribute!==undefined)
		{
			attr=obj.attribute;
			for(var a in attr)
			{
				str=loader.cat_(obj,attr[a]);
				if(str!=="")
					temp[a]=str;
			}
		}
		val=obj.v||obj.value||obj.innerHTML||null;
		if(val!==null)
			val=loader.cat_(obj,val);
		return loader.CreateElement(obj.tag,temp,val,obj.parentNode);
	},
	"prev_arr":function(arr,prev=null,pushArr=null)
	{
		//if(Array.isArray(arr))
		//{
			for(let t of arr)
			{
				t.prev=prev;
				prev=t;
				if(pushArr!==null)
					pushArr.push(t);
			}
		//}
		//else arr.prev=prev;
	},
	"waitload":function()
	{
		setTimeout(loader.load,((loader.queue.length>0)?loader.queue[0].delay:0));
	},
	"getType":function(obj,arr=[])
	{
		var t;
		if(typeof obj.type!=="string"||!loader.types[obj.type])
			return null;
		t=loader.types[obj.type];
		if(obj.type!=t.type)
			loader.getType(t,arr);
		arr.push(t);
		return arr;
	},
	"load":function(obj=loader.queue[0],copy=false)
	{
		var result;
		var arr;
		var temp;
		let t;
		const ig=["child","next","tag","attribute","type","v","value","innerHTML"];
		if(copy===true)
			return loader.load(loader.a2(obj));
		if(obj!==loader.queue[0])
		{
			if(Array.isArray(obj))
				loader.prev_arr(obj,null,loader.queue);
			else
				loader.queue.push(obj);
			if(loader.run===true)
				return null;
		}
		loader.run=true;
		obj=loader.queue.shift();
		if(obj===undefined||obj===null)
		{
			loader.run=false;
			return null;
		}
		if(typeof obj.loadType==="object"&&obj!==null)
		{
			loader.loadType(obj.loadType);
			obj.loadType=null;
		}
		if(obj.prev!==null&&obj.prev!==undefined)
		{
			for(t in obj.prev)
			{
				if(obj[t]===undefined)
					obj[t]=obj.prev[t];
			}
		}
		for(t of ig)
		{
			if(obj[t]===null)
				delete obj[t];
		}
		obj.prev=null;
		temp=loader.a(loader.defaultObj,loader.getType(obj),obj);
		delete obj.next;
		delete obj.child;
		delete obj.attribute;
		if(typeof temp.exec==="function")
			result=temp.exec(temp);
		arr=[];
		if(Array.isArray(result))
			loader.prev_arr(result,obj,arr);
		// temp.child=(Array.isArray(temp.child))?temp.child:[temp.child]; // bug
		t=temp.child;
		if(t!==null&&!Array.isArray(t))
			temp.child=[t];
		if(Array.isArray(temp.child)&&temp.child.length>0)
		{
			t=temp.child[0];
			if(result&&result.nodeType)
				t.parentNode=result;
			for(let k of ig)
			{
				t[k]=t[k]||null;//ignore prev
			}
			loader.prev_arr(temp.child,obj,arr);
		}
		t=temp.next;
		if(t!==null&&!Array.isArray(t))
			temp.next=[t];
		if(Array.isArray(temp.next))
			loader.prev_arr(temp.next,obj,arr);
		if(arr.length>0)
			loader.queue=arr.concat(loader.queue);
		if(temp.waitload===true&&result&&!Array.isArray(result)&&loader.waitTag.includes(temp.tag))
			result.onload=loader.waitload;// temp.waitloadT=true
		else // if(obj.delay===0)loader.load();else
			setTimeout(loader.load,obj.delay);
		temp=null;
		return result;
	},
	"load2":function(obj)
	{
		if(Array.isArray(obj))
			for(var t of obj)
				loader.load(t);
	},
	"appendType":function(obj)
	{
		return Object.assign(loader.types,obj);
	},
	"urlEnc":function(obj,enc=false)
	{
		var str;
		let i=0;
		if(str===null)
			return null;
		str=obj.url||"";
		if(typeof obj.data==="object")for(let t in obj.data)
		{
			str+=((i===0)?"?":"&")+t+"="+((enc===true)?obj.data[t]:encodeURIComponent(obj.data[t]));
			i++;
		}
		return str;
	},
	"getD":function(t){
		loader.d[loader.n]=t;
		return ("loader.d["+(loader.n++)+"]");
	},
	"freeD":function(n){
		const reg1=/loader\.d\[\d+\]/g;
		const reg2=/\d+/;
		if(typeof n==="number")
			loader.d[n]=null;
		else if(typeof n==="string")
		{
			let arr;
			arr=n.match(reg1);
			for(let str of arr)
				loader.freeD(parseInt(str.match(reg2)));
		}
	},
	"n":0,
	"d":[],
	"waitTag":["script","style","link","iframe","frameset","frame","img"],
	"run":false,
	"defaultObj":{}, // default obj
	"exec":{},
	"queue":[],
	"types":{},
	"hash":{},
	"keyHash":{},
};
Object.assign(loader.defaultObj,{"exec":loader.cat,"type":"cat","delay":0,waitload:false,prev:null,child:null,next:null});
Object.assign(loader.defaultObj,{
	"hideShow":"[show]",
	"hideHide":"[hide]",
	"title":"No Title"
});

Object.assign(loader.exec,{
	"code_get":function(th,getElement=false)
	{
		let div2=loader.g(th.parentNode.parentNode,1);
		var code=loader.g(div2,0,0);
		if(getElement===true)
			return code;
		return code.innerHTML.replace("&lt;","<").replace("&gt;",">");
	},
	"codeDownload":function(th,file)
	{
		return loader.download(loader.exec.code_get(th),file);
	},
	"codeCopy":function(th)
	{
		loader.copy(loader.exec.code_get(th));
	},
	"hideState":function(th,show,hide,hideValue=null)
	{
		let state=loader.g(th,1);
		let value=loader.g(th.parentNode,1);
		if(state.innerHTML===show)
		{
			if(hideValue!==null)
			{
				((Array.isArray(hideValue))?hideValue[0]:hideValue).parentNode=value;
				loader.load(hideValue);
				loader.freeD(th.getAttributeNode("onclick").nodeValue);
			}
			state.innerHTML=hide;
			value.setAttribute("State","show");
		}
		else
		{
			state.innerHTML=show;
			value.setAttribute("State","hide");
		}
	},
	/*
	"simpleType":function(obj,arr,len)
	{
		if(obj.types)for(var t in obj.types)
		{
			for(let k of obj.types[t])
			{
				for(let i=0;i<arr.length&&i<len;i++)
				{
					if(arr[i]===k)
						return t;
				}
			}
		}
		return "cat";
	},*/
	"getHash":function(url)
	{
		if(typeof url!=='string')
			return null;
		let c=url.search('#');
		if(c===-1)
			return null;
		return url.substr(c+1);
	},
	"hashC":function(hash,state="show",obj=null,away=false)
	{
		let temp;
		let e;
		/*if(typeof hash="string"&&hash.search("#")!==-1)
			hash=loader.exec.getHash(hash);*/
		if(!obj)
		{
			if(!hash)
				return;
			e=document.getElementsByName(hash)[0];
			if(e)
			{
				e.setAttribute("state",state);
				return;
			}
			obj=loader.hash[hash];
			if(!obj)
				obj=loader.exec.keyHash(hash);
			if(!obj)
				return;
		}
		if(Array.isArray(obj))
			temp=obj[0];
		else temp=obj;
		if(!temp)
			return;
		var h={"type":"hash","state":state,"half":away,back:temp.back,"child":obj};
		if(hash)
			h.hash=hash;
		loader.load(h);
	},
	"keyHash":function(hash){
		let c;
		let k;
		let r;
		if(typeof hash!=="string")
			return;
		for(let key in loader.keyHash)
		{
			c=hash.search(key);
			if(c===-1)
				continue;
			k=loader.keyHash[key];
			if(typeof k==="function")
			{
				r=k(hash);
				if(r)
					return r;
				continue;
			}
			// object
			if(k.keyLeft===true)
			{
				if(c!==0)
					continue;
				if(k.valueName)
					k[k.valueName]=hash.substr(key.length);
			}
			k.hash=hash;
			return k;
		}
	},
	"hashchange":function(event)
	{
		if(event===undefined)
		{
			window.addEventListener('hashchange',loader.exec.hashchange,false);
			loader.exec.hashC(loader.exec.getHash(window.location.href),"show");
			return;
		}
		loader.exec.hashC(loader.exec.getHash(event.oldURL),"hide");
		loader.exec.hashC(loader.exec.getHash(event.newURL),"show");
	},
	"hashDefault":function(obj,away=false)
	{
		if(away===true)
			return loader.exec.hashC(null,"show",obj,away);
		let hash=loader.exec.getHash(window.location.href);
		if(hash)
		{
			if(document.getElementsByName(hash)[0])
				return;
			obj.hash=hash;
		}
		return loader.exec.hashC(null,"show",obj);
	},
	"simple_end":function(str,s,h,i,eq,a2,arr)
	{
		var t=[];
		if(eq!==0)
		{
			t[0]=str.substring(h,eq);
			t[1]=str.substring(eq+1,i);
		}
		else
		{
			t[0]=null;
			t[1]=str.substring(h,i);
		}
		a2.push(t);
		if(s==='\n')
		{
			arr.push(a2);
			return [];
		}
		return a2;
	},
	"simple_q":function(str,i,len)
	{
		let c=str.charAt(i);
		for(i++;i<len;i++)
		{
			s=str.charAt(i);
			if(s==="\\")
				i++;
			else if(s===c)
				break;
		}
		return i;
	},
	"simple_par":function(str)
	{
		let i=0,h=0,len;
		let deep=0;
		let c,s;
		let eq=0;
		var arr=[];
		var a2=[];
		len=str.length;
		while(1)
		{
			s=str.charAt(i);
			switch(s)
			{
				case '"':
				case "'":
				case '`':
					i=loader.exec.simple_q(str,i,len);
					break;
				case '[':
				case '{':
					for(deep=0;i<len;i++)
					{
						s=str.charAt(i);
						switch(s)
						{
							case '\\':
								i++;
								break;
							case '[':
							case '{':
							case '(':
								deep++;
								break;
							case ']':
							case '}':
							case ')':
								deep--;
								break;
							case '"':
							case "'":
							case '`':
								i=loader.exec.simple_q(str,i,len);
								break;
						}
						if(deep===0)
							break;
					}
					break;
				case ":":
				case "=":
					eq=i;
					break;
				case ',':
				case '\n':
					a2=loader.exec.simple_end(str,s,h,i,eq,a2,arr);
					eq=0;
					h=i+1;
				case ' ':
				default:
					break;
			}
			if(i===len)
			{
			loader.exec.simple_end(str,'\n',h,i,eq,a2,arr);
			break;
			}
			i++;
		}
		return arr;
	},
	"simpleFn":function(data)
	{
		return {"type":"simple",data:data};
	}
});


loader.appendType(
	{
		"cat":{
			exec:loader.cat
		},
		"br":{
			"tag":"br"
		},
		"a":{
			"exec":function(obj)
			{
				if(!obj.href)
					return null;
				if(obj.download===null)
					delete obj.download;
				var v=obj.v||obj.value||obj.innerHTML;
				if(!v)
					obj.v=obj.href;
				return loader.cat(obj);
			},
			"tag":"a",
			"attribute":{
				"href":[["href"]],
				"target":[["target"]],
				"style":["display: ",["display"],";"],
				"download":[["download"]]
			},
			"target":"_blank",
			"display":"inline"
		},
		"pic":{
		"tag":"a",
		"attribute":{
			"href":[["src"]],
			"target":"_blank"
		},
		"child":{
			"tag":"img",
			"attribute":{
				"alt":[["alt"]],
				"src":[["src"]],
				"style":"width: 100%;"
			}
		}
	},
	"code":{
		"tag":"div",
		"attribute":{
			"class":"loader-code"
		},
		"child":[{
			"tag":"div",
			"child":[{
				"tag":"input",
				"attribute":{
					"type":"button",
					"value":"Copy",
					"onclick":"loader.exec.codeCopy(this);"
				}
			},{
				"tag":"input",
				"exec":function(obj)
				{
					if(obj.file===undefined)
						obj.file="a.txt";
					var c=loader.cat(obj);
					if(obj.simple===true)
						c.parentNode.style="display:none";
					return c;
				},
				"attribute":{
					"type":"button",
					"value":"Download",
					"onclick":["loader.exec.codeDownload(this,'",["file"],"');"]
				}
			}]
		},{
			"tag":"div",
			"child":{
				"tag":"pre",
				"child":{
					"exec":function(obj)
					{
						var str=loader.cat_(obj,[["code"]]);
						if(str!=="")
							obj.value=str.replace("<","&lt;").replace(">","&gt;");
						return loader.cat(obj);
					},
					"tag":"code"
				}
			}
		}]
	},
		"hide":{
			"exec":function(obj)
			{
				if(obj.child)
					obj.hide=obj.child;
				obj.child=[{
				"tag":"div",
				"attribute":{
					"onclick":"loader.exec.hideState(this,'"+obj.hideShow+"','"+obj.hideHide+"',"+loader.getD(obj.hide)+");",
					"class":"loader-hide"
				},
				"child":[{
					"tag":"span",// title
					"value":obj.title
				},{
					"tag":"span",// state
					"value":obj.hideShow
				}]
			},{
				"tag":"div",
				"attribute":{
					"class":"loader-hide-box"
				}
			}];
				obj.hide=null;
				return loader.cat(obj);
			},
			"tag":"div",
			"attribute":{
				"style":"position:relative;"
			}
		},
		"text":{
			"tag":"pre",
			"exec":function(obj)
			{
				for(let t of ["text","v","value","innerHTML"])
				{
					if(obj[t]!==undefined)
					{
						obj.v=((typeof obj[t]==="string")?obj[t]:obj[t].toString()).replace("<","&lt;").replace(">","&gt;");
						break;
					}
				}
				return loader.cat(obj);
			},
			"attribute":{
				"style":"margin:0;"
			}
		},
		"Bookmark":{
			"exec":function(obj)
			{
				var c=loader.cat(obj);
				c.style.width=obj.width;
				return c;
			},
			"tag":"div",
			"width":"100%",
			"attribute":{
				"class":"loader-Bookmark",
			},
			"child":{
				"tag":"a",
				"attribute":{
					"href":[["href"]],
				},
				"child":[{
					"tag":"div",
					"child":{
						"tag":"img",
						"attribute":{
							"src":[["src"]],
							"alt":[["alt"]]
						}
					}
				},{
					"tag":"div",
					"value":[["title"]]
				}]
			}
		},
		"flexBox":{
			"exec":function(obj)
			{
				if(!obj.child)
					return null;
				var arr=[];
				let w=parseInt((getComputedStyle(obj.parentNode, false)["width"]).replace("px",""));
				w=(w/obj.split)*0.95;
				if(!Array.isArray(obj.child))
					obj.child=[obj.child];
				for(let t of obj.child)
				{
					arr.push({
						"type":"cat",
						"tag":"div",
						"attribute":{
							"style":"width:"+w+"px;"
						},
						"child":t
					});
				}
				obj.child=arr;
				return loader.cat(obj);
			},
			"tag":"div",
			"attribute":{
				"class":"loader-flex"
			},
			"split":4
		},
		"hash":{
			"tag":"div",
			"exec":function(obj)
			{
				if(!obj.child)
					return null;
				if(obj.half===true)
				{
					obj.attribute.style="z-index:50;";
				}
				if(obj.back===true)
				{
					if(!Array.isArray(obj.child))
						obj.child=[obj.child];
					var t=[{"type":"cat","tag":"div","attribute":{"class":"loader-hash-back","onclick":"window.history.go(-1);"},"v":"Back"}];
					obj.child=t.concat(obj.child);
				}
				return loader.cat(obj);
			},
			"state":"show",
			"back":false,
			"attribute":{
				"class":"loader-hash",
				"name":[["hash"]],
				"state":[["state"]]
			}
		},
		"simple":{
			"exec":function(obj)
			{
				if(typeof obj.data!=="string")
					return null;
				let a2=loader.exec.simple_par(obj.data);
				let m=[];// model
				var arr=[];
				let k;
				let s;
				for(let t of a2)
				{
					var temp={};
					for(let i=0;i<t.length;i++)
					{
						k=t[i];
						if(k[0]!==null)
							m[i]=k[0];
						switch(k[1].charAt(0))
						{
							case ' ':
								try{
									s=eval('('+k[1]+')');
								}catch(e){}
								break;
							case '"':
							case "'":
							case '`':
								s=k[1];
								s=s.substring(1,s.length-1);
								break;
							default:
								s=k[1];
						}
						temp[m[i]]=s;
					}
					//if(!temp.type)temp.type=loader.exec.simpleType(obj,m,k.length);
					//loader.a2(obj.extraObj[temp.type],temp)
					//alert(JSON.stringify(temp));
					arr.push(temp);
				}
				obj.child=arr;
				return loader.cat(obj);
			}/*,
			"types":{
				"B_":["aid","bvid"],
				"163_":["id"],
				"text":["text"],
				"a":["href"]
			}*/
		},
		"audio":{
			"tag":"audio",
			"attribute":{
				"src":[["src"]]
			}
		}
	});
loader.loadcsstext(`
div.loader-code div:nth-child(1){
	margin:0;
	position:relative;
	width:100%;
}
div.loader-code div:nth-child(1) input[type=button]{
	display: inline;
}
div.loader-code div:nth-child(2){
	background-color:#EEE;
	position:relative;
	top:0;
	left:0:
	margin: auto 2px;
	width:100%;
	height:auto;
}
div.loader-code div:nth-child(2) pre{
	margin:0;
	width:100%;
	white-space:pre-wrap;
	word-wrap:break-word;
	tab-size:4;
	-moz-tab-size:4;
	-o-tab-size:4;
}
div.loader-code div:nth-child(2) pre code{
	margin:0;
	width:100%;
}
div.loader-hide{
	border: 1px solid black;
	width: calc(100% - 2px);
}
div.loader-hide span:nth-child(1){
	//display:inline;
	overflow:hidden;
	text-overflow:ellipsis;
	white-space:nowrap;
}
div.loader-hide span:nth-child(2){
	//display:inline;
	position: absolute;
	right:0;
	top:0;
}
.loader-hide-box{
	width:100%;
	overflow:hidden;
	display: none;
}
.loader-hide-box[state=show]{
	display: block;
}
.loader-hide-box[state=hide]{
	display: none;
}
div.loader-Bookmark{
	height:auto;
	position:relative;
}
div.loader-Bookmark a div:nth-child(1){
	border:1px solid black;
	border-bottom:0;
	width:100%;
	padding-bottom:100%;
}
div.loader-Bookmark a div:nth-child(1) img{
	position:absolute;
	width:100%;
	max-height:100%;
}
div.loader-Bookmark a div:nth-child(2){
	width:100%;
	border:1px solid black;
	text-align:center;
	overflow:hidden;
	text-overflow:ellipsis;
	white-space:nowrap;
}
div.loader-flex{
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
}
div.loader-hash{
	background-color:white;
	position:fixed;
	top:0;
	left:0;
	width:100%;
	max-height:100%;
	z-index:100;
	overflow:hidden;
	overflow-y: scroll;
	//overflow-x: hidden;
}
div.loaderhash-back{
	width:calc(100%-2px);
	border:1px solid black;
}
div.loader-hash[state=show]{
	display:block;
}
div.loader-hash[state=hide]{
	display:none;
}
`);
/* // 正则表达式卡死
loader.types.simple.exec=function(obj)
			{
				const reg1=/(?:\w+)?[ =:]{0,2}(?:"(\\?"?|[^"\\]+)+"|'(\\?'?|[^'\\]+)+'|`(\\?`?|[^`\\]+)+`|[^"'`,]+)+/g;
				const reg2=/^\w+[\:\=]/;
				const reg3=/(?:`(?:\\[`]?|[^`\\]+)+`|[^\n`]+)+/g;
				if(typeof obj.data==="string")
					obj.arr=obj.data.match(reg3);
				else if(!Array.isArray(obj.data))
					obj.arr=obj.data;
				if(!Array.isArray(obj.arr))
					return null;
				let m=[];// model
				var arr=[];
				let k;
				let s;
				for(let t of obj.arr)
				{
					if(typeof t==="number")
						t=t.toString();
					else if(typeof t!=="string")
						return null;
					k=t.match(reg1);
					if(k===null)
						continue;
					var temp={};
					for(let i=0;i<k.length;i++)
					{
						s=loader.exec.simpleT(k[i],((reg2.test(k[i]))?m:null),i);
						temp[m[i]]=s;
					}
					//if(!temp.type)temp.type=loader.exec.simpleType(obj,m,k.length);
					//loader.a2(obj.extraObj[temp.type],temp)
					//alert(JSON.stringify(temp));
					arr.push(temp);
				}
				obj.child=arr;
				return loader.cat(obj);
			}
loader.exec.simpleT=function(str,arr,i)
	{
		let a=0,b;
		let s;
		if(arr!==null)
		{
			a=str.search(':');
			b=str.search('=');
			if(a>0&&b>0)
				a=(a<b)?a:b;
			else
				a=(a>b)?a:b;
			if(a===-1)
				return;
			s=str.substring(0,a);
			arr[i]=s;
			a++;
		}
		//return str.substr(a+1);
		b=str.length;
		if(str.charAt(a)==='"')
		{
			a++;
			b--;
		}
		if(str.charAt(a)===' ')
		{
			try{
				return eval("("+str.substr(a+1)+")");
			}catch(e){
				return;
			}
		}
		return str.substring(a,b);
	}
*/
loader.exec.what_encode=function(obj)
{
	if(typeof obj.what==="string"&&obj.what.length>0)
	{
		obj.what_encode=encodeURIComponent(obj.what);
		return loader.cat(obj);
	}
	return null;
}
loader.appendType({
	"baidu":{
		"tag":"a",
		"attribute":{
			"href":["https://www.baidu.com/s?word=",["what_encode"]]
		},
		"value": ["Baidu ",["what"]],
		"exec":loader.exec.what_encode
	},
	"Bing":{
		"tag":"a",
		"attribute":{
			"href":["https://cn.bing.com/search?q=",["what_encode"]]
		},
		"value": [["what"]],
		"exec":loader.exec.what_encode
	},
	"163":{
		"tag":"iframe",
		"attribute":{
			"frameborder":"no",
			"border":"0",
			"marginwidth":"0",
			"marginheight":"0",
			"width":[["width"]],
			"height":[["height"]],
			"src":["//music.163.com/outchain/player?type=",["type_"],"&id=",["id"],"&auto=",["auto"],"&height=",["height_"]]
		},
		"width":"298",
		"height":"52",
		"type_":"2",
		"height_":"32",
		"auto":"0"
	},
	"B":{
		"tag":"iframe",
		"attribute":{
			"scrolling":"no",
			"border":"0",
			"frameborder":"no",
			"framespacing":"0",
			"allowfullscreen":"true",
			"src":["//player.bilibili.com/player.html?page=",["page"],["&aid=",["aid"]],["&bvid=",["bvid"]],["&cid=",["cid"]],["&high_quality=",["high_quality"]],["&danmaku=",["danmaku"]],["&t=",["t"]],["&as_wide=",["as_wide"]]]
		},
		"page":"1",
		"danmaku":"0"
	},
	"163_":{
		"type":"163",
		"attribute":{
			"style":"display: inline;"
		},
		"next":{
			"type":"cat",
			"tag":"a",
			"attribute":{
				"target":"_blank",
				"href":["https://music.163.com/#/song?id=",["id"]],
				"style":"display: block;"
			},
			"value":"打开链接"
		}
	},
	"B_":{
		"type":"B",
		"attribute":{
			"style":"display: inline;"
		},
		"next":{
			"exec":function(obj){
				let id;
				if(obj.aid)
					id="av"+obj.aid;
				else if(obj.bvid)
					id=obj.bvid;
				else
					return null;
				obj.attribute.href="https://www.bilibili.com/video/"+id;
				return loader.cat(obj);
			},
			"type":"cat",
			"tag":"a",
			"attribute":{
				"target":"_blank",
				"style":"display:block;"
			},
			"value":"打开链接"
		}
	}
});



