require("./index.css");
require("page/common/nav-top/index.js");
require("page/common/nav-search/index.js");
require("page/common/sidebar/index.js");

const userInfoTemplate = require("./index.string");

const _common_util = require("utils/util.js");
const _user_service = require("service/user-service.js");

const errorItem = {
    show: function (errorMsg) {
        $('.user-form-error').show().find('.error-message').text(errorMsg);
    },
    hide: function () {
        $('.user-form-error').hide().find('.error-message').text('');
    }
}

const _user_center = {
    defaultParams: {
        title: '个人信息',
        username: '',
        email: '',
        phone: '',
        question: '',
        answer: '',
    },
    init: function () {
        this.onLoad();
        this.bindEvents();
        return this;
    },
    bindEvents: function () {
        const _this = this;

        $('#user-info').on('click', function () {
            $('.sidebar-item').removeClass('sidebar-item-active');
            $(this).addClass('sidebar-item-active');
        });

        $(document).on('click', '#user-info-update', function () {
            _this.updateUserInfo();
        });
    },
    onLoad: function () {
        this.loadUserInfo();
        this.setActiveSidebarItem();
    },
    setActiveSidebarItem: function () {
        $(".sidebar-item").removeClass("sidebar-item-active");
        $("#user-info").addClass("sidebar-item-active");
    },
    loadUserInfo: function () {
        const $main = $('.main');
        let params = this.defaultParams;
        let userInfoHTML = '';

        _user_service.getUserInfo(function (res) {
            params = $.extend({}, params, res);
            userInfoHTML = _common_util.renderHTML(userInfoTemplate, params);
            $main.html(userInfoHTML);
        }, function (errorMsg) {
            _common_util.toLogin();
        });
    },
    updateUserInfo: function () {
        let formData = {
            username : $.trim($('#username').val()),
            email    : $.trim($('#email').val()),
            phone    : $.trim($('#phone').val()),
            question : $.trim($('#question').val()),
            answer   : $.trim($('#answer').val()),
        };
        const validateResult = this.userInfoValidate(formData);

        const _this = this;
        if (validateResult.status) {
            _user_service.updateUserInfo(JSON.stringify(formData), function (data, msg) {
                console.log(msg);
                _this.loadUserInfo();
            }, function (errorMsg) {
                errorItem.show(errorMsg);
            });
        } else {
            errorItem.show(validateResult.msg);
        }
    },
    userInfoValidate: function (formData) {
        let result = {
            status  : false,
            msg     : '',
        };
        if (!_common_util.validate(formData.email, 'require')) {
            result.msg = '邮箱不能为空';
            return result;
        }
        if (!_common_util.validate(formData.email, 'email')) {
            result.msg = '邮箱格式不正确';
            return result;
        }
        if (!_common_util.validate(formData.phone, 'require')) {
            result.msg = '电话号码不能为空';
            return result;
        }
        if (!_common_util.validate(formData.phone, 'phone')) {
            result.msg = '电话号码格式不正确';
            return result;
        }
        result.status = true;
        result.msg = '通过验证';
        return result;
    },
};

$(function () {
    _user_center.init()
})