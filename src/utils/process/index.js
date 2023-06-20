require("./index.css");

const _common_util = require("utils/util.js");

const processTemplate = require("./index.string");

const Process = function () {
    this.defaultOption = {
        container   : null,
        current     : 1,
        length      : 1,
        nodes       : [],
        nodeSize    : 'normal',
        activeColor : 'blue',
        lineStyle   : '',
        lineLength  : '100px',
    };

    this.nodeValidate = function (node) {
        let result = {
            status  : false,
            msg     : '',
        };
        if (!_common_util.validate(node, 'font')) {
            result.msg = '节点图标格式不正确';
            return result;
        }
        result.status = true;
        result.msg = '通过验证';
        return result;
    };
};

Process.prototype.render = function (userOption) {
    // 准备数据
    this.option = $.extend({}, this.defaultOption, userOption);
    // 校验
    if (!(this.option.container instanceof jQuery)) {
        return;
    }
    if (this.option.length <= 1) {
        return;
    }
    
    let option = this.option;
    let nodes = option.nodes;

    if (nodes.length > 0) {
        // 校验自定义节点格式
        for (let i = 0, length = nodes.length; i < length; i++) {
            let node = nodes[i];
            let validateResult = this.nodeValidate(node);
            if (!validateResult.status) {
                return;
            }
        }
    }

    let start = 1;
    let end = option.length;
    let titles = option.titles;
    let descs = option.descs;

    let processList = [];
    for (let i = start; i <= end; i++) {
        processList.push({
            id      : i,
            node    : nodes[i-1] ? nodes[i-1] : '',
            title   : titles[i-1],
            desc    : descs[i-1],
            state   : (i < option.current ? 'finish' : i === option.current ? 'active' : ''),
            final   : i >= end,
        });
    }

    
    const processHTML = _common_util.renderHTML(processTemplate, {
        list: processList,
        nodeSize: option.nodeSize,
        activeColor: option.activeColor,
        lineStyle: option.lineStyle,
        lineLength: option.lineLength,
    });
    option.container.html(processHTML);
};

module.exports = Process;