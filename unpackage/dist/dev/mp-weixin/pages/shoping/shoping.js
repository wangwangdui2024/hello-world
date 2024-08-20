"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      msg: "hello",
      arr: [
        {
          name: "aa",
          price: 50,
          id: 1
        },
        {
          name: "nb",
          price: 40,
          id: 2
        },
        {
          name: "ba",
          price: 30,
          id: 3
        }
      ]
    };
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => _ctx.tap && _ctx.tap(...args)),
    b: common_vendor.t($data.msg),
    c: common_vendor.f($data.arr, (item, index, i0) => {
      return {
        a: common_vendor.t(item.name),
        b: common_vendor.t(item.price)
      };
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
