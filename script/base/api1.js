//全局通用api1文件   
var api1 = {
//-----------------项目临时信息存储-begin---------------
	//登录信息
	login:{
		//登录用户的唯一编号
		Userid:function(){
			var _userid=api1.Prefs.get('Userid');
			return api1.DataConverter.toInt(_userid);
		},
		//登录用户的手机号码
		UserM:function(){
			return api1.Prefs.get('UserM');
		},
		UserData:function(){
			var _UserData=api1.Prefs.get('UserData');
			return _UserData;
		}
	},
	//是否登录,没有登录，则直接跳转到登录窗口
	islogin:function(){
		if(api1.login.Userid()<=0){
			var p=api1.path('html/personal/login/login_head.html');
			api1.win.openWin({name:'login',url:p});
		}
		return api1.login.Userid();
	},
	//获取文章编号
	bbmsg:{
		tid:function(){
			var _Tid=api1.Prefs.get('Tid');
			return api1.DataConverter.toInt(_Tid);
		}
	},
	//项目众包详情
	xmxq:function(id){
		api1.Prefs.set('Tid',id);
		var p=api1.path('html/project/information-detail/information_detail_head.html');
		api1.win.openWin({name:'zb'+id,url:''+p});
	},
	//项目众筹详情
	xmxq1:function(id){
		api1.Prefs.set('Tid',id);
		var p=api1.path('html/projectRaise/raise-detail/raise_detail_head.html');
		api1.win.openWin({name:'zc'+id,url:''+p});
	},
	//搜索
	sousuo:function(a){
    	//a：1表示项目众包搜索
    	//a：2表示项目众筹搜索
		api1.Prefs.set('s_type',a);
		var p=api1.path('html/search/search_head.html');
		api1.win.openWin({name:'sousuo',url:p});
	},
	//弹出各类协议信息
	xieyi:function(a,fun){
		//协议名称
		var xieyiming='',cmms="";
		if(a==1){
			xieyiming="服务协议";
			cmms="AboutAgreement";
		}
		if(a==2){
			xieyiming="众包协议";
			cmms="ProjectAgreement";
		}
		if(a==3){
			xieyiming="众筹协议";
			cmms="CrowdAgreement";
		}
		api1.ajax({
			//传输get参数     cmd=login&del=1
			getparm:'cmd=DisplayHtml',
			//传输的参数 
			//AboutAgreement服务协议；
			//ProjectAgreement:众包协议|
			//CrowdAgreement:众筹协议）
			parm:{catalog:''+cmms},
			//回调函数
			fun:function(rows,count,ret){
				if(count<=0) return;
				api1.alert({
					fun:function(ret, err){
						//api.closeWin();
						if(fun!=undefined)fun();
					},
					title:'《工程包包网络服务协议》',
					msg:''+rows[0].Article,
					time:300000
				});
			}
		});
	},
	//提交后提示信息
	bbts:function(msg,fun){
		if(msg==undefined)msg='请等待客服审核！审核周期1天';
		if($("#tipicoYes").length==0){
			var hs=[];
			hs.push('<div beizhu="成功时提示" id="tipicoYes" style="display:none;" class="H-position-fixed H-width-100-percent H-height-100-percent H-z-index-1000000 H-vertical-top-0 H-horizontal-left-0 H-vertical-bottom-0 H-horizontal-right-0 H-background-color-transparent-3 H-center-all">');
			hs.push('<div class="H-theme-background-color-white animated" style="width:80%; text-align:center; border-radius:10px; ">');
			hs.push('<div class="H-font-size-30 H-theme-font-color-red H-text-align-center H-padding-vertical-top-10 H-padding-vertical-bottom-5">提交成功</div>');
			hs.push('<img id="tipicoYesimg" src="../../image/icoYes.gif" />');
			hs.push('<div class="H-font-size-14 H-padding-vertical-both-15" id="tipicoYesmsg">请等待客服审核！审核周期1天</div>');
			hs.push('<div class="H-font-size-12 H-theme-font-color-999 H-padding-vertical-bottom-15">（3s）后自动跳转</div>');
			hs.push('</div>');
			hs.push('</div>');
			$("body").append(hs.join(''));
		}
		//获取绝对路径图片
		var p=api1.path('image/icoYes.gif');
		$("#tipicoYesimg").attr({"src":""+p});
		//更改提示信息内容
		$("#tipicoYesmsg").html(''+msg);
		//显示提示
		$("#tipicoYes").show();
		//3秒后自动隐藏
		window.setTimeout(function(){
			if(fun==undefined) {
				api.closeWin();
			} else {
				//隐藏提示
				$("#tipicoYes").hide();
				fun();
			}
		},3000);
	},
	//暂无信息
	bbzwgj:function(msg,fun){
		if(msg==undefined)msg='请等待客服审核！审核周期1天';
		if($("#tipicoYes").length==0){
			var hs=[];
			hs.push('<div beizhu="成功时提示" id="tipicoYes" style="display:none;" class="H-position-fixed H-width-100-percent H-height-100-percent H-z-index-1000000 H-vertical-top-0 H-horizontal-left-0 H-vertical-bottom-0 H-horizontal-right-0 H-background-color-transparent-3 H-center-all">');
			hs.push('<div class="H-theme-background-color-white animated" style="width:80%; text-align:center; border-radius:10px; ">');
			hs.push('<div class="H-font-size-30 H-theme-font-color-red H-text-align-center H-padding-vertical-top-10 H-padding-vertical-bottom-5">提交成功</div>');
			hs.push('<img id="tipicoYesimg" src="../../image/icoYes.gif" />');
			hs.push('<div class="H-font-size-14 H-padding-vertical-both-15" id="tipicoYesmsg">请等待客服审核！审核周期1天</div>');
			hs.push('<div class="H-font-size-12 H-theme-font-color-999 H-padding-vertical-bottom-15">（3s）后自动跳转</div>');
			hs.push('</div>');
			hs.push('</div>');
			$("body").append(hs.join(''));
		}
		//获取绝对路径图片
		var p=api1.path('image/icoYes.gif');
		$("#tipicoYesimg").attr({"src":""+p});
		//更改提示信息内容
		$("#tipicoYesmsg").html(''+msg);
		//显示提示
		$("#tipicoYes").show();
		//3秒后自动隐藏
		window.setTimeout(function(){
			if(fun==undefined) {
				api.closeWin();
			} else {
				//隐藏提示
				$("#tipicoYes").hide();
				fun();
			}
		},3000);
	},
	//分享的标题
	setbbfxtitle:function(t){
		 //分享时需要用到
		api1.Prefs.set('fxtitle',t);
	},
	//触发分享
	bbfx:function(a,m,title){
		//是否登录状态
		if(api1.islogin()<=0) return;
		//分享的标题
		var fxtitle=api1.Prefs.get('fxtitle');
		if(title!=undefined)fxtitle=title;
		//推荐码
		if(m==undefined)m=api1.login.UserM();
		if(m=='')m='15676241443';
		var txt='';
		//我有合同，我有人脉，我有信息
		if(a==1){txt='我有【{标题}】，快来工程包包联系我吧！下载地址：http://d.gcbb123.com 推荐码：{手机号}';}
		//我找合同，我找人脉，我找信息
		if(a==2){txt='我正在找【{标题}】，快来工程包包帮帮我吧！优良回报，合作共赢！下载地址：http://d.gcbb123.com 推荐码：{手机号}';}
		//我-邀请好友
		if(a==3){txt='工程包包：工程工业领域一合作共赢，为大家服务的APP! 下载地址：http://d.gcbb123.com 推荐码：{手机号}';}	
	   	//分享
	    api1.fx({
		    text: ''+txt.replace(/{标题}/g,''+fxtitle).replace(/{手机号}/g,''+m)
		});	   
	},
//-----------------项目临时信息存储-end---------------
    //配置信息
    config: {   
        //测试
        ajaxIP: 'http://120.76.193.197:8015',
        //正式
        //ajaxIP: 'http://www.eastled.com',
        //默认请求的文件地址
         ajaxPath: '/dinterface/app.ashx',
         updatePath:'/res/bb.apk'
    },
     //当前网络连接类型，如 2g、3g、4g、wifi 等，取值范围详见网络类型常量，字符串类型
     wllx:function(){
     	return api.connectionType;  //比如： wifi
     },
    // 判断是否是WebView
    isWebView: function () {
        var that = this;
        var host = window.location.host;
        var path = window.location.href;
        if (host == "" && ((path.toLowerCase().indexOf('file:///storage') > -1)) 
        || ((path.toLowerCase().indexOf('file:///android_asset') > -1)) 
        || ((path.toLowerCase().indexOf('file:///data') > -1)) 
        || (path.toLowerCase().indexOf('file:///var/') > -1) 
        || (path.toLowerCase().indexOf('contents:///') > -1) 
        || (path.toLowerCase().indexOf('file:///private/') > -1)) 
            return true;
        else 
            return false;
    },
    // 判断是否是APICloud
    isAPICloud: function () {
        var that = this;
        if (typeof api !== 'undefined' && typeof api.openWin !== 'undefined' && that.isWebView()) 
            return true;
        else 
            return false;
    },
    /********************************二维码扫描 begin*******************************/
   scanner:{
	   //是否打开着
	   isopen:0,
    	//加载模块
    	requireScanner:function(){
	    	if(api1.scanner.obj==undefined)
	       		api1.scanner.obj= api.require('scanner');
    	},
    	//打开二维码摄像头
	   open:function(opt){
	   //是否打开着
	   if(api1.scanner.isopen==1){
		   	api1.scanner.close();
		}else{
			//获取手机窗口
			var winWidth = api.winWidth;  
			var winHeight = api.winHeight;  
		    //打开
		    api1.scanner.isopen=1;
    		//加载模块
    		api1.scanner.requireScanner();
    		//初始化合并参数
    		opt=$.extend({
				//是否连续扫描，1：连续扫描   0：非连续扫描
				isauto:0,
			    x: winWidth/2-100,
			    y: 100,
			    w: winWidth/2,
			    h: winHeight/2,
			    sound: 'widget://test.wav',
			    fun:function(ret, err){}
			},opt);
    		//打开
			api1.scanner.obj.openView(opt, function(ret, err){			     
			    if( ret ){
			    		//执行回调
						opt.fun(ret.msg,ret);
						//关闭扫描
		   					api1.scanner.close();
		   					/*
						//是否连续扫描
						if(opt.isauto==0){
						//关闭扫描
		   					api1.scanner.close();
						}
						*/
			    }else{
			        alert('err:'+ JSON.stringify( err ) );
			    }	   
			});
		}
	   },
    	//关闭二维码摄像头
	   close:function(){
    		//加载模块
    		api1.scanner.requireScanner();
		   //是否打开着
		   if(api1.scanner.isopen==1){
		   		api1.scanner.obj.closeView();
		   		//关闭
				api1.scanner.isopen=0;
		   }
	   }
   },
    /********************************二维码扫描 end*******************************/
    //弹出信息
    alert: function(opt){
		//初始化合并参数
		opt=$.extend({
			fun:function(ret, err){},
			title:'系统提示',
			msg:'请稍等...',
			btn: ['确定'],
			time:3000
		},opt);	 
		
		if(layer){
			layer.open({
			  title:opt.title,
			  content: opt.msg,
			  btn: opt.btn,
			  //offset:'10px',
			  //3秒后自动关闭
			  time:opt.time,
			  end: function(index, layero){
			  	//关闭提示框
			    layer.close(index); 
		    	opt.fun();
			  }
			});  
		}else{
		    api.alert(opt, function(ret, err){
		    	opt.fun(ret, err);
			});
		}
    },
    tip:function(opt){
    	//初始化合并参数
		opt=$.extend({
		    msg: '网络错误',
		    //2秒后自动消失
		    duration: 2000,
		    location: 'bottom'
		},opt);	 
	    api.toast(opt);
    },
    prompt:function(opt){
    	//初始化合并参数
		opt=$.extend({
		//描述：（可选项）标题
		title:'系统提示',
		//描述：（可选项）内容
		msg:'请稍等...',
		//描述：（可选项）输入框里面的默认内容
		text:'',
		//描述：（可选项）输入类型，不同输入类型弹出键盘类型不同，取值范围（text、password、number、email、url）
		type:'text',
		    buttons: ['确定', '取消']
		}, function(ret, err){
		    var index = ret.buttonIndex;
		    var text = ret.text;
		},opt);	
	    api.prompt(opt);
    },
    /********************************DataConverter数据类型转换 begin*******************************/
    DataConverter: {
        //转换成整数
        toInt: function (_value1,_default) {
            if (_default == undefined) _default= 0;
            if (_value1 == undefined) return _default;
            var v = parseInt(_value1);
            if (isNaN(v)) v = _default;
            return v;
        },
        //转换成带小数点数字
        toFolat: function (_value1,_default) {
            if (_default == undefined) _default= 0;
            if (_value1 == undefined) return _default;
            var v = parseFloat(_value1);
            if (isNaN(v)) v = _default;
            return v;
        },
        //是否是数字
        isFinite: function (_value1) {
            var v = isFinite(_value1);
            return v;
        }
    },
    /********************************DataConverter数据类型转换 end*******************************/
    /********************************json操作 begin*******************************/
    json: {
        //参数解说
        /*
        _obj:需要操作的json对象 
        _key1：需要取得节点名, 
        _value1：如果节点不存在时，需要返回的默认值
        */
        get: function (_obj, _key1, _value1) {
            if (_value1 == undefined) _value1 = "";
            if (!this.is(_obj, _key1)) { return _value1; }
            return _obj["" + _key1];
        },
        //是否存在节点
        is: function (_obj, _key1) {
            return ("" + _key1 in _obj);
        }
    },
    /********************************json操作 end*******************************/
    /********************************本地存储localStorage begin*******************************/
    ls: {
        //删除数据
        del: function (key) {
            if (window.localStorage) {
                window.localStorage.removeItem(key);
            } else {
                //当前浏览器不支持 localStorage
            }
        },
        //获取数据
        get: function (key) {
            if (window.localStorage) {
                var retStr = '';
                retStr = window.localStorage.getItem(key);
                if (retStr == null) retStr = '';
                if (retStr == undefined) retStr = '';
                return retStr;
            } else {
                //当前浏览器不支持 localStorage
            }
            return '';
        },
        //存储数据
        set: function (key, val) {
            if (window.localStorage) {
                this.del(key);
                window.localStorage.setItem(key, val);
            } else {
                //当前浏览器不支持 localStorage
            }
        }
    },
    /********************************本地存储localStorage end*******************************/
    /********************************存储到原生变量中 begin*******************************/
   Prefs:{
        //存储数据
        set: function (key, val) {
            api.setPrefs({key: key,value: val});
        },        
        //获取数据
        get: function (key, val) {
            var retStr = api.getPrefs({sync:true,key:key});
            if (retStr == null) retStr = '';
            if (retStr == undefined) retStr = '';
	        //同步返回结果：
			return retStr;
        }
   },   
    /********************************存储到原生变量中 end*******************************/
    /********************************ajax begin*******************************/
   ajax:function(opt){  
	//初始化合并参数
	opt=$.extend({
		//传输get参数     cmd=login&del=1
		getparm:'',
		//post传输的参数
		parm:{cmd:''},
		//数据返回类型
	    //dataType:'json',
		//传输的文件
		//files:{file: 'fs://a.gif'},
		//是否显示加载条
		isload:true,
		//回调函数
		fun:function(rows,count,ret){},
		alertTitle:'数据处理中...',
		alertText:'请稍等...'
	},opt);	 
	
	//是否显示提示框
	if(opt.isload){
		api1.loadAlert.show({
		    title: opt.alertTitle,
		    text: opt.alertText
	    });
    }
	//有get参数
	if(opt.getparm!='')opt.getparm='?'+opt.getparm;					
	//异步提交
    api.ajax({
    	//请求地址
	    url: api1.config.ajaxIP+api1.config.ajaxPath+opt.getparm,
	    //提交类型
	    method: 'post',
		//数据返回类型
	    //dataType:'json',
	    //需要提交的post参数
	    data: {
	        values: opt.parm
	    }
	},function(ret, err){
		//是否显示提示框，当前动作隐藏进度条
		if(opt.isload)
			api1.loadAlert.hide();
		if (ret) {
			//获取返回数据状态
			var _status=api1.json.get(ret,'status','999999');
			//api.alert({msg:JSON.stringify(ret)});
			//正常数据请求
			if(_status==200){
				//执行回调函数
				opt.fun(ret.data.rows,ret.data.recordCount,ret);
			}else{	         	
				api.alert({msg:'请求数据错误！'+JSON.stringify(ret)});
			}
	    } else {
	    	//异常通讯或数据异常
	         api.alert({msg:''+err.msg});
	         //api.alert({msg:'err:'+JSON.stringify(err)});
	    }
	});	
   },   
    /********************************ajax end*******************************/
    /********************************时间日期选择 begin*******************************/
   //获取当前时间
   nowDate:function(){
	  var now= new Date();
	
	  var year=now.getFullYear();
	
	  var month=now.getMonth()+1;
		if(month>12)month=1;
	  var date=now.getDate();
	  
	  return {
		  year:year,
		  month:month,
		  day:date,
		  getTime:now.getTime()
	  };
   },
   //
   data:function(opt){
	  var now= this.nowDate();
	  
	//初始化合并参数
	opt=$.extend({
		//默认值
		//date:'',
		date:''+now.year+'-'+now.month+'-'+now.day,
		//类型
		 type: 'date_time',
		//标题
	    title:'选择时间',
		//回调函数
		fun:function(ret, err){}
	},opt);	
	
   //调用接口
	 api.openPicker(opt, function(ret, err){
		 if( ret ){
		 /*
		   {
			    year:2000,                  //年
			    month:1,                    //月
			    day:1,                      //日
			    hour:12,                    //时
			    minute:00                   //分
			}
		   */
		 	opt.fun(ret, err);
			 //alert( JSON.stringify( ret ) );
		 }else{
			 alert( "err:"+JSON.stringify( err ) );
		 }
	 });
   },
    /********************************时间日期选择 end*******************************/
    /********************************底部弹出选择框 begin*******************************/
   select:function(opt){
	//初始化合并参数
	opt=$.extend({
		title: '选择项',
		//这里是取消按钮
	    //cancelTitle: '这里是取消按钮',
	    //红色警告按钮
	    //destructiveTitle: '红色警告按钮',
	    //按钮数据
	    buttons: ['1','2','3'],
		//回调函数
		fun:function(ret, err){}
	},opt);	
   api.actionSheet(opt, function(ret, err){
		 if( ret ){
		 	opt.fun(ret, err);
			 //alert( JSON.stringify( ret ) );
		 }else{
			 alert( 'err:'+JSON.stringify( err ) );
		 }
	 });
   },
    /********************************底部弹出选择框 end*******************************/
    /********************************窗口页面监听 begin*******************************/
   winMsg:{
	   //发送消息
	   send:function(name,value){
	   /*
	    value=
	     {
		        key1: 'value1', 
		        key2: 'value2'
		    }
	    */
	   	api.sendEvent({
		    name: ''+name,
		    extra:value
		});
	   },
	   //接收消息
	   receive:function(name,fun){
	   	api.addEventListener({
		    name: ''+name
		}, function(ret, err){
		 	if( ret ){
				if(fun!=undefined)fun(ret, err);
		    }else{
		    	api.alert({msg:JSON.stringify(err)});
		        //alert( JSON.stringify( err ) );
		    }
		});
	   },
	   //直接执行指定窗口中的js
	   execJS:function(opt){
			//初始化合并参数
			opt=$.extend({
				//（可选项）window 名称，若要跨 window 执行脚本，该字段必须指定，首页的名称为 root
			    name: 'root',
			    //（可选项）frame名称
			    frameName: '',
			    //js代码
			    script: ''
			},opt);	
		   api.execScript(opt);
	   }
   },
    /********************************窗口页面监听 end*******************************/
    /********************************页面窗口 begin*******************************/
   win:{
    //打开延时时间，只有在安卓机器的情况下才会用到
    time:300,
   	openFrame:function(opt){
		//初始化合并参数
		opt=$.extend({
		    name: 'page2',
		    url: './page2.html',
		    rect: {
		        x: 0,
		        y: 0,
		        w: 'auto',
		        h: 'auto'
		    },
		    pageParam: {
		        name: 'test'
		    },
		    bounces: true,
		    bgColor: 'rgba(0,0,0,0)',
		    vScrollBarEnabled: true,
		    hScrollBarEnabled: true,
			//回调函数
			fun:function(ret, err){}
		},opt);	
	   	//获取系统类型	   	
        var sysType = api.systemType;
        //ios下打开是正常的
        if (sysType == 'ios') {
			api.openFrame(opt);
		//安卓下需要延迟打开保证体验	   	
        } else if (sysType == 'android') {
		   	//打开延时时间
		   	var time1=this.time+50;
        	window.setTimeout(function(){api.openFrame(opt);},time1);
        }
   	},
   	//打开窗口
   	openWin:function(opt){   	
		//初始化合并参数
		opt=$.extend({
		    name: 'page1'+api1.nowDate(),
		    url: './page1.html',
		    //描述：（可选项）window 显示延迟时间，适用于将被打开的 window 
		    //中可能需要打开有耗时操作的模块时，可延迟 window 展示到屏幕的时间，保持 UI 的整体性
			delay:100,
			animation:{
			    type:"push",                //动画类型（详见动画类型常量）
			    subType:"from_right",       //动画子类型（详见动画子类型常量）
			    duration:this.time                //动画过渡时间，默认300毫秒
			},
		    pageParam: {
		        name: 'test'
		    }
		},opt);	
	   	api.openWin(opt);
   	},
   	//打开远程网页
   	openUrl:function(title,url,pathLeve){
	   	//设置标题
	   	api1.ls.set('openUrltitle',title);
	   	//设置远程地址
	   	api1.ls.set('openUrlurl',url);
   		//打开窗口
		api1.win.openWin({
		    name: 'webview',
		    url: api1.path('html/webview.html'),
		    progress:{
			    type:"default", //加载进度效果类型，默认值为 default，取值范围为 default|page，default 等同于 showProgress 参数效果；为 page 时，进度效果为仿浏览器类型，固定在页面的顶部
			    title:""+title,//type 为 default 时显示的加载框标题
			    text:"加载中...", //type 为 default 时显示的加载框内容
			    color:"" //type 为 page 时进度条的颜色，默认值为 #45C01A，支持#FFF，#FFFFFF，rgb(255,255,255)，rgba(255,255,255,1.0)等格式
		    }
		});
   	}
   },
    /********************************页面窗口 end*******************************/
    /********************************显示进度提示框 begin*******************************/
   loadAlert:{
   //显示
   	show:function(opt){
		//初始化合并参数
		opt=$.extend({
		    style: 'default',
		    animationType: 'fade',
		    title: '努力加载中...',
		    text: '先喝杯茶...',
		    modal: false
		},opt);	
	   api.showProgress(opt);
   	},
   	//隐藏
   	hide:function(){
   		api.hideProgress();
   	}
   },
    /********************************显示进度提示框 end*******************************/
    /********************************监听APP事件 begin*******************************/
   //监听app应用各个事件
   //name=swiperight          Window 或者 Frame 的页面全局向右轻扫事件，字符串类型
   //name=swipeup             Window 或者 Frame 的页面全局向上轻扫事件，字符串类型
   //name=longpress           Window 或者 Frame 的页面全局长按事件，字符串类型。
   //name=scrolltobottom      Window 或者 Frame 页面滑动到底部事件，字符串类型
   jt:function(name,fun){
	   api.addEventListener({
		    name:name
		}, function(ret, err){        
		   fun(ret, err);
		});
   },
    /********************************监听APP事件 end*******************************/ 
    /********************************系统分享控件 begin*******************************/
   fx:function(opt){
		//初始化合并参数
		opt=$.extend({
		    text: '纯文本信息',
		    type: 'text'
		},opt);	
	   if(api1.sharedModule==undefined)
		   api1.sharedModule = api.require('shareAction');
	   api1.sharedModule.share(opt);
   },
    /********************************系统分享控件 end*******************************/ 
    /********************************手机剪切板 begin*******************************/
  	clip:{
  		//设置内容
	  	set:function(val,fun){
	  		if(api1.clipBoard==undefined)
				api1.clipBoard = api.require('clipBoard');
			api1.clipBoard.set({
			    value: ''+val
			}, function(ret, err){
				if(fun!=undefined)fun(ret, err);
			    /*if( ret ){
			        alert( JSON.stringify( ret ) );
			    }else{
			        alert( JSON.stringify( err ) );
			    }*/
			});
	  	},
	  	//获取内容
	  	get:function(fun){
	  		if(api1.clipBoard==undefined)
				api1.clipBoard = api.require('clipBoard');
			api1.clipBoard.get(function( ret, err ){
				if(fun!=undefined)fun(ret, err);
			    /*if( ret ){
			        alert( JSON.stringify( ret ) );
			    }else{
			        alert( JSON.stringify( err ) );
			    }*/
			});
	  	},
	  	//设置剪贴板监听事件
	  	setListener:function(fun){
	  		if(api1.clipBoard==undefined)
				api1.clipBoard = api.require('clipBoard');
			api1.clipBoard.setListener(function( ret, err ){
				if(fun!=undefined)fun(ret, err);
			    /*if( ret ){
			        alert( JSON.stringify( ret ) );
			    }else{
			        alert( JSON.stringify( err ) );
			    }*/
			});
	  	},
	  	//移除剪贴板监听事件
	  	removeListener:function(){
	  		if(api1.clipBoard==undefined)
				api1.clipBoard = api.require('clipBoard');
			api1.clipBoard.removeListener();
	  	}
  	},
    /********************************手机剪切板 end*******************************/ 
    //头部沉浸式动作判断
    fixStatusBar: function (dom) {        
        var sysType = api.systemType;
        if (sysType == 'ios') {
            var numSV = this.DataConverter.toInt(api.systemVersion, 10);
            //IOS 7 以上才有沉浸式的内增高动作
            if (numSV >= 7 && !api.fullScreen && api.statusBarAppearance) {
                $(dom).css({"padding-top":"20px"});
            }
        } else if (sysType == 'android') {
            var ver = this.DataConverter.toFolat(api.systemVersion);
            //android 4.4 以上才有沉浸式的内增高动作
            if (ver >= 4.4) {
                $(dom).css({"padding-top":"25px"});
            }
        }
    },
    //下拉页面，刷新
    xlsx:function(opt){  
		//初始化合并参数
		opt=$.extend({
		    visible: true,
		    loadingImg: 'widget://image/refresh.png',
		    bgColor: '#ccc',
		    textColor: '#fff',
		    textDown: '下拉刷新...',
		    textUp: '松开刷新...',
		    showTime: true,
		    fun:function(){}
		},opt);	  
		api.setRefreshHeaderInfo(opt, function(ret, err){
			if(opt.fun!=undefined)opt.fun(ret, err);
		});
    },
    //获取绝对路径
    path:function(p){
    	return api.wgtRootDir+'/'+p;
    },
   //安装应用
   anzhuang:function(_path){
	   //Android用法：
		api.installApp({
		    appUri: _path//'file://xxx.apk'
		});
   },
   //下载文件
   xiazai:function(opt){
		//初始化合并参数
		opt=$.extend({
		    url: api1.config.ajaxIP+api1.config.updatePath,
		    savePath: 'fs://IKDtest.rar',//'fs://test.rar',
		    report: true,
		    cache: true,
		    allowResume: true,
		    //下载成功后执行
		    fun1:function(ret, err){},
		    //下载过程中执行
		    fun2:function(ret, err){}
		},opt);	
		//
	   api.download(opt,function(ret, err){
			//
		    if(ret.state == 1){
		        //下载成功
				opt.fun1(ret, err);
		    }else{
				//下载中
				opt.fun2(ret, err);
		    }
		});
   },
   //获取元素中指定索引的值
   getArrValue:function(arrObj,index_,defalutValue){
	    if(defalutValue==undefined)defalutValue='';
	   	if(arrObj==undefined) return defalutValue;
	   	if(arrObj==null) return defalutValue;
	   	if(arrObj.length<=index_) return defalutValue;
	   	return arrObj[index_];
   },
    //结束
    end: {}
};

