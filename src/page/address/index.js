require("./index.css");

const addressListTemplate = require("./index.string");
const addressInfoTemplate = require("./info.string");

const _common_util = require("utils/util.js");
const _address_service = require("service/address-service.js");

const Modal = require("utils/modal/index.js");

const _address = {
    container: null,
    defaultAddressInfo: {
        id              : null,
        addressName     : "",
        addressProvince : "",
        addressCity     : "",
        addressDistrict : "",
        addressDetail   : "",
        addressPhone    : "",
        addressMobile   : "",
        addressZip      : "",
    },
    init: function (container) {
        this.container = container;
        this.onLoad();
        this.bindEvents();
    },
    onLoad: function () {
        this.loadAddressList();
    },
    reloadPage: function () {
        window.location.reload();
    },
    bindEvents: function () {
        const _this = this;

        // 地址框事件绑定：鼠标移入移出、单击、双击
        $(document).on("mouseenter", ".address-list-item", function () {
            $(this).find(".item-footer").show();
        });
        $(document).on("mouseleave", ".address-list-item", function () {
            $(this).find(".item-footer").hide();
        });
        $(document).on("click", ".address-list-item", function () {
            const $this = $(this);
            $this.addClass("active").siblings(".address-list-item").removeClass("active");
        });
        $(document).on("dblclick", ".address-list-item", function () {
            _this.loadAddressInfo();
        });
        // 地址框事件绑定：添加、修改、删除
        $(document).on("click", ".address-add-item", function () {
            _this.loadAddressInfo();
        });
        $(document).on("click", ".modify-btn", function () {
            const addressId = $.trim($(this).parents(".address-list-item").data("id"));
            _this.loadAddressInfo(addressId);
        });
        $(document).on("click", ".delete-btn", function () {
            const addressId = $.trim($(this).parents(".address-list-item").data("id"));
            _this.deleteAddress(addressId);
            return false;
        });

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
    loadAddressList: function () {
        let addressListHTML = "";
        const container = this.container;

        const _this = this;
        _address_service.getAddressList(function (res) {
            addressListHTML = _common_util.renderHTML(addressListTemplate, {list: res});
            container.html(addressListHTML);
        }, function (errorMsg) {
            _common_util.errorTips(errorMsg);
        });
    },
    loadAddressInfo: function (addressId) {
        const _this = this;
        let flag = !!addressId;
        let addressInfoHTML = "";
        let regionData = _common_util.getRegionData();

        if (flag) {
            _address_service.getAddressInfo(JSON.stringify({
                addressId: addressId
            }), function (res) {
                regionData = _common_util.getRegionData(
                    res.addressProvince || null,
                    res.addressCity || null,
                    res.addressDistrict || null,
                );
                let data = $.extend({}, res, regionData);

                addressInfoHTML = _common_util.renderHTML(addressInfoTemplate, data);
                _this.popModal("修改地址", addressInfoHTML, function () {
                    _this.updateAddressInfo(addressId);
                    return false;
                });

            }, function (errMsg) {
                _common_util.errorTips(errMsg);
            });
        } else {
            let data = $.extend({}, this.defaultAddressInfo, regionData);
            addressInfoHTML = _common_util.renderHTML(addressInfoTemplate, data);
            _this.popModal("添加地址", addressInfoHTML, function () {
                _this.createAddress();
                return false;
            });
        }
    },
    // 弹出模态框
    popModal: function (title, content, confirmCallback) {
        this.modal ? "" : (this.modal = new Modal());
        this.modal.init({
            container: $("#modal-container"),
            title: title,
            content: content,
            buttons: {
                confirm: {
                    text: "确认",
                    callback: confirmCallback,
                },
                cancel: {
                    text: "取消",
                },
            }
        });
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

        const _this = this;
        if (validateResult.status) {
            _address_service.addAddress(JSON.stringify(formData), function () {
                _common_util.successTips("新增地址成功！");
                _this.reloadPage();
            }, function (errorMsg) {
                _common_util.errorTips(errorMsg);
            });
        } else {
            _common_util.errorTips(validateResult.msg);
        }
    },
    // 更新地址
    updateAddressInfo: function () {
        let formData = this.getFormData("update");
        const validateResult = this.formDataValidate(formData);

        const _this = this;
        if (validateResult.status) {
            _address_service.updateAddress(JSON.stringify(formData), function (res) {
                _common_util.successTips("修改地址成功！");
                _this.reloadPage();
            }, function (errorMsg) {
                _common_util.errorTips(errorMsg);
            });
        } else {
            _common_util.errorTips(validateResult.msg);
        }
    },
    // 删除地址
    deleteAddress: function (addressId) {
        if (addressId === null) {
            _common_util.errorTips("删除地址失败，地址不存在！");
            return;
        }

        const _this = this;
        this.popModal("删除地址", "确认删除该地址？", function () {
            _address_service.deleteAddress(JSON.stringify({
                addressId: addressId,
            }), function () {
                _common_util.successTips("删除地址成功！");
                _this.reloadPage();
            }, function (errorMsg) {
                _common_util.errorTips(errorMsg);
            });
        });
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

module.exports = _address;
