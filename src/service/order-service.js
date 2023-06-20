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
};

module.exports = _order_service;