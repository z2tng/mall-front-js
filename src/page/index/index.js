require("./index.css");
require("page/common/nav-top/index.js");
require("page/common/nav-search/index.js");
require("utils/unsilder/index.js");

const _common_util = require("utils/util.js");
const bannerHTMLTemplate = require("./banner.string");

$(function() {
    const bannerHTML = _common_util.renderHTML(bannerHTMLTemplate);
    $('.banner-content').html(bannerHTML);
    $('.banner').unslider({
        dots: true,
    });
});