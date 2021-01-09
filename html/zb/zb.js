//目标压铸机，源压铸机，员工
var YZJ2 = '', YZJ1 = '', YG = '', CP2 = '';

apiready = function () {
    //监听声音键
    db.syjt(function (ret, err) {
        sjerweima();
    });
}

function submitFun() {
    if ($("#YZJ1").val() == '') {
        logMsgFun('请扫描源压铸机二维码');
        return;
    }
    if ($("#YZJ2").val() == '') {
        logMsgFun('请扫描目标压铸机二维码');
        return;
    }
    if ($("#CP2").val() == '') {
        logMsgFun('请扫描目标压铸机对应产品二维码');
        return;
    }

    db.ajax(function (ret, err) {
        //验证服务端是否执行正确，不正确则内部直接提示错误信息
        if (!db.dfc(ret)) return;
        //alert(ret);
        var data = eval('(' + ret + ')');
        var das = data.msg.ds;
        var msgs = das[0].msg;
        if (das[0].status == '000000') {
            $("#YZJ1").val('');
            $("#YZJ2").val('');
            $("#CP2").val('');
        } else {
            //db.Ts.alert({msg:msgs});
        }
        logMsgFun(msgs);
        //db.Ts.alert({ msg: msgs });
    }, "insertZB", "post", {
        BLCompanyID: db.getCurrentUser().quyuId,
        YZJ2: YZJ2, YZJ1: YZJ1, YG: YG, CP2: CP2
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
            YG = '' + n;
            $("#YG").val(k);
            //重新打开红外线
            if (sess()) sjerweima();
        }
        if (q == "YZJ") {
            //源压铸机
            if ($("#YZJ1").val() == '') {
                YZJ1 = '' + n;
                $("#YZJ1").val(k);
                //重新打开红外线
                if (sess()) sjerweima();
            }
            //目标压铸机
            else if ($("#YZJ2").val() == '') {
                YZJ2 = '' + n;
                $("#YZJ2").val(k);

                db.submit("M_Get_SBHQCP_a", {
                    FJBLNumber: n
                }, function (ret, err) {
                    try {
                        var data = eval('(' + ret + ')');
                        var das = data.msg.ds;
                        if (das != undefined && das.length > 0) {

                            CP2 = '' + das[0].FID;
                            $("#CP2").val(das[0].FName);
                        }
                    } catch (e) { }
                });

                //重新打开红外线
                if (sess()) sjerweima();
            }
        }
        //目标压铸机，对应产品
        if (q == "CP") {
            CP2 = '' + n;
            $("#CP2").val(k);
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
                        YG = '' + n;
                        $("#YG").val(k);
                    }
                        //源压铸机
                    else if (val == "YZJ1" && q == "YZJ") {
                        YZJ1 = '' + n;
                        $("#YZJ1").val(k);
                    }
                        //目标压铸机
                    else if (val == "YZJ2" && q == "YZJ") {
                        YZJ2 = '' + n;
                        $("#YZJ2").val(k);

                        db.submit("M_Get_SBHQCP_a", {
                            FJBLNumber: n
                        }, function (ret, err) {
                            try {
                                var data = eval('(' + ret + ')');
                                var das = data.msg.ds;
                                if (das != undefined && das.length > 0) {

                                    CP2 = '' + das[0].FID;
                                    $("#CP2").val(das[0].FName);
                                }
                            } catch (e) { }
                        });

                    }
                        //目标压铸机,对应产品
                    else if (val == "CP2" && q == "CP") {
                        CP2 = '' + n;
                        $("#CP2").val(k);
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
    if ($("#YZJ2").val() == '' || $("#YZJ1").val() == '' || $("#YG").val() == '' || $("#CP2").val() == '')
        //允许继续扫描
        return true;
    //不允许扫描
    return false;
}