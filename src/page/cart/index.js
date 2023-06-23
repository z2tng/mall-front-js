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
                _this.selectCartItem(productId);
            } else {
                _this.unselectCartItem(productId);
            }
        });
        // 全选购物车商品事件
        $(document).on("click", ".cart-checkbox", function () {
            const $this = $(this);

            if ($this.is(":checked")) {
                _this.selectAllCartItems();
            } else {
                _this.unselectAllCartItems();
            }
        });
        // 删除购物车商品事件
        $(document).on("click", ".delete-item-btn", function () {
            const $this = $(this);
            const productId = $this.parents(".cart-item").data("value");

            _this.deleteCartItem(productId);
        });
        // 删除选中的购物车商品事件
        $(document).on("click", ".delete-selected-btn", function () {
            _this.deleteSelectedCartItem();
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
            cartVO.checkedCount = _this.getSelectedCartItemCount(cartItemVOList);

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
                    _this.updateProductCount(productId, max);
                } else if (value < min) {
                    _common_util.errorTips('购买数量不能小于1');
                    _this.updateProductCount(productId, min);
                } else {
                    _this.updateProductCount(productId, value);
                }
            }
        });
    },
    // 获取选择购物车商品的数量
    getSelectedCartItemCount: function (list) {
        let count = 0;

        list.forEach(function (cartItem) {
            if (cartItem.checked) {
                count += 1;
            }
        });

        return count;
    },
    // 选择购物车商品
    selectCartItem: function (productId) {
        const _this = this;
        
        _cart_service.checkProduct(productId, function (res) {
            _this.loadCart();
        }, function (errorMsg) {
            _common_util.errorTips(errorMsg);
        });
    },
    // 取消选择购物车商品
    unselectCartItem: function (productId) {
        const _this = this;

        _cart_service.uncheckProduct(productId, function (res) {
            _this.loadCart();
        }, function (errorMsg) {
            _common_util.errorTips(errorMsg);
        });
    },
    // 全选购物车商品
    selectAllCartItems: function () {
        const _this = this;

        _cart_service.checkAllProducts(function (res) {
            _this.loadCart();
        }, function (errorMsg) {
            _common_util.errorTips(errorMsg);
        });
    },
    // 取消全选购物车商品
    unselectAllCartItems: function () {
        const _this = this;

        _cart_service.uncheckAllProducts(function (res) {
            _this.loadCart();
        }, function (errorMsg) {
            _common_util.errorTips(errorMsg);
        });
    },
    // 删除购物车商品
    deleteCartItem: function (productId) {
        const _this = this;

        _cart_service.deleteProduct(productId, function (res) {
            _this.loadCart();
        }, function (errorMsg) {
            _common_util.errorTips(errorMsg);
        });
    },
    // 删除选中的购物车商品
    deleteSelectedCartItem: function () {
        const _this = this;
        const selectedCartItemIds = [];
        const $selectedCartItems = $(".cart-item input:checked");

        if ($selectedCartItems.length) {
            $selectedCartItems.each(function (index, element) {
                selectedCartItemIds.push($(element).parents(".cart-item").attr("data-value"));
            });
            
            console.log(selectedCartItemIds);
            _cart_service.deleteProduct(selectedCartItemIds.join(","), function (res) {
                _this.loadCart();
            }, function (errorMsg) {
                _common_util.errorTips(errorMsg);
            });
        } else {
            _common_util.errorTips("请选择要删除的商品");
        }
    },
    // 更新购物车商品数量
    updateProductCount: function (productId, quantity) {
        const _this = this;

        _cart_service.updateProductCount(productId, quantity, function (res) {
            _this.loadCart();
        }, function (errorMsg) {
            _common_util.errorTips(errorMsg);
        });
    },
};

module.exports = _cart.init();
