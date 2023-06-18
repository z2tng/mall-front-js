require("./index.css");

const paginationTemplate = require("./index.string");

const _common_util = require("utils/util.js");

const Pagination = function () {
    this.defaultOption = {
        container       : null,
        current         : 1,
        pages           : 1,
        hasPreviousPage : false,
        previousPage    : -1,
        hasNextPage     : false,
        nextPage        : -1,
        pageRange       : 2,
        onClickItem     : null,
    };

    // 事件处理
    const _this = this;
    $(document).on('click', '.page-item', function () {
        const $this = $(this);
        if ($this.hasClass('active') || $this.hasClass('disabled')) {
            return;
        }
        typeof _this.option.onClickItem === 'function' ? _this.option.onClickItem($this.data("value")) : null;
    });
};

Pagination.prototype.render = function (userOption) {
    // 准备数据
    this.option = $.extend({}, this.defaultOption, userOption);
    // 校验
    if (!(this.option.container instanceof jQuery)) {
        return;
    }
    if (this.option.pages <= 1) {
        return;
    }

    let option = this.option;
    option.hasPreviousPage  = option.current > 1;
    option.previousPage     = option.current - 1;
    option.hasNextPage      = option.current < option.pages;
    option.nextPage         = option.current + 1;

    let pageArray = [];
    pageArray.push({
        name    : "上一页",
        value   : this.option.previousPage,
        disabled: !this.option.hasPreviousPage,
    })

    let start = (option.current - option.pageRange) > 0 ? (option.current - option.pageRange) : (1);
    let end = (option.current + option.pageRange) > option.pages ? option.pages : (option.current + option.pageRange);

    for (let i = start; i <= end; i++) {
        pageArray.push({
            name    : i,
            value   : i,
            active: (i === option.current),
        });
    }

    pageArray.push({
        name    : "下一页",
        value   : this.option.nextPage,
        disabled: !this.option.hasNextPage,
    });

    const paginationHTML = _common_util.renderHTML(paginationTemplate, {
        pageArray   : pageArray,
        current     : option.current,
        pages       : option.pages,
    });

    option.container.html(paginationHTML);
};

module.exports = Pagination;