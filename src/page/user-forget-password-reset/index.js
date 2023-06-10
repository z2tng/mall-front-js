require("./index.css");
require("page/user-login/index.css");
require("page/common/nav-top-simple/index.js")

const _common_util = require("utils/util.js");
const _user_service = require("service/user-service.js");

const StepHeader = require("utils/step-header/index.js");

const errorItem = {
    show: function (errorMsg) {
        $('.user-form-error').show().find('.error-message').text(errorMsg);
    },
    hide: function () {
        $('.user-form-error').hide().find('.error-message').text('');
    }
}

const _user_password_reset = {
    forgetToken: '',    // 保存获取到的token
    status: false,      // 用于确定是否可以跳转到下一步
    currentStep: 1,     // 当前所在步骤
    steps: 3,           // 步骤数量
    defaultStepData: [
        {title: '用户验证', tip: '输入用户名'},
        {title: '回答问题', tip: '回答注册时设置的问题'},
        {title: '重置密码', tip: '输入新密码'},
    ],
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
        let currentStep = this.currentStep;
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
            if (currentStep === 1) {
                _user_service.getForgetQuestion(formData.username, function (res) {
                    errorItem.hide();
                    document.getElementById('question').value = res;
                    _this.nextStep();
                }, function (errorMsg) {
                    errorItem.show(errorMsg);
                });
            } else if (currentStep === 2) {
                _user_service.checkForgetQuestion(JSON.stringify(formData, [
                    'username', 'question', 'answer'
                ]), function (res) {
                    errorItem.hide();
                    _this.forgetToken = res;
                    _this.nextStep();
                }, function (errorMsg) {
                    errorItem.show(errorMsg);
                });
            } else if (currentStep === 3) {
                console.log(formData);
                _user_service.resetForgetPassword(JSON.stringify(formData, [
                    'username', 'newPassword', 'forgetToken'
                ]), function (res) {
                    errorItem.hide();
                    _common_util.successTips(res);
                    _common_util.toLogin();
                }, function (errorMsg) {
                    errorItem.show(errorMsg);
                });
            }
        } else {
            errorItem.show(validateResult.msg);
        }
    },
    prevStep: function () {
        let currentStep = this.currentStep;
        this.currentStep = currentStep > 1 ? currentStep - 1 : 1;
        this.loadStepHeader(this.currentStep, this.steps, this.defaultStepData);
        this.loadStepBody(this.currentStep);
    },
    nextStep: function () {
        let currentStep = this.currentStep;
        let steps = this.steps;
        this.currentStep = currentStep < steps ? currentStep + 1 : currentStep;
        this.loadStepHeader(this.currentStep, this.steps, this.defaultStepData);
        this.loadStepBody(this.currentStep);
    },
    formDataValidate: function (formData) {
        let currentStep = this.currentStep;

        let result = {
            status  : false,
            msg     : '',
        };

        if (currentStep === 1) {
            if (!_common_util.validate(formData.username, 'require')) {
                result.msg = '用户名不能为空';
                return result;
            }
        } else if (currentStep === 2) {
            if (!_common_util.validate(formData.answer, 'require')) {
                result.msg = '答案不能为空';
                return result;
            }
        } else if (currentStep === 3) {
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
        this.loadStepHeader(this.currentStep, this.steps, this.defaultStepData);
        this.loadStepBody(this.currentStep);
    },
    // 加载分步主体
    loadStepBody: function (current) {
        $('.step-item').hide();
        $('#step-' + current).show();
    },
    // 加载分步插件
    loadStepHeader: function (current, steps, data) {
        this.stepHeader ? "" : (this.stepHeader = new StepHeader());
        this.stepHeader.render({
            container   : $('.step-header'),
            current     : current,
            steps       : steps,
        }, data);
    },
};

$(function () {
    _user_password_reset.init();
})