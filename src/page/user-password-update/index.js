require("./index.css");
require("page/common/nav-top/index.js");
require("page/common/nav-search/index.js");
require("page/common/sidebar/index.js");

const userPasswordUpdateTemplate = require("./index.string");

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

const _user_password_update = {
    defaultParams: {
        title       : '重置密码',
        oldPassword : '',
        newPassword : '',
    },
    init: function () {
        this.onLoad();
        this.bindEvents();
        return this;
    },
    bindEvents: function () {
        const _this = this;
        $(document).on('click', '#user-password-update', function () {
            _this.resetPassword();
        });
    },
    onLoad: function () {
        this.loadUserPasswordUpdate();
        this.setActiveSidebarItem();
    },
    setActiveSidebarItem: function () {
        $(".sidebar-item").removeClass("sidebar-item-active");
        $("#user-password-update").addClass("sidebar-item-active");
    },
    loadUserPasswordUpdate: function () {
        let params = this.defaultParams;
        let userPasswordUpdateHTML = '';
        const $main = $('.main');

        _user_service.getUserInfo(function (data, msg) {
            console.log(msg);
            userPasswordUpdateHTML = _common_util.renderHTML(userPasswordUpdateTemplate, params);
            $main.html(userPasswordUpdateHTML);
        }, function (errorMsg) {
            _common_util.toLogin();
        });
    },
    resetPassword: function () {
        let formData = {
            oldPassword         : $.trim($('#old-password').val()),
            newPassword         : $.trim($('#new-password').val()),
            repeatNewPassword   : $.trim($('#repeat-new-password').val()),
        };
        const validateResult = this.resetPasswordValidate(formData);

        if (validateResult.status) {
            delete formData.repeatNewPassword;
            _user_service.resetPassword(JSON.stringify(formData), function (data, msg) {
                console.log(msg);
                _common_util.successTips('重置密码成功');
            }, function (errorMsg) {
                errorItem.show(errorMsg);
            });
        } else {
            errorItem.show(validateResult.msg);
        }
    },
    resetPasswordValidate: function (formData) {
        let result = {
            status  : false,
            msg     : '',
        };
        if (!_common_util.validate(formData.oldPassword, 'require')) {
            result.msg = '旧密码不能为空';
            return result;
        }
        if (!_common_util.validate(formData.newPassword, 'require')) {
            result.msg = '新密码不能为空';
            return result;
        }
        if (!_common_util.validate(formData.repeatNewPassword, 'require')) {
            result.msg = '重复密码不能为空';
            return result;
        }
        if (formData.newPassword !== formData.repeatNewPassword) {
            result.msg = '重复密码不一致';
            return result;
        }
        result.status = true;
        result.msg = '通过验证';
        return result;
    }
};

module.exports = _user_password_update.init();