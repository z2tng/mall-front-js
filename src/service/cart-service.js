const _common_util = require("utils/util.js");

const _cart_service = {
    // 获取购物车商品数量
    getCartCount: function (resolve, reject) {
        _common_util.request({
            url     : _common_util.getServerURL('/cart/get_cart_count'),
            method  : 'POST',
            success : resolve,
            error   : reject,
        });
    },
    // 获取商品列表
    getCartItemList: function (resolve, reject) {
        _common_util.request({
            url     : _common_util.getServerURL('/cart/list'),
            method  : 'POST',
            success : resolve,
            error   : reject,
        })
    },
    // 添加商品到购物车
    addProductToCart: function (productInfo, resolve, reject) {
        _common_util.request({
            url     : _common_util.getServerURL('/cart/add'),
            method  : 'POST',
            data    : productInfo,
            success : resolve,
            error   : reject,
        });
    },
    // 更新购物车商品数量
    updateProductCount: function (productId, quantity, resolve, reject) {
        _common_util.request({
            url     : _common_util.getServerURL('/cart/update'),
            method  : 'POST',
            data    : JSON.stringify({ productId: productId, quantity: quantity }),
            success : resolve,
            error   : reject,
        });
    },
    // 删除购物车商品
    deleteProduct: function (productIds, resolve, reject) {
        _common_util.request({
            url     : _common_util.getServerURL('/cart/delete'),
            method  : 'POST',
            data    : JSON.stringify({ productIds: productIds }),
            success : resolve,
            error   : reject,
        });
    },
    // 选择购物车商品
    checkProduct: function (productId, resolve, reject) {
        _common_util.request({
            url     : _common_util.getServerURL('/cart/set_cart_item_checked'),
            method  : 'POST',
            data    : JSON.stringify({ productId: productId }),
            success : resolve,
            error   : reject,
        })
    },
    // 取消选择购物车商品
    uncheckProduct: function (productId, resolve, reject) {
        _common_util.request({
            url     : _common_util.getServerURL('/cart/set_cart_item_unchecked'),
            method  : 'POST',
            data    : JSON.stringify({ productId: productId }),
            success : resolve,
            error   : reject,
        })
    },
    // 选择购物车所有商品
    checkAllProducts: function (resolve, reject) {
        _common_util.request({
            url     : _common_util.getServerURL('/cart/set_all_checked'),
            method  : 'POST',
            success : resolve,
            error   : reject,
        });
    },
    // 取消选择购物车所有商品
    uncheckAllProducts: function (resolve, reject) {
        _common_util.request({
            url     : _common_util.getServerURL('/cart/set_all_unchecked'),
            method  : 'POST',
            success : resolve,
            error   : reject,
        });
    }
};

module.exports = _cart_service;