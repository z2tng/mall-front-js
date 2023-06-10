require("./index.css");

const _common_util = require("utils/util.js");

const stepHeaderTemplate = require("./index.string");

const StepHeader = function () {
    this.defaultOption = {
        container       : null,
        current         : 1,
        steps           : 1,
    };
};

StepHeader.prototype.render = function (userOption, data) {
    // 准备数据
    this.option = $.extend({}, this.defaultOption, userOption);
    // 校验
    if (!(this.option.container instanceof jQuery)) {
        return;
    }
    if (this.option.steps <= 1) {
        return;
    }

    let option = this.option;
    let start = 1;
    let end = option.steps;

    let stepArray = [];
    for (let i = start; i <= end; i++) {
        stepArray.push({
            id      : i,
            title   : data[i-1].title,
            tip     : data[i-1].tip,
            state   : (i < option.current ? 'finish' : i === option.current ? 'active' : ''),
            final   : i === end,
        });
    }

    const stepHTML = _common_util.renderHTML(stepHeaderTemplate, {
        stepArray: stepArray,
    });
    option.container.html(stepHTML);
};

module.exports = StepHeader;