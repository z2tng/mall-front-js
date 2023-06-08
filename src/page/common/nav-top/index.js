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