
//0表示一次扫描一次关闭   1表示连续扫描
var autoS = 0;
//铝锭编号,员工编号,炉号
var LD = '', YG = '', LH = '', HL = '';

apiready = function () {
    //监听声音键
    db.syjt(function (ret, err) {
        sjerweima();
    });
}
$(function () {
    type1Value = 2;
    //获取材料牌号
    getclph();
})
function submitFun() {
    if ($("#CLPH").val() == '' || $("#CLPH").val() == '0') {
        logMsgFun('请选择材料牌号或扫描正确的铝锭二维码');
        return;
    }
    if ($("#ZL").val() == '') {
        logMsgFun('请输入重量');
        return;
    }
    if ($("#LH").val() == '0') {
        logMsgFun('请选择炉号');
        return;
    }
    //类型判断，3为回料桶，其他为铝锭和手动选择，
    var phtype = '';
    if (type1Value == 3)
        phtype = HL;
    else
        phtype = LD;
    db.ajax(function (ret, err) {
        //验证服务端是否执行正确，不正确则内部直接提示错误信息
        if (!db.dfc(ret)) return;

        var data = eval('(' + ret + ')');
        var das = data.msg.ds;
        var status = das[0].status, msgs = das[0].msg;
        if (status == '000000') {
            $("#ZL").val('');
            $("#CLPH").html('');
            $("#HLT").hide();
        } else {
            //db.Ts.alert({msg:msgs});
        }
        logMsgFun(msgs);
        //db.Ts.alert({ msg: msgs });
    }, "tijiaohuiliao", "post", {
        type1: type1Value, CLPH: $("#CLPH").val(),
        LD2d: phtype, userid: db.login.Userid(), LH: LH, ZL: $("#ZL").val(), CZG: YG
    }, { title: '提交中', text: '请耐心等待...' });
}
//TC20的PDA，焦点做法才会被识别到该方法
jw.scanfun = function (ret) {
    //区域编号
    var jwquyuID = db.Data.get("quyuID");
    //3号厂的TC20PDA使用该方法
    if (jwquyuID != null ) {
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
            if (autoS == 1 && sess()) sjerweima();
        }
        //铝锭
        if (q == "LD") {
            LD = '' + n;
            getclph();
            //重新打开红外线
            if (autoS == 1 && sess()) sjerweima();
        }
        //炉号
        if (q == "TL") {
            LH = '' + n;
            $("#LH").val(k);
            //重新打开红外线
            if (autoS == 1 && sess()) sjerweima();
        }
        //回料
        if (q == "CZT") {
            HL = '' + n;
            getclph();
            //重新打开红外线
            if (autoS == 1 && sess()) sjerweima();
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
    if (jwquyuID != null ) { return false; }
    db.hw({
        fun: function (ret, err) {
            //非连续扫描
            autoS = 0;
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
                    //铝锭
                    else if (val == "LD") {
                        LD = '' + n;
                        getclph();
                    }
                    //炉号
                    else if (val == "LH" && q == "TL") {
                        LH = '' + n;
                        $("#LH").val(k);
                    }
                    else if (val == "HL") {
                        //LH = '' + n;
                        //$("#LH").val(k);
                        HL = '' + n;
                        getclph();
                    }
                    else {
                        logMsgFun('二维码不正确！');
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
            //连续扫描
            autoS = 1;
            scancode(ret);
        }
    });
}
//在连续扫描状态下，是否已经完成了所有的扫描
//true：允许继续扫描，false：不允许继续扫描
function sess() {
    //if ($("#YZJ2").val() == '' || $("#YZJ1").val() == '' || $("#YG").val() == '' || $("#CP2").val() == '')
    //    //允许继续扫描
    //    return true;
    //不允许扫描
    return false;
}

//获取材料牌号
function getclph() {
    //类型判断，3为回料桶，其他为铝锭和手动选择，
    var phtype = '';
    if (type1Value == 3)
        phtype = HL;
    else
        phtype = LD;
    window.setTimeout(function () {
        db.ajax(function (ret, err) {
            //验证服务端是否执行正确，不正确则内部直接提示错误信息
            if (!db.dfc(ret)) return;
            var data = eval('(' + ret + ')');
            var das = data.msg.ds;
            if (das[0].status == "999999") {
                layer.msg(das[0].msg);
                return false;
            }
            if (das != undefined && das.length > 0) {
                //清空选项
                $("#CLPH").html('');
                $("#CLPH").append('<option value="0">请选择</option>');
                //循环获取数据
                for (var x in das) {
                    if (type1Value == 1) {
                        $("#CLPH").append('<option value="' + das[x].CLPHID + '" selected="selected">' + das[x].CLPHName + '</option>');
                        $("#ZL").val(das[x].ZL)
                        $("#HLT").hide();
                    }
                    else if (type1Value == 3) {

                        $("#CLPH").append('<option value="' + das[x].CLPHID + '" selected="selected">' + das[x].CLPHName + '</option>');
                        $("#ZL").val(das[x].ZL);
                        $("#HLT").html('回料桶信息：' + das[x].CLPHID);
                        $("#HLT").show();
                    }
                    else {
                        $("#CLPH").append('<option value="' + das[x].CLPHID + '">' + das[x].CLPHName + '</option>');
                        $("#HLT").hide();
                    }

                }
            }
        }, "gethuiliao", "post", {
            type1: type1Value, ld: phtype
        }, { title: '提交中', text: '请耐心等待...' });
    }, 500);
}
