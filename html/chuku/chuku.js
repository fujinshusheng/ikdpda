//初始
apiready = function () {
    //监听声音键
    db.syjt(function (ret, err) {
        sjerweima();
    });

    //出库仓库
    chukucangku();
    //显示提交操作按钮
    $(".btn-submit").show();
    setInterval(function () {
        var date = new Date();
        $('#FDate').val(date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
		+ " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds());
    }, 1000);
}
//提交表单
function submitFun() {
    if (YGNumber <= 0) {
        logMsgFun('请扫描领料员！');
        return;
    }
    if (LDNumber <= 0) {
        logMsgFun('请扫描铝锭二维码！');
        return;
    }
    if ($("#FIWorkShipID").val() == "0" || $("#FIWorkShipID").val() == null || $("#FIWorkShipID").val() == "") {
        logMsgFun('请选择领料车间！');
        return;
    }
    if ($("#FOWorkShipID").val() == "0" || $("#FOWorkShipID").val() == "") {
        logMsgFun('请选择出库仓库！');
        return;
    }
    //需要传递的参数
    var parms = {
        FEmplNameLL: YGNumber,
        FOWorkShipID: $("#FOWorkShipID").val(),
        FLDNumber: LDNumber,
        FCLPH: $("#FCLPH_ID").val(),
        FIWorkShipID: $("#FIWorkShipID").val(),
        FCreater: db.login.Userid(),
        BLCompanyID: db.getCurrentUser().quyuId
    };
    //alert(JSON.stringify(parms));
    db.ajax(function (ret, err) {
        //alert(ret);
        //验证服务端是否执行正确，不正确则内部直接提示错误信息
        if (!db.dfc(ret)) return;
        //
        var data = eval('(' + ret + ')');
        var das = data.msg.ds;
        var status = das[0].status, msg = das[0].msg;
        if (status == '000000') {
            try {
                if (das[0].FCode != undefined && das[0].FName != undefined) {
                    db.submitKK(das[0].FCode, das[0].FName, function (ret1, err1) {
                        //alert('成功进入跨库操作');
                        //alert(ret1);
                        //验证服务端是否执行正确，不正确则内部直接提示错误信息
                        if (!db.dfc(ret1)) return;
                        //
                        var data1 = eval('(' + ret1 + ')');
                        if (data1.msg.ds != null) {
                            var das1 = data1.msg.ds;
                            var status1 = das1[0].status, msg1 = das1[0].msg;
                            if (status1 != '000000') { alert('跨库执行错误，请联系IT部门！'); }
                        }
                    });
                }
            } catch (e) {}
            logMsgFun(msg);
            //清空铝锭编号
            LDNumber = 0;
            //清空铝锭内容
            $("#FLDNumber").val('');
            //清空材料牌号
            $("#FCLPH").val('');
            //清空出库仓库
            //$("#FOWorkShipID").html('');
            //清空领料人编号
            YGNumber = 0;
            //清空领料人名称
            $("#FEmplNameLL").val('');
            //清空领料人编号
            $("#YGCJ").val('');
            //清空领料车间
            $("#FIWorkShipID").html('');
        } else if (status == '111111') {
            logMsgFun(msg);
        } else if (status == '222222') {
            logMsgFun(msg);
        } else if (status == '333333') {
            logMsgFun(msg);
        } else if (status == '777777') {
            logMsgFun(msg);
        } else logMsgFun(msg);

    }, "insertoutdeliver", "post", parms, { title: '提交中', text: '请耐心等待...' });
}
/***********************************二维码扫描 开始**********************************/
//在连续扫描状态下，是否已经完成了所有的扫描
//true：允许继续扫描，false：不允许继续扫描
function sess() {
    if ($("#FEmplNameLL").val() == '' || $("#FLDNumber").val() == '')
        //允许继续扫描
        return true;
    //不允许扫描
    return false;
}
//0表示一次扫描一次关闭   1表示连续扫描

var autoS = 0;

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

//扫描二维码,指定某个输入框进行传值
function erweima(type) {
    //区域编号
    var jwquyuID = db.Data.get("quyuID");
    //3号厂的TC20PDA使用该方法
    if (jwquyuID != null) { return false; }
    db.hw({
        fun: function (ret, err) {
            //非连续扫描
            autoS = 0;
            if (ret) {
                //解析扫描后的数据
                db.Data.erweimajiexi(ret, type, function (n, k) {
                    if (type == "YG") {
                        //解析员工信息
                        YGFUN(n, k, ret);
                    } else if (type == "LD") {
                        //解析铝锭信息
                        LDFUN(n, k, ret);
                    }
                });
            }
        }
    });
    //FNScanner.openScanner({autorotation: true}, );
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
    db.Data.sjerweimajiexi(ret, function (p, n, k) {
        if (p == "YG") {
            //解析员工信息
            YGFUN(n, k, ret);
        } else if (p == "LD") {
            //解析铝锭信息
            LDFUN(n, k, ret);
        }
    });
}




//员工编号，扫描员工二维码时传入，提交按钮需要把这个变量的值传到服务器
var YGNumber = 0;
//员工二维码解析   n:编号, k:需要显示的名称,content：实际扫描的内容
function YGFUN(n, k, content) {
    YGNumber = n;
    //远程数据请求
    db.ajax(function (ret, err) {
        //验证服务端是否执行正确，不正确则内部直接提示错误信息
        if (!db.dfc(ret)) return;

        var data = eval('(' + ret + ')');
        var das = data.msg.ds;

        //获取铝锭相关信息
        if (das.length <= 0) {
            logMsgFun("当前操作工并非领料车间工作人员，请手动选择领料车间！");
            return;
        }
        $("#FEmplNameLL").val('' + k);
        //领料车间编号
        FIWorkShipIDDefaultValueID = das[0].FDepaID;
        //显示当前员工所属车间
        $("#YGCJ").val('' + das[0].FDepaName);
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
            $("#FIWorkShipID option[value='" + FOWorkShipIDDefaultValueID + "']").attr("selected", true);
        }
        //bindCKData();
        //----------------------------------------------------------
        //重新打开红外线
        if (autoS == 1 && sess()) sjerweima();
    }, "m_getcj", "post", { FEmplID: n }, { title: '读取中', text: '请耐心等待...' });
}
//铝锭编号，扫描铝锭二维码时传入，提交按钮需要把这个变量的值传到服务器
var LDNumber = 0;
//铝锭二维码解析   n:编号, k:需要显示的名称,content：实际扫描的内容
function LDFUN(n, k, content) {
    if (n == "") return;
    LDNumber = n;
    //远程数据请求
    db.ajax(function (ret, err) {
        //验证服务端是否执行正确，不正确则内部直接提示错误信息
        if (!db.dfc(ret)) return;

        var data = eval('(' + ret + ')');
        var das = data.msg.ds;

        //获取铝锭相关信息
        if (das.length <= 0) {
            logMsgFun("该二维码暂无绑定实际铝锭材料。");
            return;
        }
        //显示铝锭序列号名称
        $("#FLDNumber").val('' + k);
        //仓库编号
        FOWorkShipIDDefaultValueID = das[0].FIWorkShipID;
        //设置选中当前铝锭的出库仓库
        $("#FOWorkShipID option[value='" + FOWorkShipIDDefaultValueID + "']").attr("selected", true);
        //材料牌号名称
        $("#FCLPH").val(das[0].FName);
        //材料牌号编号
        $("#FCLPH_ID").val(das[0].FCLPH);
        //检测先进先出
        MS_XJXCFUN();
        //重新打开红外线
        if (autoS == 1 && sess()) sjerweima();
    }, "getdatabyldcode", "post", { FLDNumber: n }, { title: '读取中', text: '请耐心等待...' });
}
//检测先进先出
function MS_XJXCFUN() {
    db.submit('MS_XJXC', {
        BLCompanyID: db.getCurrentUser().quyuId,
        LDCODE: LDNumber,
        CLPH: $("#FCLPH_ID").val()
    }, function (ret, err) {
        //验证服务端是否执行正确，不正确则内部直接提示错误信息
        if (!db.dfc(ret)) return;
        //
        var data = eval('(' + ret + ')');
        var das = data.msg.ds;
        if (das[0].status != '000000') {
            layer.open({
                icon: 2, area: ['85%', 'auto'], title: '系统信息', btn: ['关 闭'],
                content: '<div style="font-size:18px;padding:20px;">' + das[0].msg + '</div>'
            });
            //layer.msg(das[0].msg, { icon: 2, area: ['500px', 'auto'] });
        }
    });
}

