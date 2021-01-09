//初始
apiready = function () {
    //监听声音键
    db.syjt(function (ret, err) {
        erweima();
    });
    //获取材料牌号
    db.submit("getclph2", {}, function (ret, err) {
        try {
            var data = eval('(' + ret + ')');
            var das = data.msg.ds;
            if (das != undefined && das.length > 0) {
                //循环
                for (var x in das) {
                    $("#paih").append('<option value="' + das[x].id + '">' + das[x].Name + '</option>');
                }
            }
        } catch (e) { }
    });
    //
    window.setTimeout(function () { getck(); }, 500);

}
//获取原材料仓库
function getck() {
    db.submit("getyclck1", { BLCompanyID: db.getCurrentUser().quyuId }, function (ret, err) {
        try {
            var data = eval('(' + ret + ')');
            var das = data.msg.ds;
            if (das != undefined && das.length > 0) {
                //循环
                for (var x in das) {
                    $("#ck").append('<option value="' + das[x].id + '">' + das[x].name + '</option>');
                }
            }
        } catch (e) { }
    });
}

//提交表单
function submitFun() {
    if ($("#zhongl").val() == "0" || $("#paih").val() == "" || $("#xulieh").val() == "") {
        logMsgFun('内容异常，请检查后提交！');
        return;
    }
    //alert(JSON.stringify(parms));
    db.ajax(function (ret, err) {
        //验证服务端是否执行正确，不正确则内部直接提示错误信息
        if (!db.dfc(ret)) return;

        var data = eval('(' + ret + ')');
        var das = data.msg.ds;
        var status = das[0].status, msg = das[0].msg;
        if (status == '000000') {
            logMsgFun(msg);
            //清空
            $("#zhongl").val('');
            //
            //$("#paih option").eq(0).attr("selected", "selected");
            //
            $("#xulieh").val('');
        } else logMsgFun(msg);
    }, "lvdingpandtij", "post", {
        zl: $("#zhongl").val(),
        ph: $("#paih").val(),
        xlh: $("#xulieh").val(),
        ck: $("#ck").val(),
        FKW: $("#FKW").val(),
        BLCompanyID: db.getCurrentUser().quyuId
    }, { title: '提交中', text: '请耐心等待...' });
}

//扫描二维码,指定某个输入框进行传值
function erweima() {
    //区域编号
    var jwquyuID = db.Data.get("quyuID");
    //3号厂的TC20PDA使用该方法
    if (jwquyuID != null ) { return false; }
    db.hw({
        fun: function (ret, err) {
            if (ret) {
                var ewm = eval('(' + ret + ')');
                //
                var q = db.Data.JsonGet(ewm, "q", "");
                var n = db.Data.JsonGet(ewm, "n", "");
                var k = db.Data.JsonGet(ewm, "k", "");
                k = (k == '' ? n : k);

                if (q == "KW") {
                    $("#FKW").val(n);
                    return;
                }
                if (q != "LD") {
                    logMsgFun('请扫描正确的铝锭二维码！');
                    return;
                }
                $("#xulieh").val('' + db.Data.JsonGet(ewm, "n", ""));
            }
        }
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
    try {
        var ewm = eval('(' + ret + ')');
        var q = db.Data.JsonGet(ewm, "q", "");
        var n = db.Data.JsonGet(ewm, "n", "");
        var k = db.Data.JsonGet(ewm, "k", "");
        k = (k == '' ? n : k);



        if (q == "KW") {
            $("#FKW").val(n);
            return;
        }
        if (q != "LD") {
            logMsgFun('请扫描正确的铝锭二维码！');
            return;
        }
        $("#xulieh").val('' + db.Data.JsonGet(ewm, "n", ""));


    } catch (e) {
        //alert("数据异常");
    }
}