require("./index.css");
require("page/common/nav-top/index.js");
require("page/common/nav-search/index.js");

const checkoutTemplate = require("./index.string");

const _common_util = require("utils/util.js");
const _order_service = require("service/order-service.js");

const _address = require("page/address/index.js");

const _checkout = {
    init: function () {
        this.onLoad();
        this.bindEvents();
        return this;
    },
    bindEvents: function () {
        const _this = this;

        $(document).on("click", ".checkout-btn", function () {
            _this.createOrder();
        });
    },
    onLoad: function () {
        this.loadCheckout();
    },
    loadCheckout: function () {
        let checkoutHtml = "";
        const $checkoutContent = $(".checkout-content");
        const _this = this;

        _order_service.getSelectedCartItemList(function (res) {
            checkoutHtml = _common_util.renderHTML(checkoutTemplate, res);
            $checkoutContent.html(checkoutHtml);

            _this.loadAddress();
        }, function (errorMsg) {
            _common_util.errorTips(errorMsg);
        });
    },
    loadAddress: function () {
        _address.init($(".address-list-wrapper"));
    },
    createOrder: function () {
        let addressId = $(".address-list-item.active").data("id");

        _order_service.createOrder(JSON.stringify({
            addressId: addressId
        }), function (res) {
            window.location.href = "./order-info.html?orderNo=" + res.orderNo;
        }, function (errorMsg) {
            _common_util.errorTips(errorMsg);
        });
    }
};

$(function(){
    _checkout.init();
});
