require("utils/jconfirm/index.js");

const region = require("data/pca.json");

const Hogan = require("hogan.js");

const config = {
    serverHost: "http://localhost:8090",
};

const _common_util = {
    // 向服务器发送请求
    request: function (param) {
        const _this = this;
        $.ajax({
            type: param.method || "GET",
            url: param.url || "",
            dataType: param.type || "json",
            contentType: param.contentType || "application/json",
            data: param.data || "",
            xhrFields: {
                withCredentials: true,
            },
            timeout: 3000,
            success: function (res) {
                //请求成功，服务器返回0
                if (res.code === 0) {
                    typeof param.success === "function" && param.success(res.data, res.message);
                }
                //请求成功，服务器返回1，表示错误
                else if (res.code === 1) {
                    typeof param.error === "function" && param.error(res.message);
                }
                //请求成功，服务器返回10，表示参数错误
                else if (res.code === 10) {
                    typeof param.error === "function" && param.error(res.message);
                }
                //请求成功，服务器返回11，表示需要登录
                else if (res.code === 11) {
                    _this.toLogin();
                }
            },
            error: function (err) {
                //请求失败，服务器返回HTTP状态码不是200
                typeof param.error === "function" && param.error(err.statusText);
            },
        });
    },
    // 获取服务器地址
    getServerURL: function (path) {
        return config.serverHost + path;
    },
    // 页面跳转时，获取URL中的参数
    getURLParam: function (name) {
        const paramString = window.location.search.substring(1);
        const regExp = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        const result = paramString.match(regExp);
        return result ? decodeURIComponent(result[2]) : null;
    },
    // 跳转到首页
    toMain: function () {
        window.location.href = "./index.html";
    },
    // 跳转到登录界面
    toLogin: function () {
        window.location.href = "./user-login.html?redirect=" + encodeURI(window.location.href);
    },
    // 跳转到地址列表界面
    toAddressList: function () {
        window.location.href = "./address-list.html";
    },
    // 校验字符串
    validate: function (value, type) {
        // 字符串校验，支持字符串非空校验(require)、手机号码校验(phone)、邮箱格式校验(email)
        value = $.trim(value);
        if (type === "require") {
            return !!value;
        }
        if (type === "phone") {
            return /^1\d{10}$/.test(value);
        }
        if (type === "email") {
            return /^\w+([-+.]\w+])*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value);
        }
    },
    // 成功提示
    renderHTML: function (templateHTML, data) {
        const template = Hogan.compile(templateHTML);
        const resultHTML = template.render(data);
        return resultHTML;
    },
    // 错误提示
    errorTips: function (msg) {
        alert(msg || "出现错误，请重试");
    },
    // 成功提示
    successTips: function (msg) {
        alert(msg || "操作成功");
    },
    getRegionData: function (province, city, district) {
        let result = {
            provinces: [],
            cities: [],
            districts: [],
        };

        // 获取省份信息
        for (const key in region) {
            if (Object.hasOwnProperty.call(region, key)) {
                result.provinces.push({
                    name: key,
                    selected: key === province,
                });
            }
        }
        if (!province) {
            return result;
        }

        // 获取城市信息
        let currentProvince = region[province];
        for (const key in currentProvince) {
            if (Object.hasOwnProperty.call(currentProvince, key)) {
                result.cities.push({
                    name: key,
                    selected: key === city,
                });
            }
        }
        if (!city) {
            return result;
        }

        // 获取区县信息，最后一级的数据格式为数组
        let currentCity = currentProvince[city];
        for (const key in currentCity) {
            if (Object.hasOwnProperty.call(currentCity, key)) {
                result.districts.push({
                    name: currentCity[key],
                    selected: currentCity[key] === district,
                });
            }
        }
        return result;
    },
};

module.exports = _common_util;
