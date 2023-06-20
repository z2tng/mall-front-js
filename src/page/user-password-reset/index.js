require("./index.css");
require("page/common/nav-top-simple/index.js")

const _common_util = require("utils/util.js");
const _user_service = require("service/user-service.js");

const Process = require("utils/process/index.js");

const errorItem = {
    show: function (errorMsg) {
        $('.form-error').show().find('.error-message').text(errorMsg);
    },
    hide: function () {
        $('.form-error').hide().find('.error-message').text('');
    }
}

// TODO: 更换分步插件

const _user_forget_password_reset = {
    forgetToken: '',    // 保存获取到的token
    processParam: {
        container   : null,
        current     : 1,
        length      : 3,
        nodes       : [],
        titles      : ['用户验证', '回答问题', '重置密码'],
        descs       : ['输入用户名', '回答注册时设置的问题', '输入新密码'],
        nodeSize    : 'normal',
        activeColor : 'blue',
        lineLength  : '50px',
    },
    init: function () {
        this.bindEvents();
        this.onLoad();
        return this;
    },
    bindEvents: function () {
        const _this = this;
        $('#prev').on('click', function () {
            _this.prev();
        });
        $('#next').on('click', function () {
            _this.next();
        });
    },
    prev: function () {
        this.prevStep();
    },
    next: function () {
        const _this = this;
        let processParam = this.processParam;
        let current = processParam.current;
        let formData = {
            username        : $.trim($('#username').val()),
            question        : $.trim($('#question').val()),
            answer          : $.trim($('#answer').val()),
            newPassword     : $.trim($('#new-password').val()),
            repeatPassword  : $.trim($('#repeat-password').val()),
            forgetToken     : _this.forgetToken,
        };
        // 校验
        const validateResult = this.formDataValidate(formData);
        // 根据步骤请求
        if (validateResult.status) {
            if (current === 1) {
                _user_service.getForgetQuestion(formData.username, function (res) {
                    errorItem.hide();
                    document.getElementById('question').value = res;
                    _this.nextStep();
                }, function (errorMsg) {
                    errorItem.show(errorMsg);
                });
            } else if (current === 2) {
                _user_service.checkForgetQuestion(JSON.stringify(formData, [
                    'username', 'question', 'answer'
                ]), function (res) {
                    errorItem.hide();
                    _this.forgetToken = res;
                    _this.nextStep();
                }, function (errorMsg) {
                    errorItem.show(errorMsg);
                });
            } else if (current === 3) {
                _user_service.resetForgetPassword(JSON.stringify(formData, [
                    'username', 'newPassword', 'forgetToken'
                ]), function (res) {
                    errorItem.hide();
                    _common_util.successTips(res);
                    _common_util.toLogin(false);
                }, function (errorMsg) {
                    errorItem.show(errorMsg);
                });
            }
        } else {
            errorItem.show(validateResult.msg);
        }
    },
    prevStep: function () {
        let processParam = this.processParam;
        let current = processParam.current;
        processParam.current = current > 1 ? current - 1 : 1;
        this.loadProcess(processParam);
        this.loadForm(processParam.current);
    },
    nextStep: function () {
        let processParam = this.processParam;
        let current = processParam.current;
        let length = processParam.length;
        processParam.current = current < length ? current + 1 : current;

        this.loadProcess(processParam);
        this.loadForm(processParam.current);
    },
    formDataValidate: function (formData) {
        let processParam = this.processParam;
        let current = processParam.current;

        let result = {
            status  : false,
            msg     : '',
        };

        if (current === 1) {
            // 第一步，验证用户名
            if (!_common_util.validate(formData.username, 'require')) {
                result.msg = '用户名不能为空';
                return result;
            }
        } else if (current === 2) {
            // 第二步，验证问题答案
            if (!_common_util.validate(formData.answer, 'require')) {
                result.msg = '答案不能为空';
                return result;
            }
        } else if (current === 3) {
            // 第三步，验证密码
            if (!_common_util.validate(formData.newPassword, 'require')) {
                result.msg = '新密码不能为空';
                return result;
            }
            if (!_common_util.validate(formData.repeatPassword, 'require')) {
                result.msg = '重复密码不能为空';
                return result;
            }
            if (formData.newPassword !== formData.repeatPassword) {
                result.msg = '两次输入密码不一致';
                return result;
            }
        }
        result.status = true;
        result.msg = '通过验证';
        return result;
    },
    onLoad: function () {
        this.loadProcess(this.processParam);
        this.loadForm();
    },
    // 加载表单内容
    loadForm: function () {
        let current = this.processParam.current;
        $('.step-form-item').hide();
        $('#step-' + current).show();
    },
    // 加载分步插件
    loadProcess: function (userOption) {
        this.process ? "" : (this.process = new Process());
        userOption.container ? "" : userOption.container = $('.process-container');
        this.process.render(userOption);
    },
};

$(function () {
    _user_forget_password_reset.init();
})