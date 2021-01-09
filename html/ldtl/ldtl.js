//初始
apiready = function () {
    //监听声音键
    db.syjt(function (ret, err) {
        erweima();
    });
    window.setTimeout(function () { getck(); }, 500);
}
$(function () {
    showDom();
})
//需要显示的元素
function showDom() {
    //材料牌号
    $("#CLPHdiv").hide();
    //重量
    $("#zldiv").hide();
    //退料车间
    $("#FIWorkShipIDdiv").hide();

    if (type1Value == 1) {
        //手动
        $("#CLPHdiv").show();
        $("#zldiv").show();
        $("#FIWorkShipIDdiv").show();
        $("#msg1").html('');
        //显示返回的内容
        $("#msg1div").hide();
        getclph();
    } else {
        //getclph();
        //显示返回的内容
        $("#msg1div").show();
    }
    //清空铝锭的数据
    $("#ld").val('');
    $("#ldID").val('');
}

//员工二维码解析   n:编号, k:需要显示的名称,content：实际扫描的内容
function YGFUN(n, k, content) {
    //远程数据请求
    db.ajax(function (ret, err) {
        //验证服务端是否执行正确，不正确则内部直接提示错误信息
        if (!db.dfc(ret)) return;

        var data = eval('(' + ret + ')');
        var das = data.msg.ds;

        //获取铝锭相关信息
        if (das.length <= 0) {
            logMsgFun("当前操作工并非领料车间工作人员！");
            return;
        }
        //领料车间编号
        var _FIWorkShipIDDefaultValueID = das[0].FDepaID;
        //显示当前员工所属车间
        //$("#YGCJ").val('' + das[0].FDepaName);
        //----------------------------------------------------------
        //先清空列表
        $("#FIWorkShipID").html('');
        //当前员工允许领料给哪些车间
        var das1 = data.msg.ds1;
        //是否有数据
        if (das1 != undefined && das1.length > 0) {
            //添加数据
            for (var x in das1) {
                $("#FIWorkShipID").append("<option value='" + das1[x].FWorkID + "'>" + das1[x].FWorkName + "</option>");
            }
            //设置选中当前铝锭的出库仓库
            $("#FIWorkShipID option[value='" + _FIWorkShipIDDefaultValueID + "']").attr("selected", true);
        }
        //----------------------------------------------------------
    }, "m_getcj", "post", { FEmplID: n }, { title: '读取中', text: '请耐心等待...' });
}
//获取原材料仓库
function getck() {
    db.submit("getyclck1", {
        BLCompanyID: db.getCurrentUser().quyuId
    }, function (ret, err) {
        try {
            var data = eval('(' + ret + ')');
            var das = data.msg.ds;
            if (das != undefined && das.length > 0) {
                $("#ck").html('');
                //$("#ck").append('<option value="0">请选择</option>');
                //循环
                for (var x in das) {
                    $("#ck").append('<option value="' + das[x].id + '">' + das[x].name + '</option>');
                }
            }
        } catch (e) { }
    });
}

//获取材料牌号
function getclph() {
    db.submit("getcailpaihao", {
        type1: 2, ld: ''
    }, function (ret, err) {
        //验证服务端是否执行正确，不正确则内部直接提示错误信息
        if (!db.dfc(ret)) return;

        var data = eval('(' + ret + ')');
        var das = data.msg.ds;

        if (das != undefined && das.length > 0) {
            //清空选项
            $("#CLPH").html('');
            $("#CLPH").append('<option value="0">请选择</option>');
            //循环获取数据
            for (var x in das)
                $("#CLPH").append('<option value="' + das[x].CLPHID + '">' + das[x].CLPHName + '</option>');
        }
    });
}
//提交表单
function submitFun() {
    if ($("#ck").val() == "0" || $("#czg").val() == "") {
        logMsgFun('内容异常，请检查后提交！');
        return;
    }
    db.Ts.jiazaiShow();
    //alert(JSON.stringify(parms));
    db.submit("submittl4", {
        ck: $("#ck").val(),
        czg: $("#czgID").val(),
        ld: $("#ldID").val(),
        FKW: $("#FKW").val(),
        userid: db.login.Userid(),
        BLCompanyID: db.getCurrentUser().quyuId,
        ZL: $("#ZL").val(),
        CLPH: $("#CLPH").val(),
        type1: type1Value,
        FIWorkShipID: $("#FIWorkShipID").val()
    }, function (ret, err) {
        db.Ts.jiazaiHide();
        //验证服务端是否执行正确，不正确则内部直接提示错误信息
        if (!db.dfc(ret)) return;

        var data = eval('(' + ret + ')');
        var das = data.msg.ds;
        var status = das[0].status, msg = das[0].msg;
        if (status == '000000') {
            try {
                if (das[0].FCode != undefined && das[0].FName != undefined) {
                    db.submitKK(das[0].FCode, das[0].FName, function (ret1, err1) {
                        //验证服务端是否执行正确，不正确则内部直接提示错误信息
                        if (!db.dfc(ret1)) return;
                        //
                        var data1 = eval('(' + ret1 + ')');
                        var das1 = data1.msg.ds;
                        var status1 = das1[0].status, msg1 = das1[0].msg;
                        if (status1 != '000000') { alert('跨库执行错误，请联系IT部门！'); }
                    });
                }
            } catch (e) { }

            //清空
            $("#ck option").eq(0).attr('selected', 'selected');
            $("#czg").val('');
            $("#czgID").val('');
            $("#ld").val('');
            $("#ldID").val('');
            $("#ZL").val('');
            $("#CLPH option").eq(0).attr('selected', 'selected');
            $("#FIWorkShipID option").eq(0).attr('selected', 'selected');
        }
        logMsgFun(msg);
    });
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
    if (ret) {
        var ewm = eval('(' + ret + ')');
        var q = db.Data.JsonGet(ewm, "q", "");
        var n = db.Data.JsonGet(ewm, "n", "");
        var k = db.Data.JsonGet(ewm, "k", "");
        k = (k == '' ? n : k);
        if (q == 'KW') {
            $("#FKW").val('' + n);
            return;
        }
        if (q == "LD") {
            $("#ld").val('' + k);
            $("#ldID").val('' + n);
            //---------------------------------
            //扫描状态时执行
            if (type1Value == 2) {
                db.submit("getldmsg", { ld: n }, function (ret4, err4) {
                    try {
                        var data = eval('(' + ret4 + ')');
                        var das = data.msg.ds;
                        $("#msg1").html('');
                        if (das.length > 0)
                            $("#msg1").html('' + das[0].msg);
                        else
                            $("#msg1").html('' + das[0].msg);
                    } catch (e) { }
                });
            }
            //---------------------------------
            return;
        }
        if (q == "YG") {
            $("#czg").val('' + k);
            $("#czgID").val('' + n);
            YGFUN(n, k);
            return;
        }
    }
}
//扫描二维码,指定某个输入框进行传值
function erweima() {
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

