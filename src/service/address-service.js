const _common_util = require("utils/util.js");

const _address_service = {
    // 获取地址列表
    getAddressList: function (resolve, reject) {
        _common_util.request({
            url     : _common_util.getServerURL('/address/list'),
            method  : 'POST',
            success : resolve,
            error   : reject,
        });
    },
    // 获取单个地址信息
    getAddressInfo: function (addressInfo, resolve, reject) {
        _common_util.request({
            url     : _common_util.getServerURL('/address/find'),
            method  : 'POST',
            data    : addressInfo,
            success : resolve,
            error   : reject,
        });
    },
    // 添加地址
    addAddress: function (addressInfo, resolve, reject) {
        _common_util.request({
            url     : _common_util.getServerURL('/address/add'),
            method  : 'POST',
            data    : addressInfo,
            success : resolve,
            error   : reject,
        });
    },
    // 更新地址
    updateAddress: function (addressInfo, resolve, reject) {
        _common_util.request({
            url     : _common_util.getServerURL('/address/update'),
            method  : 'POST',
            data    : addressInfo,
            success : resolve,
            error   : reject,
        });
    },
    // 删除地址
    deleteAddress: function (addressInfo, resolve, reject) {
        _common_util.request({
            url     : _common_util.getServerURL('/address/delete'),
            method  : 'POST',
            data    : addressInfo,
            success : resolve,
            error   : reject,
        });
    },
};

module.exports = _address_service;