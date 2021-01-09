var Save = true, ex = "";
//0表示一次扫描一次关闭   1表示连续扫描
var autoS = 0;
//投料口编号，投料类型，投料信息
var data_n = "", TLLX = '', TLV = '', FTLKNumber = '';
apiready = function () {
    //监听声音键
    db.syjt(function (ret, err) {
        sjerweima();
    });
}
function submitFun() {
    if ($("#inp1").val() == '') {
        logMsgFun('请扫描投料口二维码');
        return;
    }
    if ($("#inp2").val() == '') {
        logMsgFun('请扫描投料操作工二维码');
        return;
    }
    if ($("#inp3").val() == '') {
        logMsgFun('请扫描铝锭/标准桶二维码序列号');
        return;
    }

    db.ajax(function (ret, err) {
        //验证服务端是否执行正确，不正确则内部直接提示错误信息
        if (!db.dfc(ret)) return;

        var data = eval('(' + ret + ')');
        var das = data.msg.ds;
        var status = das[0].status, msgs = das[0].msg;
        if (status == '666666') {
            cttl(msgs);
        } else if (status == '333333') {
            wkl(msgs);
        } else {
            logMsgFun(msgs);
            //db.Ts.alert({ msg: msgs });
            $("#inp3").val("");
            $("#inp1").val("");

            //投料口输入框宽度
            $("#inp1").css({ "width": "255px" });
            //撤销按钮
            $("#cxid1").hide();
        }

    }, "insertZS_Feeding", "post", {
        FTLKNumber: db.Data.get("TL"),//投料
        FTLYGNnmber: db.Data.get("YG"),//员工
        TLLX: TLLX,//投料类型
        FCreater: db.login.Userid(),//操作人
        TLV: TLV//投料信息
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
        //投料
        if (q == "TL") {
            data_n = n;
            db.Data.set("TL", n);
            $("#inp1").val(k);
            GetSave();//修改状态数据
        }

        //员工
        if (q == "YG") {
            db.Data.set("YG", n);
            $("#inp2").val(k);
            //重新打开红外线
            if (autoS == 1 && sess()) sjerweima();
        }

        //铝锭
        if (q == "LD" || q == "CZT") {
            //投料类型，
            TLLX = q;
            //投料信息
            TLV = n;
            $("#inp3").val(k);
            //获取材料牌号
            getCLPH(n, q, function (val) {
                var arrs = val.split(",");
                $("#CLPH").html('材料牌号:' + arrs[0]);
                $("#ZL").html(arrs[1]);
               
            });
            //重新打开红外线
            if (autoS == 1 && sess()) sjerweima();
        }
    } catch (e) {
        //alert("数据异常");
    }
}
//普通扫描二维码
function erweima(val, type) {
    //区域编号
    var jwquyuID = db.Data.get("quyuID");
    //3号厂的TC20PDA使用该方法
    if (jwquyuID != null) { return false; }
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
                    //投料
                    if (q == "TL") {
                        data_n = n;
                        db.Data.set("TL", n);
                        $("#inp1").val(k);
                        //等于投料二维码才请求数据
                        GetSave();
                    }

                    //员工
                    if (q == "YG") {
                        db.Data.set("YG", n);
                        $("#inp2").val(k);
                    }

                    //铝锭+桶
                    if (q == "LD" || q == "CZT") {
                        //投料类型，
                        TLLX = q;
                        //投料信息
                        TLV = n;
                        $("#inp3").val(k);
                        //获取材料牌号
                        getCLPH(n, q, function (val) {
                            var arrs = val.split(",");
                            $("#CLPH").html('材料牌号:' + arrs[0]);
                            $("#ZL").html(arrs[1]);

                        });
                    }
                } catch (e) {
                    //logMsgFun("数据异常");
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
//是否获取炉批次号
var islupicihao = '';
//获取当前炉号的炉批次号
function huoqulupicihaoapp(fcodeN) {
    if (islupicihao == '') return false;
    db.submit('huoqulupicihaoapp', { FCode: fcodeN, Ftype: 0 }, function (ret, err) {
        try {
            var data = eval('(' + ret + ')');
            var datas = db.Data.JsonGet(data, "msg", "");
            if (datas.ds.length > 0) {
                var Flpch = db.Data.JsonGet(datas.ds[0], "Flpch", "");
                //获取炉批次号
                if (Flpch != ""){
					
				}
				 //alert('' + islupicihao + Flpch);// $("#lpch").html('炉批次号:' + Flpch);
            }
        } catch (e) {
            logMsgFun("炉批次号获取异常，请联系IT部门。error:" + e);
        }
    });
}
//检测当前投料
function GetSave() {
    db.ajax(function (ret, err) {
        //验证服务端是否执行正确，不正确则内部直接提示错误信息
        if (!db.dfc(ret)) return;

        var data = eval('(' + ret + ')');

        var datas = db.Data.JsonGet(data, "msg", "");
        if (datas.ds.length <= 0) {
            logMsgFun("数据库不存在当前二维码");
            return;
        }
        //不获取炉批次号
        islupicihao = '';

        ////允许出汤
        //if (db.Data.JsonGet(datas.ds[0], "FStatus", "") == "2") {
        //    //修改状态
        //    UpdateSt();
        //} 
        if (db.Data.JsonGet(datas.ds[0], "FStatus", "") == "3") {
            //未开炉
            wkl();
        } else if (db.Data.JsonGet(datas.ds[0], "FStatus", "") == "6") {
            //正在出汤
            ZZCT();
        } else if (db.Data.JsonGet(datas.ds[0], "FStatus", "") == "7") {
            //正在维修
            zzwx();
        } else
            //重新打开红外线
            if (autoS == 1 && sess()) sjerweima();
    }, "getTLstatusbyTLNO", "post", {
        FCode: data_n
    }, {
        title: '读取中'
    });
}

//正在维修
function zzwx(msg) {
    db.Ts.confirm({
        title: '温馨提示', msg: '当前投料口正在维修，是否投料？',
        buttons: ['是的', '取消']
    }, function (ret, err) {
        var but = ret.buttonIndex;
        if (but == 1) {
            //执行数据
            db.ajax(function (ret, err) {
                //验证服务端是否执行正确，不正确则内部直接提示错误信息
                if (!db.dfc(ret)) return;

                var data = eval('(' + ret + ')');

                var datas = db.Data.JsonGet(data, "msg", "");
                if (datas.ds.length <= 0) {
                    logMsgFun("操作失败");
                    return;
                }

                if (db.Data.JsonGet(datas.ds[0], "Column1", "") != "") {
                    //logMsgFun('允许投料');
                    //获取炉批次号
                    islupicihao = '允许投料\n';
                    //获取当前炉号的炉批次号
                    huoqulupicihaoapp(data_n);
                    return;
                }
            }, "updateTLStatus", "post", { FCode: data_n, Status: 1 }, { title: '正在执行' });
        }
    });
}
//撤销
function chexiao() {
    //执行数据
    db.ajax(function (ret, err) {
        var data = eval('(' + ret + ')');
        var das = data.msg.ds;
        var status = das[0].status, msg = das[0].msg;
        //提示信息
        logMsgFun(msg);
        if (status == '000000') {
            //投料口输入框宽度
            $("#inp1").css({ "width": "255px" });
            //撤销按钮
            $("#cxid1").hide();
        }
    }, "m_chejxiao", "post", {
        LH: data_n
    }, {
        title: '正在执行'
    });
}
//正在出汤，提示是否投料
function cttl(msg) {
    if (msg == undefined) msg = '正在出汤，是否投料？';
    db.Ts.confirm({ title: '温馨提示', msg: '' + msg, buttons: ['是的', '取消'] },
    function (ret, err) {
        if (ret.buttonIndex != 1) return;
        //执行数据
        db.ajax(function (ret, err) {
            var data = eval('(' + ret + ')');
            if (db.Data.JsonGet(data, "status", "") != "200") {
                logMsgFun('执行操作失败，请重新操作！');
                return;
            } else {
                //若无意中点击了“是的”，则显示撤销按钮。
                //投料口输入框宽度
                $("#inp1").css({ "width": "170px" });
                //撤销按钮
                $("#cxid1").show();
            }
        }, "updateTLStatus", "post", { FCode: data_n, Status: 1 }, { title: '正在执行' });
    });
}
//未开卢，提示开卢
function wkl(msg) {
    if (msg == undefined) msg = '此投料口未开炉，是否开炉？';
    db.Ts.confirm({
        title: '温馨提示', msg: '' + msg,
        buttons: ['是的', '取消']
    }, function (ret, err) {
        var but = ret.buttonIndex;
        if (but == 1) {
            UpdateSt();//修改状态
        }
    });
}
//正在出汤
function ZZCT(msg) {
    db.Ts.confirm({
        title: '温馨提示', msg: '当前投料口正在出汤，是否投料？',
        buttons: ['是的', '取消']
    }, function (ret, err) {
        var but = ret.buttonIndex;
        if (but == 1) {
            //执行数据
            db.ajax(function (ret, err) {
                //验证服务端是否执行正确，不正确则内部直接提示错误信息
                if (!db.dfc(ret)) return;

                var data = eval('(' + ret + ')');

                var datas = db.Data.JsonGet(data, "msg", "");
                if (datas.ds.length <= 0) {
                    logMsgFun("操作失败");
                    return;
                }

                if (db.Data.JsonGet(datas.ds[0], "Column1", "") != "") {
                    //logMsgFun('允许投料');
                    //获取炉批次号
                    islupicihao = '允许投料\n';
                    //获取当前炉号的炉批次号
                    huoqulupicihaoapp(data_n);
                    return;
                }
            }, "updateTLStatus", "post", { FCode: data_n, Status: 1 }, { title: '正在执行' });
        }
    });
}
//修改状态
function UpdateSt() {
    if (data_n == "") {
        logMsgFun('请重新扫描投料口二维码编号');
        return;
    }

    //执行数据
    db.ajax(function (ret, err) {
        //验证服务端是否执行正确，不正确则内部直接提示错误信息
        if (!db.dfc(ret)) return;

        var data = eval('(' + ret + ')');

        var datas = db.Data.JsonGet(data, "msg", "");
        if (datas.ds.length <= 0) {
            logMsgFun("开炉失败");
            return;
        }

        if (db.Data.JsonGet(datas.ds[0], "Column1", "") != "") {
            //logMsgFun('开炉成功');
            //获取炉批次号
            islupicihao = '开炉成功\n';
            //获取当前炉号的炉批次号
            huoqulupicihaoapp(data_n);
            return;
        }
    }, "updateTLStatus", "post", {
        FCode: data_n,
        Status: 1
    }, {
        title: '正在执行'
    });
}


//在连续扫描状态下，是否已经完成了所有的扫描
//true：允许继续扫描，false：不允许继续扫描
function sess() {
    if ($("#inp1").val() == '' || $("#inp2").val() == '' || $("#inp3").val() == '')
        //允许继续扫描
        return true;
    //不允许扫描
    return false;
}