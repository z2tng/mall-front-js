require("./index.css");
require("page/common/nav-top/index.js");
require("page/common/nav-search/index.js");

const productDetailTemplate = require("./index.string");

const _common_util = require("utils/util.js");
const _product_service = require("service/product-service.js");
const _cart_service = require("service/cart-service.js");

const InputNumber = require("utils/input-number/index.js");

const _product_detail = {
    requestParam: {
        productId : _common_util.getURLParam('productId') || '',
        quantity  : 1,
    },
    init: function () {
        this.onLoad();
        this.bindEvents();
        return this;
    },
    bindEvents: function () {
        const _this = this;

        $(document).on('click', '.forward', function () {
            // 预览图片向前滑动
            const $imgList = $('.img-list');
            let width = parseInt($imgList.css('width').slice(0, -2));
            let start = parseInt($imgList.css('left').slice(0, -2));

            if (width > 380 &&  start < 0) {
                $imgList.css('left', start + 380 + 'px');
            }
        });

        $(document).on('click', '.backward', function () {
            // 预览图片向后滑动
            const $imgList = $('.img-list');
            let width = parseInt($imgList.css('width').slice(0, -2));
            let start = parseInt($imgList.css('left').slice(0, -2));

            if (width > 380 && (width + start) > 380) {
                $imgList.css('left', start - 380 + 'px');
            }
        });

        $(document).on('click', '.preview-items li', function () {
            const $this = $(this);

            const $img = $this.find('img');
            const $mainImg = $('.main-img img');
            $mainImg.attr('src', $img.attr('src'));

            $this.addClass('active').siblings().removeClass('active');
        });

        $(document).on('click', '.add-cart-btn', function () {
            _this.addToCart();
        });
    },
    getPreviewListWidth: function (previewListLength) {
        return Math.ceil(previewListLength / 5) * 380;
    },
    onLoad: function () {
        this.loadProductDetail();
    },
    loadProductDetail: function () {
        let requestParam = this.requestParam;
        let productDetailHTML = '';
        const $productDetailContent = $('.product-detail-content');

        const _this = this;
        _product_service.getProductDetail(requestParam, function (res) {
            let subImages = res.subImages.split(',');
            res.subImages = subImages;
            res.imgListWidth = _this.getPreviewListWidth(subImages.length + 1);
            res.disabled = requestParam.quantity > res.stock ? 'btn-disabled' : '';

            productDetailHTML = _common_util.renderHTML(productDetailTemplate, res);
            $productDetailContent.html(productDetailHTML);

            _this.loadInputNumber(1, res.stock);
        }, function (errorMsg) {
            _common_util.errorTips(errorMsg);
        });
    },
    // 加入购物车
    addToCart: function () {
        let requestParam = this.requestParam;

        _cart_service.addProductToCart(JSON.stringify(requestParam), function (res) {
            window.location.href = './add-to-cart.html?productId=' + requestParam.productId + '&quantity=' + requestParam.quantity;
        }, function (errorMsg) {
            _common_util.errorTips(errorMsg);
        });      
    },
    // 加载加减框插件
    loadInputNumber: function (min, max) {
        const _this = this;
        this.inputNumber ? "" : (this.inputNumber = new InputNumber());
        this.inputNumber.init({
            container : $('.quantity'),
            value     : _this.requestParam.quantity,
            min       : min,
            max       : max,
            size      : 'normal',
            onChange  : function (value) {
                if (value > max) {
                    _common_util.errorTips('库存不足');
                    _this.requestParam.quantity = max;
                } else if (value < min) {
                    _common_util.errorTips('购买数量不能小于1');
                    _this.requestParam.quantity = min;
                } else {
                    _this.requestParam.quantity = value;
                }
                _this.loadInputNumber(min, max);
            }
        });
    },
};

$(function(){
    _product_detail.init();
});
