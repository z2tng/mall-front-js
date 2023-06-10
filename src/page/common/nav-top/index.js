require("./index.css");

const _common_util = require("utils/util.js");
const _user_service = require("service/user-service.js");

const _nav_top = {
    init: function () {
        this.bindEvents();
        this.loadUserInfo();
        this.loadCartCount();
        return this;
    },
    bindEvents: function () {
        $('.js-login').on('click', function () {
            _common_util.toLogin();
        });
        $('.js-register').on('click', function () {
            window.location.href = './user-register.html?redirect=' + encodeURI(window.location.href);
        });
        $('.js-logout').on('click', function () {
            _user_service.logout(function (res) {
                console.log(res);
            }, function (errorMsg) {
                console.log(errorMsg);
            });
            _common_util.toMain();
        });
    },
    loadUserInfo: function () {
        _user_service.getUserInfo(function (res) {
            console.log(res);
            $('.user.not-login').hide()
                .siblings('.user.login').show()
                .find('.username').text(res.username)
        }, function (errorMsg) {
            console.log(errorMsg);
            $('.user.login').hide()
        });
    },
    loadCartCount: function () {

    },
};

module.exports = _nav_top.init();