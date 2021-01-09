//初始
apiready = function () {
    //监听声音键
    db.syjt(function (ret, err) {
        erweima();
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

    //显示铝锭信息
    $("#LD").val('');
    //材料牌号
    $("#PH").val('');
    //入库日期
    $("#RQ").val('');
    //供应商
    $("#GYS").val('');
    //炉号
    $("#LH").val('');
    //重量
    $("#ZL").val('');
    //检验状态
    $("#ZT").val('');
    //检验单号
    $("#DH").val('');

    if (ret) {
        var ewm = eval('(' + ret + ')');
        var n = db.Data.JsonGet(ewm, "n", "");
        var k = db.Data.JsonGet(ewm, "k", "");
        var q = db.Data.JsonGet(ewm, "q", "");
        k = (k == '' ? n : k);
        if (q != 'LD') {
            logMsgFun("请扫描铝锭二维码！");
            return;
        }
        //显示铝锭信息
        $("#LD").val('' + k);
        //请求接口，查询铝锭信息
        db.submit('FLDSelect', { FLDNumber: n }, function (ret123, err) {
            var data = eval('(' + ret123 + ')');
            var das = data.msg.ds;
            //是否有数据
            if (das != undefined && das.length > 0) {
                try {
                    //显示铝锭信息
                    $("#LD").val('' + k);
                    //材料牌号
                    $("#PH").val('' + das[0].PH);
                    //入库日期
                    $("#RQ").val('' + das[0].RQ.replace('T', ' '));
                    //供应商
                    $("#GYS").val('' + das[0].GYS);
                    //炉号
                    $("#LH").val('' + das[0].LH);
                    //重量
                    $("#ZL").val('' + das[0].ZL);
                    //检验状态
                    $("#ZT").val('' + das[0].ZT);
                    //检验单号
                    $("#DH").val('' + das[0].DH);
                } catch (error1) {
                    logMsgFun('铝锭信息异常，请联系IT部门！');
                }
            } else {
                alert('无记录！');
            }
        });
    }
}
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