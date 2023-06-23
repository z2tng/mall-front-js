require("./index.css");

const modalTemplate = require("./index.string");

const _common_util = require("utils/util.js");

const Modal = function () {
    this.defaultOption = {
        container   : null,
        title       : "",
        content     : "",
        width       : "auto",
        buttons     : {
            confirm : {
                text    : "确定",
                callback: null
            },
            cancel  : {
                text    : "取消",
                callback: null
            },
            else    : null
        },
    };
};

Modal.prototype = {
    init: function (userOption) {
        this.render(userOption);
        this.bindEvent();
    },
    render: function (userOption) {
        // 准备数据
        this.option = $.extend({}, this.defaultOption, userOption);
        // 校验
        if (!(this.option.container instanceof jQuery)) {
            return;
        }
    
        let option = this.option;
    
        const inputNumberHTML = _common_util.renderHTML(modalTemplate, option);

        // 渲染页面
        option.container.html(inputNumberHTML);
        option.container.addClass("modal-container");
        this.show();
    },
    bindEvent: function () {
        // 事件处理
        const _this = this;
        const container = this.option.container;

        const confirmCallback = this.option.buttons.confirm.callback;
        const cancelCallback = this.option.buttons.cancel.callback;

        // 确认按钮
        container.on('click', '.btn-confirm', function () {
            let flag = confirmCallback ? confirmCallback() : true;
            flag !== false ? _this.hide() : null;
        });

        // 关闭按钮
        container.on('click', '.btn-cancel', function () {
            let flag = cancelCallback ? cancelCallback() : true;
            flag !== false ? _this.hide() : null;
        });
    },
    show: function () {
        this.option.container.show();
    },
    hide: function () {
        this.option.container.empty();
        this.option.container.hide();
    }
};

module.exports = Modal;