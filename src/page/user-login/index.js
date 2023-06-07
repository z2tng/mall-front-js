require("./index.css");
require("page/common/nav-top-simple/index.js");

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

const _user_login = {
    init: function () {
        this.bindEvents();
        return this;
    },
    bindEvents: function () {
        const _this = this;
        $('#submit').on('click', function () {
            _this.submit();
        });
        $('.user-form-item').on('keyup', function (e) {
            if (e.keyCode === 13) {
                _this.submit();
            }
        });
    },
    submit: function () {
        let formData = {
            username : $.trim($('#username').val()),
            password : $.trim($('#password').val()),
        };
        const validateResult = this.formDataValidate(formData);

        if (validateResult.status) {
            _user_service.login(JSON.stringify(formData), function (res) {
                console.log(res);
                window.location.href = _common_util.getURLParam('redirect') || './index.html';
            }, function (errorMsg) {
                errorItem.show(errorMsg);
            });
        } else {
            errorItem.show(validateResult.msg);
        }
    },
    formDataValidate: function (formData) {
        let result = {
            status  : false,
            msg     : '',
        };
        if (!_common_util.validate(formData.username, 'require')) {
            result.msg = '用户名不能为空';
            return result;
        }
        if (!_common_util.validate(formData.password, 'require')) {
            result.msg = '密码不能为空';
            return result;
        }
        result.status = true;
        result.msg = '通过验证';
        return result;
    }
};

module.exports = _user_login.init();