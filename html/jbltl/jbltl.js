
apiready = function () {
    //监听声音键
    db.syjt(function (ret, err) {
        sjerweima();
    });
}

//提交数据
function submitFun() {
    
    if ($("#FWorkShipID").val() == '') {
        logMsgFun('请扫描机边炉二维码编号！');
        return;
    }
    if ($("#FTLKNumber").val() == '') {
        logMsgFun('请扫描投料操作工二维码！');
        return;
    }
    if ($("#FNumber").val() == '') {
        logMsgFun('请扫描铝锭二维码序列号！');
        return;
    }
    if ($("#FProNumber").val() == '') {
        logMsgFun('请扫描压铸产品二维码！');
        return;
    }
    db.ajax(function (ret, err) {
        //验证服务端是否执行正确，不正确则内部直接提示错误信息
        if (!db.dfc(ret, '提交失败!')) return;
        //
        var data = eval('(' + ret + ')');
        var das = data.msg.ds;
        var status = das[0].status, msg = das[0].msg;
        if (status == '000000') {
            logMsgFun(msg);
        } else if (status == '111111') {
            logMsgFun(msg);
        } else if (status == '222222') {
            logMsgFun(msg);
        } else if (status == '333333') {
            logMsgFun(msg);
        } else logMsgFun(msg);

        //清空铝锭数据
        $("#LDCLPH").val('');
        $("#FNumber").val('');
        FNumber = '';
        $("#FProNumber").val('');
        FProNumber = '';
        $("#FWorkShipID").val('');
        FWorkShipID = '';
    }, "insertjbltl", "post", {
        FWorkShipID: FWorkShipID,
        FTLKNumber: FTLKNumber,
        FNumber: FNumber,
        FProNumber: FProNumber,
        FCreater: db.login.Userid(),
        BLCompanyID: db.getCurrentUser().quyuId
    }, { title: '提交中', text: '请耐心等待...' });
}
/***********************************二维码扫描 开始**********************************/
//在连续扫描状态下，是否已经完成了所有的扫描
//true：允许继续扫描，false：不允许继续扫描
function sess() {
    if ($("#FWorkShipID").val() == '' || $("#FTLKNumber").val() == '' || $("#FNumber").val() == '' || $("#FProNumber").val() == '')
        //允许继续扫描
        return true;
    //不允许扫描
    return false;
}
//0表示一次扫描一次关闭   1表示连续扫描
var autoS = 0;
//扫描机边炉二维码编号,扫描投料操作工二维码,扫描铝锭二维码序列号,扫描压铸产品二维码
var FWorkShipID = '', FTLKNumber = '', FNumber = '', FProNumber = '';

var domID = '';
var scanType = '';

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



function erweima(id, type, type1) {
    //区域编号
    var jwquyuID = db.Data.get("quyuID");
    //3号厂的TC20PDA使用该方法
    if (jwquyuID != null) { return false; }
	domID = id;
	scanType = type;

    db.hw({
        fun: function (ret, err) {
            //解析扫描后的数据
            scancode(ret);
        }
    });
}
//随机扫描（右上角二维码点击触发）
function sjerweima() {
    //区域编号
    var jwquyuID = db.Data.get("quyuID");
    //3号厂的TC20PDA使用该方法
    if (jwquyuID != null) { return false; }
    db.hw({
        fun: function (ret, err) {
            //连续扫描
            autoS = 1;
            //解析扫描后的数据
            scancode(ret);
        }
    });
}

function scancode(ret) {
    //解析扫描后的数据
    db.Data.sjerweimajiexi(ret, function (p, n, k, g) {
        if (p == "YG") {// && g=='tl'
            //扫描投料操作工二维码
            YGFUN(n, k, ret);
        } else if (p == "YZJ") {
            //扫描机边炉二维码编号
            TLFUN(n, k, ret);
        } else if (p == "LD") {
            //解析铝锭信息
            LDFUN(n, k, ret);
        } else if (p == "CP") {
            //扫描压铸产品二维码
            CPFUN(n, k, ret);
        }
    });
}



//员工二维码解析   n:编号, k:需要显示的名称,content：实际扫描的内容
function YGFUN(n, k, content) {
    $("#FTLKNumber").val('' + k);
    //记录当前投料工
    //db.Data.set("reTLG",k);
    FTLKNumber = n;
    //重新打开红外线
    if (sess() && autoS == 1) sjerweima();
}
//扫描机边炉二维码编号
function TLFUN(n, k, content) {
    $("#FWorkShipID").val('' + k);
    FWorkShipID = n;



    db.submit("M_Get_SBHQCP_a", {
        FJBLNumber: n
    }, function (ret, err) {
    
        try {
        
            var data = eval('(' + ret + ')');
            var das = data.msg.ds;
            if (das != undefined && das.length > 0) {

                $("#FProNumber").val('' + das[0].FName);
                FProNumber = das[0].FID;
            }
        } catch (e) { }
    });


    //重新打开红外线
    if (sess() && autoS == 1) sjerweima();
}
//扫描铝锭二维码序列号
function LDFUN(n, k, content) {
    clphjc(FProNumber, FNumber, function () {
        $("#FNumber").val('' + k);
        FNumber = n;
        //获取材料牌号
        getCLPH(n, 'LD', function (val) {
            $("#LDCLPH").val('' + val);
        });
        //重新打开红外线
        if (sess() && autoS == 1) sjerweima();
    });
}
//扫描压铸产品二维码
function CPFUN(n, k, content) {
    clphjc(FProNumber, FNumber, function () {
        $("#FProNumber").val('' + k);
        FProNumber = n;
        ////获取材料牌号
        //getCLPH(n, 'CP', function (val) {
        //    $("#CPCLPH").val('' + val);
        //});
        //重新打开红外线
        if (sess() && autoS == 1) sjerweima();
    });
}
/***********************************二维码扫描 结束**********************************/
//材料牌号检测
function clphjc(ipt2, ipt3, fun) {
    if (ipt2 == '' || ipt3 == '') {
        fun();
        return;
    }
    db.ajax(function (ret, err) {
        //验证服务端是否执行正确，不正确则内部直接提示错误信息
        if (!db.dfc(ret)) return;

        var data = eval('(' + ret + ')');

        if (ret.indexOf('999999') != -1) {
            db.Ts.toast('材料排号不一致', 2000, 'x');
        } else {
            fun();
        }
    }, "jblclphjc", "post", {
        FNumber: ipt2,
        FProNumber: ipt3
    }, { title: '检测中' });
}