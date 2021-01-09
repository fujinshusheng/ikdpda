
apiready = function () {
    //监听声音键
    db.syjt(function (ret, err) {
        sjerweima();
    });
}

function submitFun() {
    if ($("#YG").val() == '') {
        logMsgFun('请扫描操作工二维码');
        return;
    }
    if ($("#LC").val() == '') {
        logMsgFun('请扫描熔炼炉二维码');
        return;
    }
    db.ajax(function (ret, err) {
        //验证服务端是否执行正确，不正确则内部直接提示错误信息
        if (!db.dfc(ret)) return;
        var data = eval('(' + ret + ')');
        var das = data.msg.ds;
        var msgs = das[0].msg;
        if (das[0].status == '000000') {
            $("#YG").val('');
            $("#LC").val('');
        }
        logMsgFun(msgs);
    }, "M_Upt_RLZBWL", "post", {
        FEmplNameCT: $("#YGValue").val(), FTLKNumber: $("#LCValue").val(), FCreater:''
    }, { title: '提交中', text: '请耐心等待...' });
}

//TC20的PDA，焦点做法才会被识别到该方法
jw.scanfun = function (ret) {
    //区域编号
    var jwquyuID = db.Data.get("quyuID");
    //3号厂的TC20PDA使用该方法
    if (jwquyuID != null) {
        //连续扫描
        autoS = 0;
        scancode(ret);
    }
}

function scancode(ret) {

    try {
        var ewm = eval('(' + ret + ')');
        var q = db.Data.JsonGet(ewm, "q", "");
        var n = db.Data.JsonGet(ewm, "n", "");
        var k = db.Data.JsonGet(ewm, "k", "");
        k = (k == '' ? n : k);

        //员工
        if (q == 'YG') {
            $("#YG").val(k);
            $("#YGValue").val(n);
            //重新打开红外线
            if (sess()) sjerweima();
        }
        if (q == "LC") {
            $("#LC").val(k);
            $("#LCValue").val(n);
            //重新打开红外线
            if (sess()) sjerweima();
        }
    } catch (e) {
        //alert("数据异常");
    }
}
//普通扫描二维码
function erweima(val) {
    //区域编号
    var jwquyuID = db.Data.get("quyuID");
    //3号厂的TC20PDA使用该方法
    if (jwquyuID != null) { return false; }
    db.hw({
        fun: function (ret, err) {
            if (ret) {
                try {
                    var ewm = eval('(' + ret + ')');
                    var q = db.Data.JsonGet(ewm, "q", "");
                    var n = db.Data.JsonGet(ewm, "n", "");
                    var k = db.Data.JsonGet(ewm, "k", "");
                    k = (k == '' ? n : k);

                    //员工
                    if (val == "YG" && q == "YG") {
                        $("#YG").val(k);
                        $("#YGValue").val(n);
                    }
                        //目标压铸机,对应产品
                    else if (val == "LC" && q == "LC") {
                        $("#LC").val(k);
                        $("#LCValue").val(n);
                    } else {
                        logMsgFun('请扫描正常的二维码!');
                    }
                } catch (e) {
                    //alert("数据异常");
                }
            }
        }
    });
}

//随机扫描
function sjerweima() {
    //区域编号
    var jwquyuID = db.Data.get("quyuID");
    //3号厂的TC20PDA使用该方法
    if (jwquyuID != null) { return false; }
    db.hw({
        fun: function (ret, err) {
            scancode(ret);
        }
    });
}
//在连续扫描状态下，是否已经完成了所有的扫描
//true：允许继续扫描，false：不允许继续扫描
function sess() {
    if ($("#LC").val() == '' || $("#YG").val() == '')
        //允许继续扫描
        return true;
    //不允许扫描
    return false;
}