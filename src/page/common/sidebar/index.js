require("./index.css");

const sidebarTemplate = require('./index.string');

const _common_util = require("utils/util.js");

const _sidebar = {
    itemList: [
        {name: 'user-info', desc: '个人信息', font: 'fa-user'},
        {name: 'user-password-update', desc: '修改密码', font: 'fa-lock'},
        {name: 'address-list', desc: '收货地址', font: 'fa-location-arrow'},
        {name: 'order-list', desc: '我的订单', font: 'fa-list'},
    ],
    init: function () {
        this.onLoad();
        this.bindEvents();
        return this;
    },
    onLoad: function () {
        this.loadSidebar();
        // this.setActiveSidebarItem();
    },
    bindEvents: function () {
        $('#user-info').on('click', function () {
            window.location.href = './user-center.html';
        });
        $('#user-password-update').on('click', function () {
            window.location.href = './user-password-update.html';
        });
        $('#address-list').on('click', function () {
            window.location.href = './address-list.html';
        });
        $('#order-list').on('click', function () {
            window.location.href = './order-list.html';
        });
    },
    loadSidebar: function () {
        let itemList = this.itemList;
        let sidebarHTML = "";
        const $sidebar = $(".sidebar");
        
        sidebarHTML = _common_util.renderHTML(sidebarTemplate, {list: itemList});
        $sidebar.html(sidebarHTML);
    }
};

module.exports = _sidebar.init();