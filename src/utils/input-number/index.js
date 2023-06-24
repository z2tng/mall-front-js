require("./index.css");

const inputNumberTemplate = require("./index.string");

const _common_util = require("utils/util.js");

const InputNumber = function () {
    this.defaultOption = {
        container   : null,
        value       : 1,
        min         : 1,
        hasSmaller  : false,
        max         : 100,
        hasBigger   : false,
        size        : 'normal',
        onChange    : null,
    };
};

InputNumber.prototype = {
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
        option.hasSmaller  = option.value > option.min;
        option.hasBigger   = option.value < option.max;
    
        const inputNumberHTML = _common_util.renderHTML(inputNumberTemplate, {
            size       : option.size,
            value      : option.value,
            hasSmaller : option.hasSmaller,
            hasBigger  : option.hasBigger,
        });
    
        option.container.html(inputNumberHTML);
    },
    bindEvent: function () {
        // 事件处理
        const _this = this;
        const container = this.option.container;

        container.off('blur', '.input-number-input').on('blur', '.input-number-input', function () {
            const $this = $(this);
            typeof _this.option.onChange === 'function' ? _this.option.onChange($this.val()) : null;
        });

        container.off('click', '.input-number-up').on('click', '.input-number-up', function () {
            const $this = $(this);
            if ($this.hasClass('disabled')) {
                return;
            }

            const $input = $this.siblings('.input-number-input');
            $input.attr('value', parseInt($input.val()) + 1);
            typeof _this.option.onChange === 'function' ? _this.option.onChange($input.val()) : null;
        });

        container.off('click', '.input-number-down').on('click', '.input-number-down', function () {
            const $this = $(this);
            if ($this.hasClass('disabled')) {
                return;
            }
            
            const $input = $this.siblings('.input-number-input');
            $input.attr('value', parseInt($input.val()) - 1);
            typeof _this.option.onChange === 'function' ? _this.option.onChange($input.val()) : null;
        });
    }
};

module.exports = InputNumber;