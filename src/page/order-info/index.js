require("./index.css");
require("page/common/nav-top/index.js");
require("page/common/nav-search/index.js");

const orderInfoTemplate = require("./index.string");

const _common_util = require("utils/util.js");
const _order_service = require("service/order-service.js");

const Process = require("utils/process/index.js");

const _order_info = {
    requestParam: {
        orderNo: _common_util.getURLParam("orderNo"),
    },
    processParam: {
        container   : null,
        current     : 1,
        length      : 5,
        nodes: [
            '<i class="fa fa-list-alt"></i>',
            '<i class="fa fa-credit-card"></i>',
            '<i class="fa fa-archive"></i>',
            '<i class="fa fa-truck"></i>',
            '<i class="fa fa-check"></i>',
        ],
        titles      : ['提交订单', '付款成功', '商品出库', '等待收货', '完成'],
        descs       : ['订单已提交，未付款', '订单已付款', '商品已出库', '等待收货', '订单已完成'],
        nodeSize    : 'large',
        activeColor : 'blue',
        lineLength  : '80px',
    },
    init: function () {
        this.onLoad();
        this.bindEvents();
        return this;
    },
    bindEvents: function () {

    },
    onLoad: function () {
        this.loadOrderDetail();
    },
    loadOrderDetail: function () {
        let requestParam = this.requestParam;
        let processParam = this.processParam;
        let orderInfoHTML = "";
        let $orderInfoContent = $(".order-info-content");

        const _this = this;
        _order_service.getOrderDetail(requestParam, function (res) {
            let order = $.extend({}, res, {
                statusDesc: _common_util.getStatusDesc(res.status),
                paymentTypeDesc: _common_util.getPaymentTypeDesc(res.paymentType),
                actualPayment: (res.paymentPrice + res.postage).toFixed(2),
                stateTextColor: res.status > 1 ? `state-text-${processParam.activeColor}` : "",
            });
            
            orderInfoHTML = _common_util.renderHTML(orderInfoTemplate, order);
            $orderInfoContent.html(orderInfoHTML);

            processParam.container = $(".process-container");
            processParam.current = res.status - 1;
            _this.loadProcess(processParam);
        }, function (errMsg) {
            _common_util.errorTips(errMsg);
        });
    },
    // 加载分步插件
    loadProcess: function (userOption) {
        this.process ? "" : (this.process = new Process());
        this.process.render(userOption);
    },
};

module.exports = _order_info.init();