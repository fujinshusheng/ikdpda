
//0表示一次扫描一次关闭   1表示连续扫描
var autoS = 0;
//铝锭编号,员工编号,炉号
var LD = '', YG = '', LH = '';

apiready = function () {
    //监听声音键
    db.syjt(function (ret, err) {
        sjerweima();
    });
}
$(function () {
    //获取材料牌号
    getclph();
})
//允许提交
var cftj = 1;
function submitFun() {
    if ($("#CLPH").val() == '' || $("#CLPH").val() == '0') {
        logMsgFun('请选择材料牌号或扫描正确的铝锭二维码');
        return;
    }
    if ($("#ZL").val() == '') {
        logMsgFun('请输入重量');
        return;
    }
    if ($("#jbl").val() == '') {
        logMsgFun('请扫描保温炉二维码');
        return;
    }
    //不允许提交
    cftj = 0;
    db.submit('M_UptBWLTJPL', {
        clph: $("#CLPH").val(), BWL: $("#jblID").val(),
        BLCompanyID: db.getCurrentUser().quyuId,
        czry: $("#YGID").val(), userid: db.login.Userid(), zl: $("#ZL").val()
    }, function (ret, err) {
        //允许提交
        cftj = 1;
        //验证服务端是否执行正确，不正确则内部直接提示错误信息
        if (!db.dfc(ret)) return;

        var data = eval('(' + ret + ')');
        var das = data.msg.ds;
        var status = das[0].status, msgs = das[0].msg;
        if (status == '000000') {
            $("#ZL").val('');
            $("#YG").val('');
            $("#YGID").val('');
            $("#jbl").val('');
            $("#jblID").val('');
            $("#CLPH option").eq(0).attr('selected','selected');
        } else {
            //db.Ts.alert({msg:msgs});
        }
        logMsgFun(msgs);
    });
}



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


//普通扫描二维码
function erweima(val) {
    var jwquyuID = db.Data.get("quyuID");
    //3号厂的TC20PDA使用该方法
    if (jwquyuID!=null) { return false;}
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

                    if (val == "YG" && q == "YG") {
                        //员工
                        $("#YGID").val('' + n);
                        $("#YG").val('' + k);
                    }
                    else if (val == "BW" && q == "BW") {
                        //保温炉
                        $("#jblID").val('' + n);
                        $("#jbl").val('' + k);
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

function scancode(ret) {
    try {
        var ewm = eval('(' + ret + ')');
        var q = db.Data.JsonGet(ewm, "q", "");
        var n = db.Data.JsonGet(ewm, "n", "");
        var k = db.Data.JsonGet(ewm, "k", "");
        k = (k == '' ? n : k);

        if (q == 'YG') {
            //员工
            $("#YGID").val('' + n);
            $("#YG").val('' + k);
            //重新打开红外线
            if (autoS == 1 && sess()) sjerweima();
        }
        if (q == "BW") {
            //机边炉
            $("#jblID").val('' + n);
            $("#jbl").val('' + k);
            //重新打开红外线
            if (autoS == 1 && sess()) sjerweima();
        }
    } catch (e) {
        //alert("数据异常");
    }
}



//在连续扫描状态下，是否已经完成了所有的扫描
//true：允许继续扫描，false：不允许继续扫描
function sess() {
    if ($("#jbl").val() == '' || $("#YG").val() == '')
        //允许继续扫描
        return true;
    //不允许扫描
    return false;
}

//获取材料牌号
function getclph() {
    window.setTimeout(function () {
        db.submit('M_GetBWLCLPH', {}, function (ret, err) {
            //验证服务端是否执行正确，不正确则内部直接提示错误信息
            if (!db.dfc(ret)) return;

            var data = eval('(' + ret + ')');
            var das = data.msg.ds;

            if (das != undefined && das.length > 0) {
                //清空选项
                $("#CLPH").html('');
                $("#CLPH").append('<option value="0">请选择</option>');
                //循环获取数据
                for (var x in das) {
                    $("#CLPH").append('<option value="' + das[x].CLPHID + '">' + das[x].CLPHName + '</option>');
                }
            }
        });
    }, 500);
}