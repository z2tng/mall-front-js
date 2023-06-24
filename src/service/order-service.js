const _common_util = require("utils/util.js");

const _order_service = {
    // 获取订单列表
    getOrderList: function (requestParam, resolve, reject) {
        _common_util.request({
            url     : _common_util.getServerURL('/order/list'),
            method  : 'GET',
            data    : requestParam,
            success : resolve,
            error   : reject,
        });
    },
    // 获取订单详情
    getOrderDetail: function (requestParam, resolve, reject) {
        _common_util.request({
            url     : _common_util.getServerURL('/order/detail'),
            method  : 'GET',
            data    : requestParam,
            success : resolve,
            error   : reject,
        });
    },
    // 获取购物车中选中的商品
    getSelectedCartItemList: function (resolve, reject) {
        _common_util.request({
            url     : _common_util.getServerURL('/order/cart_item_list'),
            method  : 'GET',
            success : resolve,
            error   : reject,
        });
    },
    // 创建订单
    createOrder: function (creatOrderInfo, resolve, reject) {
        _common_util.request({
            url     : _common_util.getServerURL('/order/create'),
            method  : 'POST',
            data    : creatOrderInfo,
            success : resolve,
            error   : reject,
        });
    },
    // 取消订单
    cancelOrder: function (orderInfo, resolve, reject) {
        _common_util.request({
            url     : _common_util.getServerURL('/order/cancel'),
            method  : 'POST',
            data    : orderInfo,
            success : resolve,
            error   : reject,
        });
    }
};

module.exports = _order_service;