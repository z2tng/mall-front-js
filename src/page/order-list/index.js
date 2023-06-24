require("./index.css");
require("page/common/nav-top/index.js");
require("page/common/nav-search/index.js");
require("page/common/sidebar/index.js");

const orderListTemplate = require("./index.string");

const _common_util = require("utils/util.js");
const _order_service = require("service/order-service.js");

const Pagination = require("utils/pagination/index.js");

const _order_list = {
    requestParam: {
        pageNum: 1,
        pageSize: 10,
    },
    init: function () {
        this.onLoad();
        this.bindEvents();
        return this;
    },
    bindEvents: function () {
    },
    onLoad: function () {
        this.loadOrderList();
        this.setActiveSidebarItem();
    },
    setActiveSidebarItem: function () {
        $(".sidebar-item").removeClass("sidebar-item-active");
        $("#order-list").addClass("sidebar-item-active");
    },
    loadOrderList: function () {
        let requestParam = this.requestParam;
        let orderListHTML = "";
        const $orderListContent = $(".order-list-content");
        const _this = this;

        _order_service.getOrderList(requestParam, function (res) {
            let orderVOList = res.records;
            orderVOList.forEach(function (orderVO) {
                orderVO.statusDesc = _common_util.getStatusDesc(orderVO.status);
            });
            orderListHTML = _common_util.renderHTML(orderListTemplate, {list: orderVOList});
            $orderListContent.html(orderListHTML);

            _this.loadPagination(res.current, res.pages);
        }, function (errorMsg) {
            _common_util.errorTips(errorMsg);
        });
    },
    // 加载分页插件
    loadPagination: function (current, pages) {
        const _this = this;
        this.pagination ? "" : (this.pagination = new Pagination());
        this.pagination.render({
            container       : $('.pagination'),
            current         : current,
            pages           : pages,
            onClickItem     : function (current) {
                console.log(current);
                _this.requestParam.pageNum = current;
                _this.loadProductList();
            },
        });
    },
    // 删除订单
    deleteOrder: function (orderNo) {
        if (orderNo === null) {
            _common_util.errorTips("删除订单失败，地址不存在！");
            return;
        }
    },
};

$(function(){
    _order_list.init();
});
