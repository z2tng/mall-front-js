require("./index.css");
require("page/common/nav-top/index.js");
require("page/common/nav-search/index.js");
require("page/common/sidebar/index.js");

const _address = require("page/address/index.js");

const _address_list = {
    init: function () {
        this.onLoad();
        this.bindEvents();
        return this;
    },
    bindEvents: function () {

    },
    onLoad: function () {
        this.loadAddress();
        this.setActiveSidebarItem();
    },
    setActiveSidebarItem: function () {
        $(".sidebar-item").removeClass("sidebar-item-active");
        $("#address-list").addClass("sidebar-item-active");
    },
    loadAddress: function () {
        _address.init($(".address-list-wrapper"));
    },
};

module.exports = _address_list.init();
