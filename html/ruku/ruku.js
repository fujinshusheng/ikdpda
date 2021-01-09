
db.Data.set("quyuID", '86');
db.Data.set("quyuName", '');
//允许摇一摇
var yaoyiyao = true;
//初始
apiready = function () {
    //监听声音键
    db.syjt(function (ret, err) {
        erweima();
    });
    //触发了摇一摇事件
    api.addEventListener({
        name: 'shake'
    }, function (ret, err) {
        if (yaoyiyao) {
            //不允许摇一摇打开了
            yaoyiyao = false;
            erweima();
        }
    });
    getcp();
    //
    window.setTimeout(function () {
        getck(); }, 500);
}

//获取原材料仓库
function getck() {
    //alert(db.getCurrentUser().quyuId);
    db.submit("getyclck1", {
        BLCompanyID: db.getCurrentUser().quyuId
    }, function (ret, err) {
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
//选择
function xuanz(dom) {
    $("#mingc").val('' + $(dom).find("option:selected").attr("FShortName"));
}
//获取车牌
function getcp() {
    db.submit("getcp2", {
        BLCompanyID: db.getCurrentUser().quyuId
    }, function (ret, err) {
        //alert(ret);
        try {
        } catch (e) { }
        var data = eval('(' + ret + ')');
        var das = data.msg.ds;
        if (das != undefined && das.length > 0) {
            //循环
            for (var x in das) {
                $("#cp").append('<option value="' + das[x].id + '" FShortName="' + das[x].FShortName + '">' + das[x].name + '</option>');
            }
        }
    });
}
//提交表单
function submitFun() {
    if ($("#cp").val() == "0" || $("#luh").val() == "" || $("#zhongl").val() == "" || $("#tiaos").val() == "" || $("#paihName").val() == "" || $("#xulieh").val() == "") {
        logMsgFun('内容异常，请检查后提交！');
        return;
    }
    //alert(JSON.stringify(parms));
    db.ajax(function (ret, err) {
        //验证服务端是否执行正确，不正确则内部直接提示错误信息
        if (!db.dfc(ret)) return;
        //alert(ret);
        var data = eval('(' + ret + ')');
        var das = data.msg.ds;
        var status = das[0].status, msg = das[0].msg;
        if (status == '000000') {
            //清空
            $("#luh").val('');
            //
            $("#zhongl").val('');
            //
            $("#tiaos").val('');
            //
            $("#paih").val('');
            $("#paihName").val('');
            //
            $("#xulieh").val('');
        }
        logMsgFun(msg);
    }, "lvdingruku1", "post", {
        luh: $("#luh").val(),
        zhongl: $("#zhongl").val(),
        tiaos: $("#tiaos").val(),
        paih: $("#paih").val(),
        xulieh: $("#xulieh").val(),
        FCreater: db.login.Userid(),
        cp: $("#cp").val(),
        ck: $("#ck").val(),
        BLCompanyID: db.getCurrentUser().quyuId
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
    if (ret) {
        var ewm = eval('(' + ret + ')');
        //
        var q = db.Data.JsonGet(ewm, "q", "");
        var n = db.Data.JsonGet(ewm, "n", "");
        var k = db.Data.JsonGet(ewm, "k", "");
        var g = db.Data.JsonGet(ewm, "g", "");
        k = (k == '' ? n : k);
        if (q != "LD") {
            logMsgFun('请扫描正确的铝锭二维码！');
            return;
        }

        //炉号（录入）+牌号（选择）+重量（录入）+根数 （录入）+供应商名称（系统自动配置好的）+唯一序列号（系统自动生成,MD5(GUID)实现唯一）
        //{"q":"LD","a1":"供应商名称","a2":"炉号","a3":"重量","a4":"条数","a5":"牌号","n":"序列号","k":"序列号"}
        //清空
        $("#luh").val('' + db.Data.JsonGet(ewm, "a2", ""));
        //
        $("#zhongl").val('' + db.Data.JsonGet(ewm, "a3", ""));
        //
        $("#tiaos").val('' + db.Data.JsonGet(ewm, "a4", ""));
        //材料牌号编号
        $("#paih").val('' + db.Data.JsonGet(ewm, "a5", ""));
        //
        $("#xulieh").val('' + db.Data.JsonGet(ewm, "n", ""));
        //--------------获取材料牌号名称  begin---------------
        db.submit("getclphname", { FCLPH: $("#paih").val() }, function (ret, err) {
            var data = eval('(' + ret + ')');
            var das = data.msg.ds;
            try {
                if (das.length > 0) {
                    //材料牌号名称
                    $("#paihName").val('' + das[0].name);
                }
            } catch (ee1) {
                $("#paihName").val('');
            }
        });

        //--------------获取材料牌号名称  end---------------
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
            //允许摇一摇打开
            yaoyiyao = true;
            if (ret) {
                var ewm = eval('(' + ret + ')');
                //
                var q = db.Data.JsonGet(ewm, "q", "");
                var n = db.Data.JsonGet(ewm, "n", "");
                var k = db.Data.JsonGet(ewm, "k", "");
                var g = db.Data.JsonGet(ewm, "g", "");
                k = (k == '' ? n : k);
                if (q != "LD") {
                    logMsgFun('请扫描正确的铝锭二维码！');
                    return;
                }

                //炉号（录入）+牌号（选择）+重量（录入）+根数 （录入）+供应商名称（系统自动配置好的）+唯一序列号（系统自动生成,MD5(GUID)实现唯一）
                //{"q":"LD","a1":"供应商名称","a2":"炉号","a3":"重量","a4":"条数","a5":"牌号","n":"序列号","k":"序列号"}
                //清空
                $("#luh").val('' + db.Data.JsonGet(ewm, "a2", ""));
                //
                $("#zhongl").val('' + db.Data.JsonGet(ewm, "a3", ""));
                //
                $("#tiaos").val('' + db.Data.JsonGet(ewm, "a4", ""));
                //材料牌号编号
                $("#paih").val('' + db.Data.JsonGet(ewm, "a5", ""));
                //
                $("#xulieh").val('' + db.Data.JsonGet(ewm, "n", ""));
                //--------------获取材料牌号名称  begin---------------
                db.submit("getclphname", { FCLPH: $("#paih").val() }, function (ret, err) {
                    var data = eval('(' + ret + ')');
                    var das = data.msg.ds;
                    try {
                        if (das.length > 0) {
                            //材料牌号名称
                            $("#paihName").val('' + das[0].name);
                        }
                    } catch (ee1) {
                        $("#paihName").val('');
                    }
                });

                //--------------获取材料牌号名称  end---------------
            }
        }
    });
}