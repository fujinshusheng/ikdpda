//初始
apiready = function () {
    //监听声音键
    db.syjt(function (ret, err) {
        sjerweima();
    });
    //启动随机二维码
    db.Jianting.get("lqltsys", function (ret, err) {
        sjerweima();
    });
    //
    $(".btn-submit").show();
}
function submitFun() {
    if ($('#FTLKNumber').val() == '') {
        logMsgFun('请扫描投料口二维码！');
        return;
    }
    if ($('#FPenNumber').val() == '') {
        logMsgFun('请扫描铝汤容器二维码！');
        return;
    }
    if ($('#FCheckmanNumber').val() == '') {
        logMsgFun('请扫描检验操作工二维码！');
        return;
    }
    db.ajax(function (ret, err) {
        //验证服务端是否执行正确，不正确则内部直接提示错误信息
        if (!db.dfc(ret)) return;
        var data = eval('(' + ret + ')');
        var das = data.msg.ds;
        var status = das[0].status, msg = das[0].msg;
        if (status == '000000') {
        	db.ajax(function (ret, err){        	
        		layer.msg("领取铝汤成功"); 
        		location.href="";
        	},"insertLPCNEW","post",{
        		FRLLCode:localStorage.getItem("FTLKNumber"),
                FCompanyID:db.Data.get("quyuID") 
        	},{});	 	
        } else if (status == '111111') {
            logMsgFun(msg);
        } else if (status == '222222') {
            logMsgFun(msg);
        } else logMsgFun(msg);
    }, "insertlvtang", "post", {
        //扫描投料口二维码
        FTLKNumber: FTLKNumberCode,
        //铝汤容器二维码
        FPenNumber: FPenNumberCode,
        //检验操作工二维码
        FCheckmanNumber: FCheckmanNumberCode,
        //当前登录用户编号
        FCreater: db.login.Userid()
    }, { title: '提交中', text: '请耐心等待...' });
}

/***********************************二维码扫描 开始**********************************/
//在连续扫描状态下，是否已经完成了所有的扫描
//true：允许继续扫描，false：不允许继续扫描
function sess() {
    if ($("#FTLKNumber").val() == '' || $("#FPenNumber").val() == '' || $("#FCheckmanNumber").val() == '')
        //允许继续扫描
        return true;
    //不允许扫描
    return false;
}
//0表示一次扫描一次关闭   1表示连续扫描
var autoS = 0;
//扫描投料口二维码,铝汤容器二维码,检验操作工二维码
var FTLKNumberCode = '', FPenNumberCode = '', FCheckmanNumberCode = '';
//TC20的PDA，焦点做法才会被识别到该方法
jw.scanfun = function (ret) {
    //区域编号
    var jwquyuID = db.Data.get("quyuID");
    //3号厂的TC20PDA使用该方法
    if (jwquyuID!=null) {
        //连续扫描
        autoS = 0;
        scancode(ret);
    }
}

function scancode(ret) {
    //解析扫描后的数据
    db.Data.sjerweimajiexi(ret, function (p, n, k, g) {
        if (p == "YG") {//&&g=="jy"
            //解析检验工人
            CTYGFUN(n, k, ret);
        } else if (p == "PH") {
            //解析容器
            ZYBFUN(n, k, ret);
        } else if (p == "TL") {
            //解析投料口
          	localStorage.setItem("FTLKNumber",n);
            LCFUN(n, k, ret);
        }
    });
}
function erweima(type, type1) {
    //区域编号
    var jwquyuID = db.Data.get("quyuID");
    //3号厂的TC20PDA使用该方法
    if (jwquyuID!=null) { return false;}
    db.hw({
        fun: function (ret, err) {
            //非连续扫描
            autoS = 0;
            //解析扫描后的数据
            db.Data.erweimajiexi(ret, type, function (n, k) {
                if (type == "TL") {
                    //解析投料口
                    LCFUN(n, k, ret);
                } else if (type == "PH") {
                    //解析容器
                    ZYBFUN(n, k, ret);
                } else if (type == "YG" && type1 == "jy") {
                    //解析检验工人
                    CTYGFUN(n, k, ret);
                }
            });
        }
    });
}
//随机扫描（右上角二维码点击触发）
function sjerweima() {
    //区域编号
    var jwquyuID = db.Data.get("quyuID");
    //3号厂的TC20PDA使用该方法
    if (jwquyuID!=null) { return false; }
    db.hw({
        fun: function (ret, err) {
            //连续扫描
            autoS = 1;
            //解析扫描后的数据
            scancode(ret);
        }
    });
}


//扫描投料口二维码
function LCFUN(n, k, _content) {
    //获取当前炉号的炉批次号
    huoqulupicihaoapp(n);
    $("#FTLKNumber").val('' + k);
    //扫描汤包二维码
    FTLKNumberCode = '' + n;
    //重新打开红外线
    if (autoS == 1 && sess()) sjerweima();
}
//获取当前炉号的炉批次号
function huoqulupicihaoapp(fcodeN) {    
    db.submit('huoqulupicihaoapp', { FCode: fcodeN,Ftype:0 }, function (ret, err) {
        try {
            var data = eval('(' + ret + ')');
            var datas = db.Data.JsonGet(data, "msg", "");
            if (datas.ds.length > 0) {
                var Flpch = db.Data.JsonGet(datas.ds[0], "Flpch", "");
                //获取炉批次号
                if (Flpch != "") $("#lpch").html('' + Flpch);
            }
        } catch (e) {
            logMsgFun("炉批次号获取异常，请联系IT部门。error:" + e);
        }
    });
}
//铝汤容器二维码
function ZYBFUN(n, k, _content) {
    $("#FPenNumber").val('' + k);
    //扫描出汤操作工二维码
    FPenNumberCode = '' + n;
    //重新打开红外线
    if (autoS == 1 && sess()) sjerweima();
}
//检验操作工二维码
function CTYGFUN(n, k, _content) {
    $("#FCheckmanNumber").val('' + k);
    //扫描转运操作工二维码
    FCheckmanNumberCode = '' + n;
    //重新打开红外线
    if (autoS == 1 && sess()) sjerweima();
}

/***********************************二维码扫描 结束**********************************/