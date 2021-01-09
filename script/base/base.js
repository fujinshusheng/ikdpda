/*
  基础模块类
 * */

var baseApi = {
	/*下拉刷新效果*/
	UIPullRefreshFlash:function(fun){
	api.setCustomRefreshHeaderInfo({
	    bgColor: '#fff',
	    isScale: true,
	    image: {
	        pull: [
	            'widget://image/refresh/dropdown_anim_00.png', 
	            'widget://image/refresh/dropdown_anim_01.png',
	            'widget://image/refresh/dropdown_anim_02.png',
	            'widget://image/refresh/dropdown_anim_03.png',
	            'widget://image/refresh/dropdown_anim_04.png',
	            'widget://image/refresh/dropdown_anim_05.png',
	            'widget://image/refresh/dropdown_anim_06.png',
	            'widget://image/refresh/dropdown_anim_07.png',
	            'widget://image/refresh/dropdown_anim_08.png',
	            'widget://image/refresh/dropdown_anim_09.png',
	            'widget://image/refresh/dropdown_anim_10.png'
	        ],
	        load: [ 
	            'widget:///image/refresh/dropdown_loading_00.png', 
	            'widget:///image/refresh/dropdown_loading_01.png',
	            'widget:///image/refresh/dropdown_loading_03.png',
	            'widget:///image/refresh/dropdown_loading_04.png',
	            'widget:///image/refresh/dropdown_loading_05.png', 
	            'widget:///image/refresh/dropdown_loading_06.png',
	            'widget:///image/refresh/dropdown_loading_07.png',
	            'widget:///image/refresh/dropdown_loading_08.png',
	            'widget:///image/refresh/dropdown_loading_09.png', 
	            'widget:///image/refresh/dropdown_loading_10.png'
	        ]
	    }
	}, function() {
		if(fun !=undefined) fun();
	});		
	},
	UrlHont :'http://120.76.193.197:8015',
	loadDone:function(){
		api.refreshHeaderLoadDone();
	},
	loading:function(){
		 api.refreshHeaderLoading();	
	},
	imgURL:'http://img2.eastled.com',
	//判断是否已经登录
	islogin:function(url){
		var userID = H.getStorage('UserID');

		if(userID){
			H.ajax(function(ret,err){
					if(ret){
						var status = ret.statusCode;
						if(status != 200){
							H.openWin('login',url);
						}
					}else{
						alert(err.msg);
					}
				},baseApi.UrlHont+'/api/aspx/appajax.aspx?cmd=testinglogin','post','text',null,
				{
					returnAll:true,
					headers:{
						Token:""+userID[0].token
					},
					data:{
						values:{
							userid:""+userID[0].user_id
						}
					}
				});


		}else{
			H.openWin('login',url);
		}
	},
	login:function(){
			H.openWin('login','../html/login/login.html');
	},
	loginData:function(data){
		H.setStorage('UserID',data);
		api.sendEvent({
		    name: 'login',
		    extra: {
		        token:  data[0].token
		    }
		});
		api.closeWin();
	},
	addEventLogin:function(){
		api.addEventListener({
    name: 'login'
		}, function(ret, err){
						var userID = H.getStorage('UserID');
				    return userID;
				});
	},
	outLogin:function(){
		H.rmStorage('UserID');
		api.sendEvent({
			name: 'login',
			extra: {
				token:  false
			}
		});

	}
	
	

};