/***********************************二维码扫描 结束**********************************/
//存储仓库数据 
var CKData = null;
//出库仓库默认值，领料仓库默认值
var FOWorkShipIDDefaultValueID = '', FIWorkShipIDDefaultValueID = '';
//绑定仓库
function chukucangku() {
    $("#FOWorkShipID").html('<option value="0">--请选择--</option>');
    $("#FIWorkShipID").html('<option value="0">--请选择--</option>');
    //第一次没数据时，去取一次数据
    if (CKData == null) {
        db.ajax(function (ret, err) {
            //验证服务端是否执行正确，不正确则内部直接提示错误信息
            if (!db.dfc(ret)) return;

            var data = eval('(' + ret + ')');
            CKData = data.msg.ds;
            bindCKData();
        }, "getCKlist", "post", {
            BLCompanyID: db.getCurrentUser().quyuId
        }, { J: 1 });
    } else {
        bindCKData();
    }
}
//把数据绑定到界面的元素中（有一些浏览器不兼容所以必须每次进行遍历）
function bindCKData() {
    for (var x in CKData) {
        //出库仓库
        if (CKData[x].FWorkShipType == 'JWL') {
            $("#FOWorkShipID").append("<option value='" + CKData[x].FID + "'>" + CKData[x].FWorkName + "</option>");
        }
        //领料车间
        if (CKData[x].FWorkShipType == 'CJ') {
            //$("#FIWorkShipID").append("<option value='" + CKData[x].FID + "'>" + CKData[x].FWorkName + "</option>");
        }
    }
    //设置选中当前铝锭的出库仓库
    $("#FOWorkShipID option[value='" + FOWorkShipIDDefaultValueID + "']").attr("selected", true);
    //设置选中当前领料车间的仓库
    $("#FIWorkShipID option[value='" + FIWorkShipIDDefaultValueID + "']").attr("selected", true);
}