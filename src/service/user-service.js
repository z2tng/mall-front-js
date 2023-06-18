const _common_util = require("utils/util.js");

const _user_service = {
    // 获取用户信息
    getUserInfo: function (resolve, reject) {
        _common_util.request({
            url     : _common_util.getServerURL('/user/get_user_detail'),
            method  : 'POST',
            success : resolve,
            error   : reject,
        });
    },
    // 登录
    login: function (userInfo, resolve, reject) {
        _common_util.request({
            url     : _common_util.getServerURL('/user/login'),
            method  : 'POST',
            data    : userInfo,
            success : resolve,
            error   : reject,
        });
    },
    // 注册
    register: function (userInfo, resolve, reject) {
        _common_util.request({
            url     : _common_util.getServerURL('/user/register'),
            method  : 'POST',
            data    : userInfo,
            success : resolve,
            error   : reject,
        });
    },
    // 登出
    logout: function (resolve, reject) {
        _common_util.request({
            url     : _common_util.getServerURL('/user/logout'),
            method  : 'POST',
            success : resolve,
            error   : reject,
        });
    },
    getForgetQuestion: function (username, resolve, reject) {
        _common_util.request({
            url     : _common_util.getServerURL('/user/get_forget_question?username=' + username),
            method  : 'POST',
            success : resolve,
            error   : reject,
        });
    },
    checkForgetQuestion: function (userInfo, resolve, reject) {
        _common_util.request({
            url     : _common_util.getServerURL('/user/check_forget_answer'),
            method  : 'POST',
            data    : userInfo,
            success : resolve,
            error   : reject,
        });
    },
    resetForgetPassword: function (userInfo, resolve, reject) {
        _common_util.request({
            url     : _common_util.getServerURL('/user/reset_forget_password'),
            method  : 'POST',
            data    : userInfo,
            success : resolve,
            error   : reject,
        });
    },
    updateUserInfo: function (userInfo, resolve, reject) {
        _common_util.request({
            url     : _common_util.getServerURL('/user/update_user'),
            method  : 'POST',
            data    : userInfo,
            success : resolve,
            error   : reject,
        });
    },
    resetPassword: function (passwordInfo, resolve, reject) {
        _common_util.request({
            url     : _common_util.getServerURL('/user/reset_password'),
            method  : 'POST',
            data    : passwordInfo,
            success : resolve,
            error   : reject,
        });
    },
};

module.exports = _user_service;