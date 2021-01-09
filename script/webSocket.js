function WebSocketTest(){
    var obj = {
        wss_ip: '127.0.0.1',//ip
        wss_port: '8888',//端口
        wss_dlms: 'liujianbiao',//登录名
        wss_log: true//是否输出日志
    };
    if (!obj.wss_ip || !obj.wss_port) return;
    if ("WebSocket" in window){
        var ws = new WebSocket('ws://' + obj.wss_ip + ':' + obj.wss_port); 
        ws.onopen = function(){
            if (obj.wss_dlms) ws.send("LOGIN," + obj.wss_dlms + ",密码信息");//登录
        }; 
        ws.onmessage = function (evt){ 
            var data = evt.data;
            if (data && /^ACK/.test(data) && /LOGIN/.test(data)) {//登录成功
                //console.log('登录webSocket成功');
                console.log('登录webSocket成功：' + data);
                ws.send("SEND,IKD5,nihao");
            }
        }; 
        ws.onclose = function(){ 
        
        };
    }
}