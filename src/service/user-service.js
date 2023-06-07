const _common_util = require("utils/util.js");

const _user_service = {
    // 获取用户信息
    getUserInfo: function (resolve, reject) {
        _common_util.request({
            url     : _common_util.getServerURL('/user/get_user_detail'),
            method  : 'POST',
            success : resolve,
            error   : reject,
        })
    },
    // 登录
    login: function (userInfo, resolve, reject) {
        _common_util.request({
            url     : _common_util.getServerURL('/user/login'),
            method  : 'POST',
            data    : userInfo,
            success : resolve,
            error   : reject,
        })
    },
};

module.exports = _user_service;