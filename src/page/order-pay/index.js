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
        const _this = this;

        // 支付按钮点击事件
        // 1. 支付宝支付
        $(document).on("click", "alipay", function () {
            
        });
        // 2. 微信支付
        $(document).on("click", "wepay", function () {

        });
    },
    onLoad: function () {
        this.loadOrderPay();
    },
    loadOrderPay: function () {
        let requestParam = this.requestParam;
        let orderPayHTML = "";
        const $orderPayContent = $(".order-pay-content");

        const _this = this;
        _order_service.getOrderDetail(requestParam, function (res) {
            res.isOrderUnpaid = res.status === 2;
            console.log(res);
            orderPayHTML = _common_util.renderHTML(orderPayTemplate, res);
            $orderPayContent.html(orderPayHTML);
        }, function (errorMsg) {
            _common_util.errorTips(errorMsg);
        });
    },
};

$(function () {
    _order_pay.init();
});
