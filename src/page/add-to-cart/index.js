require("./index.css");
require("page/common/nav-top/index.js");
require("page/common/nav-search/index.js");

const addToCartTemplate = require("./index.string");

const _product_service = require("service/product-service.js");
const _common_util = require("utils/util.js");

const _add_to_cart = {
    requestParam: {
        productId: _common_util.getURLParam("productId"),
        quantity: _common_util.getURLParam("quantity"),
    },
    init: function () {
        this.onLoad();
        this.bindEvents();
        return this;
    },
    bindEvents: function () {
        const _this = this;

        $(document).on("click", ".btn-to-back", function () {
            window.location.href = "./product-detail.html?productId=" + _this.requestParam.productId;
        });

        $(document).on("click", ".btn-to-cart", function () {
            window.location.href = "./cart.html";
        });
    },
    onLoad: function () {
        this.loadContent();
    },
    loadContent: function () {
        let requestParam = this.requestParam;
        let addToCartHTML = "";
        const $content = $(".content");
        const _this = this;

        _product_service.getProductDetail({
            productId: requestParam.productId,
        }, function (res) {
            res.addQuantity = requestParam.quantity;
            res.success = true;
            console.log(res);
            addToCartHTML = _common_util.renderHTML(addToCartTemplate, res);
            $content.html(addToCartHTML);
        }, function (errorMsg) {
            addToCartHTML = _common_util.renderHTML(addToCartTemplate, {
                success: false,
                errorMsg: errorMsg,
            });
            $content.html(addToCartHTML);
        });
    },
};

module.exports = _add_to_cart.init();
