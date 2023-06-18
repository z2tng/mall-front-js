require("./index.css");
require("page/common/nav-top/index.js");
require("page/common/nav-search/index.js");
require("page/common/sidebar/index.js");
require("utils/jconfirm/index.js");

const addressListTemplate = require("./index.string");

const _address_info = require("page/address-info/index.js");
const _common_util = require("utils/util.js");
const _address_service = require("service/address-service.js");

const _address_list = {
    title: "收货地址",
    init: function () {
        this.onLoad();
        this.bindEvents();
        return this;
    },
    bindEvents: function () {
        const _this = this;
        $(document).on("click", ".address-list-item", function () {
            const addressId = $.trim($(this).attr("data-value"));
            // 弹出修改地址模态框
            _address_info.init(addressId);
        });

        $(document).on("click", ".address-add-item", function () {
            // 弹出修改地址模态框
            _address_info.init();
        });

        $(document).on("click", ".delete-btn", function () {
            const addressId = $.trim($(this).parent().attr("data-value"));
            _this.deleteAddress(addressId);
            return false;
        });
    },
    onLoad: function () {
        this.loadAddressList();
        this.setActiveSidebarItem();
    },
    setActiveSidebarItem: function () {
        $(".sidebar-item").removeClass("sidebar-item-active");
        $("#address-list").addClass("sidebar-item-active");
    },
    loadAddressList: function () {
        let addressListInfoHTML = "";
        const _this = this;
        const $main = $(".main");

        _address_service.getAddressList(function (res) {
            addressListInfoHTML = _common_util.renderHTML(addressListTemplate, {
                title: _this.title,
                list : res,
            });
            $main.html(addressListInfoHTML);
        }, function (errorMsg) {
            _common_util.errorTips(errorMsg);
        });
    },
    // 删除地址
    deleteAddress: function (addressId) {
        if (addressId === null) {
            _common_util.errorTips("删除地址失败，地址不存在！");
            return;
        }

        $.confirm({
            boxWidth: "30%",
            title: "删除地址",
            content: "确认删除该地址？",
            buttons: {
                confirm: {
                    text: "确认",
                    btnClass: "btn-blue",
                    action: function () {
                        _address_service.deleteAddress(JSON.stringify({
                            addressId: addressId,
                        }), function () {
                            _common_util.successTips("删除地址成功！");
                            _common_util.toAddressList();
                        }, function (errorMsg) {
                            $.alert({
                                boxWidth: "30%",
                                title: "删除地址失败",
                                content: errorMsg,
                            });
                        });
                    },
                },
                cancel: {
                    text: "取消",
                },
            },
        });
    },
};

module.exports = _address_list.init();
