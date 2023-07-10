require("./index.css");
require("page/common/nav-top/index.js");
require("page/common/nav-search/index.js");

const orderPayTemplate = require("./index.string");

const _common_util = require("utils/util.js");
const _order_service = require("service/order-service.js");

const _order_pay = {
    requestParam : {
        orderNo : _common_util.getURLParam("orderNo")
    },
    init: function () {
        this.onLoad();
        this.bindEvents();
        return this;
    },
    bindEvents: function () {

    },
    onLoad: function () {
        this.loadOrderPay();
        console.log("开始轮询");
        setInterval(() => {
            this.getAliPayStatus();
        }, 5*1000);
    },
    loadOrderPay: function () {
        let requestParam = this.requestParam;
        let orderPayHTML = "";
        const $orderPayContent = $(".order-pay-content");

        const _this = this;
        _order_service.getAliPayQRCode(requestParam, function (res) {
            orderPayHTML = _common_util.renderHTML(orderPayTemplate, res);
            $orderPayContent.html(orderPayHTML);
        }, function (errorMsg) {
            _common_util.errorTips(errorMsg);
        });
    },
    getAliPayStatus: function () {
        let requestParam = this.requestParam;
        const _this = this;
        _order_service.getAliPayStatus(requestParam, function (res) {
            console.log("success: " + res);
            window.location.href = "./order-info.html?orderNo=" + requestParam.orderNo;
        }, function (errorMsg) {
            console.log("err: " + errorMsg);
        });
    }
};

$(function () {
    _order_pay.init();
});
