require("./index.css");

const _sidebar = {
    init: function () {
        this.bindEvents();
        return this;
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
};

module.exports = _sidebar.init();