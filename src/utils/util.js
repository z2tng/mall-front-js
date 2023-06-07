
const config = {
    serverHost: "http://localhost:8090"
}

const _common_util = {
    // 向服务器发送请求
    request: function (param) {
        const _this = this;
        $.ajax({
            type        : param.method || "GET",
            url         : param.url || "",
            dataType    : param.type || "json",
            contentType : param.contentType || "application/json",
            data        : param.data || "",
            xhrFields   : {
                withCredentials: true
            },
            timeout     : 3000,
            success     : function (res) {
                //请求成功，服务器返回0
                if (res.code === 0) {
                    typeof param.success === "function" && param.success(res.data, res.message)
                }
                //请求成功，服务器返回1，表示错误
                else if (res.code === 1) {
                    typeof param.error === "function" && param.error(res.message)
                }
                //请求成功，服务器返回10，表示参数错误
                else if (res.code === 10) {
                    typeof param.error === "function" && param.error(res.message)
                }
                //请求成功，服务器返回11，表示需要登录
                else if (res.code === 11) {
                    _this.toLogin()
                }
            },
            error       : function(err){
                //请求失败，服务器返回HTTP状态码不是200
                typeof param.error === 'function' && param.error(err.statusText);
            }
        })
    },
    // 获取服务器地址
    getServerURL: function (path) {
        return config.serverHost + path;
    },
    // 页面跳转时，获取URL中的参数
    getURLParam: function (name) {
        const paramString = window.location.search.substring(1);
        const regExp = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        const result = paramString.match(regExp)
        return result ? decodeURIComponent(result[2]) : null;
    },
    toLogin: function () {
        window.location.href = './user-login.html?redirect=' + encodeURI(window.location.href);
    },
    validate: function (value, type) {
        // 字符串校验，支持字符串非空校验(require)、手机号码校验(phone)、邮箱格式校验(email)
        value = $.trim(value);
        if (type === 'require') {
            return !!value;
        }
        if (type === 'phone') {
            return /^1\d{10}$/.test(value);
        }
        if (type === 'email') {
            return /^\w+([-+.]\w+])*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value);
        }
    }
}

module.exports = _common_util;