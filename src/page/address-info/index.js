require("./index.css");

const addressInfoTemplate = require("./index.string");

const _common_util = require("utils/util.js");
const _address_service = require("service/address-service.js");

const _address_info = {
    defaultAddressInfo: {
        id: null,
        addressName: '',
        addressProvince: '',
        addressCity: '',
        addressDistrict: '',
        addressDetail: '',
        addressPhone: '',
        addressMobile: '',
        addressZip: '',
    },
    init: function (addressId) {
        this.defaultAddressInfo.id = addressId;
        this.onLoad();
    },
    onLoad: function () {
        this.loadAddressInfo();
    },
    bindEvents: function () {
        const _this = this;
        $(document).on("change", "#address-province", function () {
            let province = $.trim($(this).val());
            _this.updateRegion(province, null, null);
        });
        $(document).on("change", "#address-city", function () {
            let province = $.trim($("#address-province").val());
            let city = $.trim($(this).val());
            _this.updateRegion(province, city, null);
        });
    },
    loadAddressInfo: function () {
        const _this = this;
        let flag = !!this.defaultAddressInfo.id;
        let addressInfoHTML = "";
        let regionData = _common_util.getRegionData();
        if (flag) {
            _address_service.getAddressInfo(JSON.stringify({
                addressId: _this.defaultAddressInfo.id
            }), function (res) {
                regionData = _common_util.getRegionData(
                    res.addressProvince || null,
                    res.addressCity || null,
                    res.addressDistrict || null,
                );
                let data = $.extend({}, res, regionData);
                addressInfoHTML = _common_util.renderHTML(addressInfoTemplate, data);

                $.confirm({
                    boxWidth: "30%",
                    title: "修改地址",
                    content: addressInfoHTML,
                    buttons: {
                        formSubmit: {
                            text: "提交",
                            btnClass: "btn-blue",
                            action: function () {
                                _this.updateAddressInfo();
                                return false;
                            },
                        },
                        cancel: {
                            text: "取消",
                        },
                    },
                    onContentReady: function () {
                        // bind to events
                        const jc = this;
                        this.$content.find("form").on("submit", function (e) {
                            // if the user submits the form by pressing enter the field.
                            e.preventDefault();
                            jc.$formSubmit.trigger("click"); // reference the button and click it
                        });
                        _this.bindEvents();
                    }
                });
            }, function (errMsg) {
                _common_util.errorTips(errMsg);
            });
        } else {
            let data = $.extend({}, this.defaultAddressInfo, regionData);
            addressInfoHTML = _common_util.renderHTML(addressInfoTemplate, data);
            $.confirm({
                boxWidth: "30%",
                title: "添加地址",
                content: addressInfoHTML,
                buttons: {
                    formSubmit: {
                        text: "提交",
                        btnClass: "btn-blue",
                        action: function () {
                            _this.createAddress();
                            return false;
                        },
                    },
                    cancel: {
                        text: "取消",
                    },
                },
                onContentReady: function () {
                    // bind to events
                    const jc = this;
                    this.$content.find("form").on("submit", function (e) {
                        // if the user submits the form by pressing enter the field.
                        e.preventDefault();
                        jc.$formSubmit.trigger("click"); // reference the button and click it
                    });
                    _this.bindEvents();
                }
            });
        }
    },
    // 地区更新事件
    updateRegion: function (province, city, district) {
        const $province = $("#address-province");
        const $city = $("#address-city");
        const $district = $("#address-district");
        const regionData = _common_util.getRegionData(province, city, district);

        // 渲染选项
        $province.html("");
        const provinceList = regionData.provinces;
        for (let i = 0, length = provinceList.length; i < length; i++) {
            provinceList[i].selected
                ? $province.append(`<option value="${provinceList[i].name}" selected="selected">${provinceList[i].name}</option>`)
                : $province.append(`<option value="${provinceList[i].name}">${provinceList[i].name}</option>`);
        }

        $city.html("");
        if (city === null) {
            $city.append(`<option value="" selected="selected">请选择城市</option>`);
        }
        const cityList = regionData.cities;
        for (let i = 0, length = cityList.length; i < length; i++) {
            cityList[i].selected
                ? $city.append(`<option value="${cityList[i].name}" selected="selected">${cityList[i].name}</option>`)
                : $city.append(`<option value="${cityList[i].name}">${cityList[i].name}</option>`);
        }

        $district.html("");
        $district.append(`<option value="" selected="selected">请选择区县</option>`);
        const districtList = regionData.districts;
        for (let i = 0, length = districtList.length; i < length; i++) {
            districtList[i].selected
                ? $district.append(`<option value="${districtList[i].name}" selected="selected">${districtList[i].name}</option>`)
                : $district.append(`<option value="${districtList[i].name}">${districtList[i].name}</option>`);
        }
    },
    // 获取表单信息
    getFormData: function (usage) {
        let formData = {
            id: $.trim($("#address-id").val()),
            addressName: $.trim($("#address-name").val()),
            addressProvince: $.trim($("#address-province").val()),
            addressCity: $.trim($("#address-city").val()),
            addressDistrict: $.trim($("#address-district").val()),
            addressDetail: $.trim($("#address-detail").val()),
            addressPhone: $.trim($("#address-phone").val()),
            addressMobile: $.trim($("#address-mobile").val()),
            addressZip: $.trim($("#address-zip").val()),
        };
        usage === "create" && delete formData.id;
        return formData;
    },
    // 新增地址
    createAddress: function () {
        let formData = this.getFormData("create");
        const validateResult = this.formDataValidate(formData);

        if (validateResult.status) {
            _address_service.addAddress(JSON.stringify(formData), function () {
                _common_util.successTips("新增地址成功！");
                _common_util.toAddressList();
            }, function (errorMsg) {
                $.alert({
                    boxWidth: "30%",
                    title: "添加地址失败",
                    content: errorMsg,
                });
            });
        } else {
            $.alert({
                boxWidth: "30%",
                title: "添加地址失败",
                content: validateResult.msg,
            });
        }
    },
    // 更新地址
    updateAddressInfo: function () {
        let formData = this.getFormData("update");
        const validateResult = this.formDataValidate(formData);

        if (validateResult.status) {
            _address_service.updateAddress(JSON.stringify(formData), function (res) {
                _common_util.successTips("修改地址成功！");
                _common_util.toAddressList();
            }, function (errorMsg) {
                $.alert({
                    boxWidth: "30%",
                    title: "更新地址失败",
                    content: errorMsg,
                });
            });
        } else {
            $.alert({
                boxWidth: "30%",
                title: "更新地址失败",
                content: validateResult.msg,
            });
        }
    },
    // 表单验证
    formDataValidate: function (formData) {
        let result = {
            status: false,
            msg: "",
        };
        if (formData.id && !_common_util.validate(formData.id, "require")) {
            result.msg = "地址ID";
            return result;
        }
        if (!_common_util.validate(formData.addressName, "require")) {
            result.msg = "收件人不能为空";
            return result;
        }
        if (!_common_util.validate(formData.addressProvince, "require")) {
            result.msg = "省份不能为空";
            return result;
        }
        if (!_common_util.validate(formData.addressCity, "require")) {
            result.msg = "城市不能为空";
            return result;
        }
        if (!_common_util.validate(formData.addressDistrict, "require")) {
            result.msg = "区县不能为空";
            return result;
        }
        if (!_common_util.validate(formData.addressDetail, "require")) {
            result.msg = "详细地址不能为空";
            return result;
        }
        if (!_common_util.validate(formData.addressMobile, "require")) {
            result.msg = "移动电话不能为空";
            return result;
        }
        if (!_common_util.validate(formData.addressMobile, "phone")) {
            result.msg = "移动电话格式不正确";
            return result;
        }
        result.status = true;
        result.msg = "通过验证";
        return result;
    },
};

module.exports = _address_info;
