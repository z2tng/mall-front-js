require("./index.css");
require("page/common/nav-top/index.js");
require("page/common/nav-search/index.js");

const cartTemplate = require("./index.string");

const _common_util = require("utils/util.js");
const _cart_service = require("service/cart-service.js");

const InputNumber = require("utils/input-number/index.js");

const _cart = {
    init: function () {
        this.onLoad();
        this.bindEvents();
        return this;
    },
    bindEvents: function () {
        const _this = this;

        // 选择购物车商品事件
        $(document).on("click", ".item-checkbox", function () {
            const $this = $(this);
            const productId = $this.parents(".cart-item").data("value");

            if ($this.is(":checked")) {
                _this.checkCartItem(productId);
            } else {
                _this.uncheckCartItem(productId);
            }
        });
        // 全选购物车商品事件
        $(document).on("click", ".cart-checkbox", function () {
            const $this = $(this);

            if ($this.is(":checked")) {
                _this.checkAllCartItems();
            } else {
                _this.uncheckAllCartItems();
            }
        });
        // 删除购物车商品事件
        $(document).on("click", ".delete-item-btn", function () {
            const $this = $(this);
            const productId = $this.parents(".cart-item").data("value");

            _this.deleteCartItem(productId);
        });
        // 删除选中的购物车商品事件
        $(document).on("click", ".delete-checked-btn", function () {
            _this.deleteCheckedCartItem();
        });
    },
    onLoad: function () {
        this.loadCart();
    },
    loadCart: function () {
        let cartHTML = "";
        const $cartContent = $(".cart-content");
        const _this = this;

        _cart_service.getCartItemList(function (res) {
            let cartVO = res;

            let cartItemVOList = cartVO.cartItemVOList;
            if (cartItemVOList.length === 0) {
                cartVO.allChecked = false;
            }
            cartVO.checkedCount = _this.getCheckedCartItemCount(cartItemVOList);

            cartHTML = _common_util.renderHTML(cartTemplate, res);
            $cartContent.html(cartHTML);

            _this.loadInputNumbers(cartItemVOList);
        }, function (errorMsg) {
            _common_util.errorTips(errorMsg);
        });
    },
    // 加载全部加减框组件
    loadInputNumbers: function (catrItemList) {
        let length = catrItemList.length;
        // 1. 创建一个长度为 length 的数组，元素为加减框组件
        this.inputNumbers ? "" : (this.inputNumbers = new Array(length));
        // 2. 遍历购物车项数组，为每个 quantity 创建一个加减框组件
        for (let i = 0; i < length; i++) {
            const $container = $(`.quantity:eq(${i})`);
            let value = catrItemList[i].quantity;
            let max = catrItemList[i].productStock;
            this.loadInputNumber(i, $container, value, 1, max);
        }
    },
    // 加载单个加减框插件
    loadInputNumber: function (index, container, value, min, max) {
        const _this = this;
        this.inputNumbers[index] ? "" : (this.inputNumbers[index] = new InputNumber());
        this.inputNumbers[index].init({
            container : container,
            value     : value,
            min       : min,
            max       : max,
            size      : 'small',
            onChange  : function (value) {
                let productId = container.parents(".cart-item").data("value");
                if (value > max) {
                    _common_util.errorTips('库存不足');
                    _this.updateCart(productId, max);
                } else if (value < min) {
                    _common_util.errorTips('购买数量不能小于1');
                    _this.updateCart(productId, min);
                } else {
                    _this.updateCart(productId, value);
                }
            }
        });
    },
    // 获取选择购物车商品的数量
    getCheckedCartItemCount: function (list) {
        let count = 0;

        list.forEach(function (cartItem) {
            if (cartItem.checked) {
                count += 1;
            }
        });

        return count;
    },
    // 选择购物车商品
    checkCartItem: function (productId) {
        const _this = this;
        
        _cart_service.checkCartItem(JSON.stringify({
            productId: productId
        }), function (res) {
            _this.loadCart();
        }, function (errorMsg) {
            _common_util.errorTips(errorMsg);
        });
    },
    // 取消选择购物车商品
    uncheckCartItem: function (productId) {
        const _this = this;

        _cart_service.uncheckCartItem(JSON.stringify({
            productId: productId
        }), function (res) {
            _this.loadCart();
        }, function (errorMsg) {
            _common_util.errorTips(errorMsg);
        });
    },
    // 全选购物车商品
    checkAllCartItems: function () {
        const _this = this;

        _cart_service.checkAllCartItems(function (res) {
            _this.loadCart();
        }, function (errorMsg) {
            _common_util.errorTips(errorMsg);
        });
    },
    // 取消全选购物车商品
    uncheckAllCartItems: function () {
        const _this = this;

        _cart_service.uncheckAllCartItems(function (res) {
            _this.loadCart();
        }, function (errorMsg) {
            _common_util.errorTips(errorMsg);
        });
    },
    // 删除购物车商品
    deleteCartItem: function (productId) {
        const _this = this;

        _cart_service.deleteCartItem(JSON.stringify({
            productIds: productId
        }), function (res) {
            _this.loadCart();
        }, function (errorMsg) {
            _common_util.errorTips(errorMsg);
        });
    },
    // 删除选中的购物车商品
    deleteCheckedCartItem: function () {
        const _this = this;
        const checkedCartItemIds = [];
        const $checkedCartItems = $(".cart-item input:checked");

        if ($checkedCartItems.length) {
            $checkedCartItems.each(function (index, element) {
                checkedCartItemIds.push($(element).parents(".cart-item").data("value"));
            });
            
            _cart_service.deleteCartItem(JSON.stringify({
                productIds: checkedCartItemIds.join(",")
            }), function (res) {
                _this.loadCart();
            }, function (errorMsg) {
                _common_util.errorTips(errorMsg);
            });
        } else {
            _common_util.errorTips("请选择要删除的商品");
        }
    },
    // 更新购物车信息
    updateCart: function (productId, quantity) {
        const _this = this;

        _cart_service.updateCartItem(JSON.stringify({
            productId: productId,
            quantity: quantity
        }), function (res) {
            _this.loadCart();
        }, function (errorMsg) {
            _common_util.errorTips(errorMsg);
        });
    },
};

$(function(){
    _cart.init();
});
