//初始
apiready = function () {
    //监听声音键
    db.syjt(function (ret, err) {
        sjerweima();
    });
    //详情的ID
    var d = db.Data.get("ctID");
    var sum = db.Data.toInt(d, 0);
    //列表页点击过来的时候
    if (sum > 0) {
        getData();
    } else {
        $(".btn-submit").show();
    }
}
//提交事件
function submitFun() {
    if ($("#FTLKNumber").val() == '') {
        logMsgFun('请扫描出汤口！');
        return;
    }
    if ($("#FTBNumber").val() == '') {
        logMsgFun('请扫描汤包二维码！');
        return;
    }
    if ($("#FEmplNameCT").val() == '') {
        logMsgFun('请扫描出汤操作工二维码！');
        return;
    }

    db.ajax(function (ret, err) {
        //验证服务端是否执行正确，不正确则内部直接提示错误信息
        if (!db.dfc(ret)) return;
        var data = eval('(' + ret + ')');
        var das = data.msg.ds;
        var status = das[0].status, msg = das[0].msg;
        if (status == '000000') {
            logMsgFun(msg);
            //清空
            $("#FTBNumber").val('');
            $("#FTLKNumber").val('');
            submitfun2();
        } else if (status == '111111') {
            logMsgFun(msg);
        } else if (status == '222222') {
            logMsgFun(msg);
        } else logMsgFun(msg);
    }, "insertZS_SoupCT", "post", {
        //扫描出汤口二维码
        FTLKNumber: FTLKNumberCode,
        //扫描汤包二维码
        FTBNumber: FTBNumberCode,
        //扫描出汤操作工二维码
        FEmplNameCT: FEmplNameCTCode,
        //当前登录用户编号
        FCreater: db.login.Userid(),
        //记录当前扫描的是保温炉还是熔炼炉
        FType: BWLC
    }, { title: '提交中', text: '请耐心等待...' });
}

function submitfun2() {
    db.y9submit(function (ret, err) {

    }, "api40793", "post", {
        //扫描汤包二维码
        PID: FTBNumberCode,
        Ftype: "TB",
        Fstatus: 1,
        FCompanyID: db.Data.get("quyuID")
    }, { title: '提交中', text: '请耐心等待...' });
}

/***********************************二维码扫描 开始**********************************/
//在连续扫描状态下，是否已经完成了所有的扫描
//true：允许继续扫描，false：不允许继续扫描
function sess() {
    if ($("#FTLKNumber").val() == '' || $("#FTBNumber").val() == '' || $("#FEmplNameCT").val() == '')
        //允许继续扫描
        return true;
    //不允许扫描
    return false;
}
//0表示一次扫描一次关闭   1表示连续扫描
var autoS = 0;
//扫描出汤口二维码,扫描汤包二维码,扫描出汤操作工二维码,记录当前扫描的是保温炉还是熔炼炉
var FTLKNumberCode = '', FTBNumberCode = '', FEmplNameCTCode = '',BWLC='LC';
//扫描二维码,指定某个输入框进行传值


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

function erweima(type, type1) {
    //区域编号
    var jwquyuID = db.Data.get("quyuID");
    //3号厂的TC20PDA使用该方法
    if (jwquyuID != null) { return false; }
    db.hw({
        fun: function (ret, err) {
            //非连续扫描
            autoS = 0;
            //解析扫描后的数据
            db.Data.erweimajiexi(ret, type, function (n, k,q) {
                //
                if (type == "LC,BW") {
                    //保温炉二维码或出汤口二维码
                    BWLC = q;
                    //熔炼炉出汤口二维码，解析出汤口
                    LCFUN(n, k, ret);
                }else if (type == "ZYB") {
                    //解析汤包
                    ZYBFUN(n, k, ret);
                } else if (type == "YG") {
                    //解析出汤工人
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
        if (p == "YG") {
            //解析出汤工人
            CTYGFUN(n, k, ret);
        } else if (p == "ZYB") {
            //解析汤包
            ZYBFUN(n, k, ret);
        } else if (p == "LC" || p == "BW") {
            BWLC = p;
            //解析出汤口
            LCFUN(n, k, ret);
        }
    });
}

//解析汤包
function ZYBFUN(n, k, _content) {
    $("#FTBNumber").val('' + k);
    //扫描汤包二维码
    FTBNumberCode = '' + n;
    //重新打开红外线
    if (autoS == 1 && sess()) sjerweima();
}
//解析出汤工人
function CTYGFUN(n, k, _content) {
    $("#FEmplNameCT").val('' + k);
    //扫描出汤操作工二维码
    FEmplNameCTCode = '' + n;
    //重新打开红外线
    if (autoS == 1 && sess()) sjerweima();
}
//解析出汤口
function LCFUN(n, k, _content) {
    //初始化出汤口数据
    $("#FTLKNumber").val('');
    FTLKNumberCode = '';
    //远程请求，判断状态
    db.ajax(function (ret, err) {
        //验证服务端是否执行正确，不正确则内部直接提示错误信息
        if (!db.dfc(ret)) return;

        var data = eval('(' + ret + ')');
        var das = data.msg.ds;
        if (das[0].FStatus == "1") {
            //logMsgFun('允许投料');
        }
        if (das[0].FStatus == "2") {
            //logMsgFun('允许出汤');
        }
        if (das[0].FStatus == "3") {
            logMsgFun('未开炉');
        }
        if (das[0].FStatus == "4") {
            logMsgFun('正在检验铝汤品质！');
        }
        //显示数据
        $("#FTLKNumber").val('' + k);
        //赋值，传入服务器端
        FTLKNumberCode = '' + n;
        //重新打开红外线
        if (autoS == 1 && sess()) sjerweima();
    }, "m_ct", "post", { FCode: n,
        //记录当前扫描的是保温炉还是熔炼炉
        FType: BWLC }, { title: '读取中' });
}

/***********************************二维码扫描 结束**********************************/