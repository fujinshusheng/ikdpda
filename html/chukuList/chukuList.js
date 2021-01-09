//读取数据
var page = 1;
var state = true;
apiready = function () {
    data();
    api.addEventListener({name: 'scrolltobottom',
        extra: {
            threshold: 50            //设置距离底部多少距离时触发，默认值为0，数字类型
        }
    }, function (ret, err) {
    	if($("#dataBox tr").length<5) return;
        if (state == false) {
            db.Ts.toast('暂无更多', 2000, 'x'); return;
        }
        page = page + 1;
        data();
        // 加载下一页的数据，然后向现有页面追加数据。
    });
}

//查看信息
function selectCont(dom) {
    //layer插件
    layer.open({
        //标题
        title: "<b style='font-size:14px;'>系统信息</b>",
        //内容
        content: "<b>时间：</b><br />" + $(dom).find(".FDate").html() + "<br />"
        + "<b>领料工：</b><br />" + $(dom).find(".FEmplNameLL").html() + "<br />"
        + "<b>领料车间：</b><br />" + $(dom).find(".FIWorkShipName").html() + "<br />"
        + "<b>铝锭二维码：</b><br />" + $(dom).find(".FLDNumber").html() + "<br />"
        + "<b>材料牌号：</b><br />" + $(dom).find(".FCLPH").html() + "<br />"
        + "<b>重量：</b><br />" + $(dom).find(".FWeightD").html() + "<br />"
        ,
        //关闭后执行
        end: function (index, layero) {}
    });
}

//去详情页
function toDetail(id) {
    db.Data.set("ckID", id);
    db.openWin({ url: '../chuku/chuku_head.html' });
}
//获取数据
function data() {
    db.ajax(function (ret, err) {
        var data = eval('(' + ret + ')');
        var rows = data.msg.ds;
        if (db.Data.JsonGet(data, "status", "") == "200") {
            //没数据直接结束
            if (rows.length <= 0) {
                db.Ts.toast('暂无更多', 2000, 'x');
                state = false;//无数据
                return;
            }
            var dataHtml = $("#dataHtml").html();
            //for(var i=0;i<100;i++)
            for (var x in rows) {
                $("#dataBox").append(dataHtml
                    .replace(/_id_/g, '' + rows[x].FOutDeliverID)
                    .replace(/_FDate_/g, '' + rows[x].FDate.substring(0, 10) + " " + rows[x].FDate.substring(11, 19))//
                    .replace(/_FEmplNameLL_/g, '' + rows[x].FEmplName)
                    .replace(/_FOWorkShipName_/g, '' + rows[x].FOWorkShipName)
                    .replace(/_FLDNumber_/g, '' + rows[x].FLDNumber)
                    .replace(/_FCLPH_/g, '' + rows[x].FResName)
                    .replace(/_FWeightD_/g, '' + rows[x].FWeightD)
                    .replace(/_FIWorkShipName_/g, '' + rows[x].FIWorkShipName)
                    )
            }
        } else {
            db.Ts.toast('网络异常请稍后重试...', 2000, 'x');
        }
    }, "m_chukuliest", "post", {
        BLCompanyID: db.getCurrentUser().quyuId,
        pageindexInt: page
    }, { title: '读取中', text: '请耐心等待...' });
}