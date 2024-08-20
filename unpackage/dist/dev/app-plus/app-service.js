if (typeof Promise !== "undefined" && !Promise.prototype.finally) {
  Promise.prototype.finally = function(callback) {
    const promise = this.constructor;
    return this.then(
      (value) => promise.resolve(callback()).then(() => value),
      (reason) => promise.resolve(callback()).then(() => {
        throw reason;
      })
    );
  };
}
;
if (typeof uni !== "undefined" && uni && uni.requireGlobal) {
  const global = uni.requireGlobal();
  ArrayBuffer = global.ArrayBuffer;
  Int8Array = global.Int8Array;
  Uint8Array = global.Uint8Array;
  Uint8ClampedArray = global.Uint8ClampedArray;
  Int16Array = global.Int16Array;
  Uint16Array = global.Uint16Array;
  Int32Array = global.Int32Array;
  Uint32Array = global.Uint32Array;
  Float32Array = global.Float32Array;
  Float64Array = global.Float64Array;
  BigInt64Array = global.BigInt64Array;
  BigUint64Array = global.BigUint64Array;
}
;
if (uni.restoreGlobal) {
  uni.restoreGlobal(Vue, weex, plus, setTimeout, clearTimeout, setInterval, clearInterval);
}
(function(vue) {
  "use strict";
  function saveData(key, data) {
    uni.setStorageSync(key, data);
  }
  function loadData(key) {
    return uni.getStorageSync(key) || [];
  }
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _sfc_main$d = {
    data() {
      return {
        items: [],
        // 初始化 items 数组
        filteredItems: [],
        // 过滤后的 items
        searchQuery: "",
        // 搜索关键词
        canvasWidth: "750px"
        // 默认宽度
      };
    },
    mounted() {
      this.loadData();
      this.filterItems();
    },
    onShow() {
      this.items = loadData("inventory");
      this.drawBarChart();
      this.showTemporaryToast();
    },
    methods: {
      navigateToStockCheck() {
        uni.navigateTo({
          url: "/pages/xinzeng/xinzeng",
          events: {
            sendDataBack: (data) => {
              this.items = data;
              this.drawBarChart();
              this.filterItems();
            }
          }
        });
      },
      navigateToStockCheck1() {
        uni.navigateTo({
          url: "/pages/shoppingcart/shoppingcart"
        });
      },
      showTemporaryToast() {
        uni.showToast({
          title: "柱状图可以往右拉动",
          icon: "none",
          // 可以选择 'success', 'loading', 'none'
          duration: 2e3
          // 提示框显示的时间（毫秒）
        });
      },
      filterItems() {
        const query = this.searchQuery.toLowerCase();
        this.filteredItems = this.items.filter((item) => {
          return item.name.toLowerCase().includes(query) || item.description && item.description.toLowerCase().includes(query);
        });
      },
      loadData() {
        const storedItems = uni.getStorageSync("inventory");
        if (storedItems) {
          this.items = storedItems;
        }
        this.items = loadData("inventory");
        this.filterItems();
      },
      drawBarChart() {
        const context = uni.createCanvasContext("barChart", this);
        if (this.items.length === 0)
          return;
        const quantities = this.items.map((item) => item.number);
        const names = this.items.map((item) => item.name);
        const maxQuantity = Math.max(...quantities) || 1;
        const canvasWidth = uni.upx2px(750);
        const canvasHeight = uni.upx2px(400);
        const itemCount = this.items.length;
        const barPadding = 20;
        const barWidth = Math.max((canvasWidth - barPadding * (itemCount + 1)) / itemCount, 30);
        const spacing = barPadding;
        context.clearRect(0, 0, canvasWidth, canvasHeight);
        quantities.forEach((quantity, index) => {
          const barHeight = quantity / maxQuantity * (canvasHeight - 40);
          const x = index * (barWidth + spacing) + spacing;
          const y = canvasHeight - barHeight;
          context.setFillStyle("#4CAF50");
          context.fillRect(x, y, barWidth, barHeight);
          const name = names[index];
          context.setFontSize(24);
          let nameWidth = context.measureText(name).width;
          let adjustedFontSize = 24;
          while (nameWidth > barWidth - 10 && adjustedFontSize > 8) {
            adjustedFontSize -= 2;
            context.setFontSize(adjustedFontSize);
            nameWidth = context.measureText(name).width;
          }
          const textX = x + (barWidth - nameWidth) / 2;
          const textY = canvasHeight - 10;
          context.setFillStyle("#000");
          context.setFontSize(adjustedFontSize);
          context.fillText(name, textX, textY);
          const quantityText = quantity.toString();
          const quantityWidth = context.measureText(quantityText).width;
          context.setFillStyle("#000");
          context.setFontSize(adjustedFontSize);
          context.fillText(quantityText, x + (barWidth - quantityWidth) / 2, y - 10);
        });
        context.draw();
      }
    }
  };
  function _sfc_render$c(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      vue.Fragment,
      null,
      [
        vue.createElementVNode("view", { class: "container" }, [
          vue.withDirectives(vue.createElementVNode(
            "input",
            {
              type: "text",
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.searchQuery = $event),
              placeholder: "搜索商品",
              onInput: _cache[1] || (_cache[1] = (...args) => $options.filterItems && $options.filterItems(...args)),
              class: "search-box"
            },
            null,
            544
            /* NEED_HYDRATION, NEED_PATCH */
          ), [
            [vue.vModelText, $data.searchQuery]
          ])
        ]),
        vue.createElementVNode("view", { class: "container" }, [
          vue.createElementVNode("view", { class: "header" }, [
            vue.createElementVNode("button", {
              class: "button",
              onClick: _cache[2] || (_cache[2] = (...args) => $options.navigateToStockCheck && $options.navigateToStockCheck(...args)),
              type: "primary"
            }, "库存盘点"),
            vue.createElementVNode("button", {
              class: "button",
              onClick: _cache[3] || (_cache[3] = (...args) => $options.navigateToStockCheck1 && $options.navigateToStockCheck1(...args)),
              type: "primary"
            }, "商品进货")
          ]),
          vue.createCommentVNode(" 添加滚动容器 "),
          vue.createElementVNode("scroll-view", {
            "scroll-x": "true",
            class: "scroll-view"
          }, [
            vue.createElementVNode("canvas", {
              "canvas-id": "barChart",
              class: "chart"
            })
          ])
        ]),
        vue.createCommentVNode("search"),
        vue.createElementVNode("view", { class: "ziti" }, "搜索结果："),
        vue.createElementVNode("view", { class: "container" }, [
          vue.createElementVNode("view", { class: "table" }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($data.filteredItems, (item, index) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  class: "table-row",
                  key: index
                }, [
                  vue.createElementVNode(
                    "view",
                    { class: "table-cell" },
                    vue.toDisplayString(item.name),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "view",
                    { class: "table-cell" },
                    vue.toDisplayString(item.description),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "view",
                    { class: "table-cell" },
                    vue.toDisplayString(item.number) + " " + vue.toDisplayString(item.unit),
                    1
                    /* TEXT */
                  )
                ]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ])
        ])
      ],
      64
      /* STABLE_FRAGMENT */
    );
  }
  const PagesShopingShoping = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["render", _sfc_render$c], ["__file", "C:/Users/86181/Documents/WeChat Files/wxid_615clanckg0q22/FileStorage/File/2024-08/sprint1/sprint1（初步）/baitan1/pages/shoping/shoping.vue"]]);
  const _sfc_main$c = {
    data() {
      return {
        items: [],
        // 存储进货项的数组
        showDialog: false,
        // 控制对话框的显示
        newItem: {
          name: "",
          price: 0,
          quantity: 0
        }
      };
    },
    methods: {
      showAddDialog() {
        this.showDialog = true;
      },
      addItem() {
        if (this.newItem.name && this.newItem.price > 0 && this.newItem.quantity > 0) {
          this.items.push({ ...this.newItem });
          this.newItem = { name: "", price: 0, quantity: 0 };
          this.showDialog = false;
          this.saveItems();
        } else {
          uni.showToast({ title: "请填写完整信息", icon: "none" });
        }
      },
      saveItems() {
        uni.setStorageSync("items", this.items);
      },
      loadItems() {
        const storedItems = uni.getStorageSync("items");
        if (storedItems) {
          this.items = storedItems;
        }
      }
    },
    onShow() {
      this.loadItems();
    }
  };
  function _sfc_render$b(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_u_dialog = vue.resolveComponent("u-dialog");
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createElementVNode("view", { class: "header" }, [
        vue.createElementVNode("text", { class: "title" }, "进货管理"),
        vue.createElementVNode("button", {
          class: "add-btn",
          onClick: _cache[0] || (_cache[0] = (...args) => $options.showAddDialog && $options.showAddDialog(...args))
        }, "添加新项")
      ]),
      vue.createElementVNode("view", { class: "content" }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($data.items, (item, index) => {
            return vue.openBlock(), vue.createElementBlock("view", {
              key: index,
              class: "item"
            }, [
              vue.createElementVNode(
                "text",
                { class: "item-name" },
                vue.toDisplayString(item.name),
                1
                /* TEXT */
              ),
              vue.createElementVNode(
                "text",
                { class: "item-price" },
                "￥" + vue.toDisplayString(item.price),
                1
                /* TEXT */
              ),
              vue.createElementVNode(
                "text",
                { class: "item-quantity" },
                "数量: " + vue.toDisplayString(item.quantity),
                1
                /* TEXT */
              )
            ]);
          }),
          128
          /* KEYED_FRAGMENT */
        ))
      ]),
      vue.createVNode(_component_u_dialog, {
        modelValue: $data.showDialog,
        "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => $data.showDialog = $event),
        title: "添加新项",
        "show-cancel": true,
        onConfirm: $options.addItem
      }, {
        default: vue.withCtx(() => [
          vue.createElementVNode("view", { class: "dialog-content" }, [
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $data.newItem.name = $event),
                placeholder: "产品名称"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.newItem.name]
            ]),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $data.newItem.price = $event),
                type: "number",
                placeholder: "价格"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [
                vue.vModelText,
                $data.newItem.price,
                void 0,
                { number: true }
              ]
            ]),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $data.newItem.quantity = $event),
                type: "number",
                placeholder: "数量"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [
                vue.vModelText,
                $data.newItem.quantity,
                void 0,
                { number: true }
              ]
            ])
          ])
        ]),
        _: 1
        /* STABLE */
      }, 8, ["modelValue", "onConfirm"])
    ]);
  }
  const PagesStoreStore = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["render", _sfc_render$b], ["__scopeId", "data-v-c1a2745a"], ["__file", "C:/Users/86181/Documents/WeChat Files/wxid_615clanckg0q22/FileStorage/File/2024-08/sprint1/sprint1（初步）/baitan1/pages/store/store.vue"]]);
  const _sfc_main$b = {
    data() {
      return {
        items1: []
        // 定义 items1 属性
      };
    },
    methods: {
      toadd() {
        this.items1 = this.items1.map((item) => ({
          ...item,
          number: item.number + 1
        }));
        this.saveData();
      },
      todelete() {
        this.items1 = this.items1.map((item) => ({
          ...item,
          number: item.number - 1
        }));
        this.saveData();
      },
      addItem() {
        uni.showModal({
          title: "新增商品",
          content: "请输入商品名,价格和销售量（用空格分隔）",
          editable: true,
          placeholderText: "商品名 销售价格 销售量 单位",
          success: (res) => {
            if (res.confirm) {
              const newValues = res.content.split(" ");
              if (newValues.length >= 4) {
                const newItem = {
                  name: newValues[0].trim(),
                  price: parseFloat(newValues[1].trim()) || 0,
                  number: parseFloat(newValues[2].trim()) || 0,
                  unit: newValues[3].trim()
                };
                this.items1.push(newItem);
                this.saveData();
              } else {
                uni.showToast({
                  title: '输入格式错误，请输入"商品名 销售价格 数量 单位"',
                  icon: "none"
                });
              }
            }
          }
        });
      },
      editItem(index) {
        const item = this.items1[index];
        uni.showModal({
          title: "编辑商品",
          content: `当前商品名：${item.name}
售价：${item.price}当前数量：${item.number} ${item.unit}`,
          editable: true,
          placeholderText: '请输入新的商品名和数量，使用空格隔开，如"商品名 50 10 kg"',
          success: (res) => {
            if (res.confirm) {
              const newValues = res.content.split(" ");
              if (newValues.length >= 4) {
                this.items1[index].name = newValues[0].trim();
                this.items1[index].price = parseFloat(newValues[1].trim()) || 0;
                this.items1[index].number = parseFloat(newValues[2].trim()) || 0;
                this.items1[index].unit = newValues[3].trim();
                this.saveData();
              } else {
                uni.showToast({
                  title: '输入格式错误，请输入"商品名 售价 销售量 单位"',
                  icon: "none"
                });
              }
            }
          }
        });
      },
      deleteItem(index) {
        this.items1.splice(index, 1);
        this.saveData();
        uni.showToast({
          title: `删除商品${index + 1}`,
          icon: "none"
        });
      },
      saveData() {
        uni.setStorageSync("inventory1", this.items1);
      },
      saveAndNavigateBack() {
        this.saveData();
        const eventChannel = this.getOpenerEventChannel();
        if (eventChannel) {
          eventChannel.emit("updateChart", this.items1);
        }
      }
    },
    onLoad() {
      const storedItems1 = uni.getStorageSync("inventory1");
      this.items1 = storedItems1;
    },
    onUnload() {
      this.saveData();
    }
  };
  function _sfc_render$a(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      vue.Fragment,
      null,
      [
        vue.createElementVNode("view", { class: "container" }, [
          vue.createElementVNode("view", { class: "header" }, [
            vue.createElementVNode("text", { class: "title" }, "销售记录"),
            vue.createElementVNode("button", {
              class: "add-button",
              onClick: _cache[0] || (_cache[0] = (...args) => $options.addItem && $options.addItem(...args))
            }, "录入订单")
          ]),
          vue.createElementVNode("view", { class: "table" }, [
            vue.createElementVNode("view", { class: "table-row1" }, [
              vue.createElementVNode("view", { class: "table-header" }, "商品名"),
              vue.createElementVNode("view", { class: "table-header" }, "单价"),
              vue.createElementVNode("view", { class: "table-header" }, "销售量"),
              vue.createElementVNode("view", { class: "table-header" }, "操作")
            ]),
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($data.items1, (item, index) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  class: "table-row",
                  key: index
                }, [
                  vue.createElementVNode(
                    "view",
                    { class: "table-cell" },
                    vue.toDisplayString(item.name),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "view",
                    { class: "table-cell" },
                    vue.toDisplayString(item.price),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "view",
                    { class: "table-cell" },
                    vue.toDisplayString(item.number) + " " + vue.toDisplayString(item.unit),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode("view", { class: "table-cell" }, [
                    vue.createElementVNode("button", {
                      class: "action-button",
                      onClick: ($event) => $options.editItem(index)
                    }, "编辑", 8, ["onClick"]),
                    vue.createElementVNode("button", {
                      class: "action-button",
                      onClick: ($event) => $options.deleteItem(index)
                    }, "删除", 8, ["onClick"])
                  ])
                ]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ])
        ]),
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($data.items1, (item, index) => {
            return vue.openBlock(), vue.createElementBlock("view", {
              key: index,
              class: "disable"
            }, [
              vue.createElementVNode("button", {
                onClick: _cache[1] || (_cache[1] = (...args) => $options.toadd && $options.toadd(...args)),
                size: "mini"
              }, "销售量+1"),
              vue.createElementVNode("button", {
                onClick: _cache[2] || (_cache[2] = (...args) => $options.todelete && $options.todelete(...args)),
                size: "mini"
              }, "销售量-1"),
              vue.createElementVNode(
                "view",
                null,
                "商品名：" + vue.toDisplayString(item.name),
                1
                /* TEXT */
              ),
              vue.createElementVNode(
                "view",
                null,
                "销售量：" + vue.toDisplayString(item.number) + vue.toDisplayString(item.unit),
                1
                /* TEXT */
              ),
              vue.createElementVNode(
                "view",
                null,
                "销售额：" + vue.toDisplayString(item.number * item.price),
                1
                /* TEXT */
              )
            ]);
          }),
          128
          /* KEYED_FRAGMENT */
        )),
        vue.createElementVNode("button", {
          class: "save-button",
          onClick: _cache[3] || (_cache[3] = (...args) => $options.saveAndNavigateBack && $options.saveAndNavigateBack(...args))
        }, "保存")
      ],
      64
      /* STABLE_FRAGMENT */
    );
  }
  const PagesMoneyMoney = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["render", _sfc_render$a], ["__file", "C:/Users/86181/Documents/WeChat Files/wxid_615clanckg0q22/FileStorage/File/2024-08/sprint1/sprint1（初步）/baitan1/pages/money/money.vue"]]);
  const _sfc_main$a = {
    data() {
      return {
        startDate: "2024-01-01",
        endDate: "2024-12-31",
        totalSales: 0,
        totalOrders: 0,
        averageOrderValue: 0,
        salesDetails: []
      };
    },
    methods: {
      async updateReport() {
        const data = await storageService.getSalesData();
        const filteredData = data.filter((item) => item.date >= this.startDate && item.date <= this.endDate);
        this.totalSales = filteredData.reduce((acc, item) => acc + item.sales, 0);
        this.totalOrders = filteredData.reduce((acc, item) => acc + item.orders, 0);
        this.averageOrderValue = this.totalOrders === 0 ? 0 : this.totalSales / this.totalOrders;
        this.salesDetails = this.formatSalesDetails(filteredData);
      },
      formatSalesDetails(data) {
        const details = [];
        data.forEach((item) => {
          const existing = details.find((detail) => detail.date === item.date);
          if (existing) {
            existing.orders += item.orders;
            existing.sales += item.sales;
          } else {
            details.push({
              date: item.date,
              orders: item.orders,
              sales: item.sales
            });
          }
        });
        return details;
      },
      startDateChange(e) {
        this.startDate = e.detail.value;
        this.updateReport();
      },
      endDateChange(e) {
        this.endDate = e.detail.value;
        this.updateReport();
      }
    },
    mounted() {
      this.updateReport();
    },
    filters: {
      formatCurrency(value) {
        if (!value)
          return "0.00";
        return (value / 100).toFixed(2);
      }
    }
  };
  function _sfc_render$9(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createCommentVNode(" 时间段选择器 "),
      vue.createElementVNode("view", { class: "date-picker" }, [
        vue.createElementVNode(
          "picker",
          {
            mode: "date",
            onChange: _cache[0] || (_cache[0] = (...args) => $options.startDateChange && $options.startDateChange(...args))
          },
          [
            vue.createElementVNode(
              "view",
              { class: "picker-item" },
              "开始日期：" + vue.toDisplayString($data.startDate),
              1
              /* TEXT */
            )
          ],
          32
          /* NEED_HYDRATION */
        ),
        vue.createElementVNode(
          "picker",
          {
            mode: "date",
            onChange: _cache[1] || (_cache[1] = (...args) => $options.endDateChange && $options.endDateChange(...args))
          },
          [
            vue.createElementVNode(
              "view",
              { class: "picker-item" },
              "结束日期：" + vue.toDisplayString($data.endDate),
              1
              /* TEXT */
            )
          ],
          32
          /* NEED_HYDRATION */
        )
      ]),
      vue.createCommentVNode(" 报表统计数据 "),
      vue.createElementVNode("view", { class: "report-summary" }, [
        vue.createElementVNode("view", { class: "summary-item" }, [
          vue.createTextVNode("总销售额："),
          vue.createElementVNode(
            "text",
            { class: "value" },
            vue.toDisplayString($data.totalSales | _ctx.formatCurrency),
            1
            /* TEXT */
          )
        ]),
        vue.createElementVNode("view", { class: "summary-item" }, [
          vue.createTextVNode("总订单数："),
          vue.createElementVNode(
            "text",
            { class: "value" },
            vue.toDisplayString($data.totalOrders),
            1
            /* TEXT */
          )
        ]),
        vue.createElementVNode("view", { class: "summary-item" }, [
          vue.createTextVNode("平均订单值："),
          vue.createElementVNode(
            "text",
            { class: "value" },
            vue.toDisplayString($data.averageOrderValue | _ctx.formatCurrency),
            1
            /* TEXT */
          )
        ])
      ]),
      vue.createCommentVNode(" 销售详情 "),
      vue.createElementVNode("view", { class: "sales-details" }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($data.salesDetails, (item, index) => {
            return vue.openBlock(), vue.createElementBlock("view", {
              key: index,
              class: "detail-item"
            }, [
              vue.createElementVNode("view", null, [
                vue.createTextVNode("日期："),
                vue.createElementVNode(
                  "text",
                  { class: "date" },
                  vue.toDisplayString(item.date),
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode("view", null, [
                vue.createTextVNode("订单数："),
                vue.createElementVNode(
                  "text",
                  { class: "number" },
                  vue.toDisplayString(item.orders),
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode("view", null, [
                vue.createTextVNode("销售额："),
                vue.createElementVNode(
                  "text",
                  { class: "value" },
                  vue.toDisplayString(item.sales | _ctx.formatCurrency),
                  1
                  /* TEXT */
                )
              ])
            ]);
          }),
          128
          /* KEYED_FRAGMENT */
        ))
      ])
    ]);
  }
  const PagesNumNum = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["render", _sfc_render$9], ["__file", "C:/Users/86181/Documents/WeChat Files/wxid_615clanckg0q22/FileStorage/File/2024-08/sprint1/sprint1（初步）/baitan1/pages/num/num.vue"]]);
  const _sfc_main$9 = {};
  function _sfc_render$8(_ctx, _cache) {
    return null;
  }
  const PagesPerPer = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["render", _sfc_render$8], ["__file", "C:/Users/86181/Documents/WeChat Files/wxid_615clanckg0q22/FileStorage/File/2024-08/sprint1/sprint1（初步）/baitan1/pages/per/per.vue"]]);
  const _imports_0 = "/static/logo.png";
  const _sfc_main$8 = {
    data() {
      return {
        title: "Hello"
      };
    },
    onLoad() {
    },
    methods: {}
  };
  function _sfc_render$7(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "content" }, [
      vue.createElementVNode("image", {
        class: "logo",
        src: _imports_0
      }),
      vue.createElementVNode("view", { class: "text-area" }, [
        vue.createElementVNode(
          "text",
          { class: "title" },
          vue.toDisplayString($data.title),
          1
          /* TEXT */
        )
      ])
    ]);
  }
  const PagesIndexIndex = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["render", _sfc_render$7], ["__file", "C:/Users/86181/Documents/WeChat Files/wxid_615clanckg0q22/FileStorage/File/2024-08/sprint1/sprint1（初步）/baitan1/pages/index/index.vue"]]);
  function formatAppLog(type, filename, ...args) {
    if (uni.__log__) {
      uni.__log__(type, filename, ...args);
    } else {
      console[type].apply(console, [...args, filename]);
    }
  }
  const _sfc_main$7 = {
    data() {
      return {
        items: [],
        selectedImage: ""
      };
    },
    methods: {
      openGallery() {
        uni.chooseImage({
          count: 1,
          // 允许选择的图片数量
          sizeType: ["original", "compressed"],
          // 可以指定是原图还是压缩图
          sourceType: ["album"],
          // 选择图片的来源为相册
          success: (res) => {
            this.selectedImage = res.tempFilePaths[0];
          },
          fail: (err) => {
            formatAppLog("error", "at pages/xinzeng/xinzeng.vue:53", "打开相册失败", err);
          }
        });
      },
      addItem() {
        uni.showModal({
          title: "新增商品",
          content: "请输入商品名、数量和单位（用空格分隔）",
          editable: true,
          placeholderText: "商品名 数量 单位",
          success: (res) => {
            if (res.confirm) {
              const newValues = res.content.split(" ");
              if (newValues.length >= 2) {
                const [name, number, ...rest] = newValues;
                if (!isNaN(number) && number.trim() !== "") {
                  const newItem = {
                    name: name.trim(),
                    number: parseFloat(number.trim()),
                    unit: rest.join(" ").trim() || ""
                  };
                  this.items.push(newItem);
                } else {
                  uni.showToast({
                    title: "数量应为有效的数字",
                    icon: "none"
                  });
                }
              } else {
                uni.showToast({
                  title: '输入格式错误，请输入"商品名 数量 单位"',
                  icon: "none"
                });
              }
            }
          }
        });
      },
      editItem(index) {
        const item = this.items[index];
        uni.showModal({
          title: "编辑商品",
          content: `当前商品名：${item.name}
当前数量：${item.number} ${item.unit}`,
          editable: true,
          placeholderText: '请输入新的商品名和数量，使用空格隔开，如"商品名 10 kg"',
          success: (res) => {
            if (res.confirm) {
              const newValues = res.content.split(" ");
              if (newValues.length >= 2) {
                const [name, number, ...rest] = newValues;
                if (!isNaN(number) && number.trim() !== "") {
                  this.items[index] = {
                    name: name.trim(),
                    number: parseFloat(number.trim()),
                    unit: rest.join(" ").trim() || ""
                  };
                } else {
                  uni.showToast({
                    title: "数量应为有效的数字",
                    icon: "none"
                  });
                }
              } else {
                uni.showToast({
                  title: '输入格式错误，请输入"商品名 数量 单位"',
                  icon: "none"
                });
              }
            }
          }
        });
      },
      deleteItem(index) {
        this.items.splice(index, 1);
        this.saveData();
        uni.showToast({
          title: `删除商品${index + 1}`,
          icon: "none"
        });
      },
      saveData() {
        saveData("inventory", this.items);
      },
      saveAndNavigateBack() {
        this.saveData();
        const eventChannel = this.getOpenerEventChannel();
        eventChannel.emit("updateChart", this.items);
        uni.navigateBack();
      }
    },
    onLoad() {
      this.items = loadData("inventory");
    }
  };
  function _sfc_render$6(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createElementVNode("view", { class: "header" }, [
        vue.createElementVNode("text", { class: "title" }, "库存盘点"),
        vue.createElementVNode("button", {
          class: "add-button",
          onClick: _cache[0] || (_cache[0] = (...args) => $options.addItem && $options.addItem(...args))
        }, "增加商品")
      ]),
      vue.createElementVNode("view", { class: "table" }, [
        vue.createElementVNode("view", { class: "table-row" }, [
          vue.createElementVNode("view", { class: "table-header" }, "商品名"),
          vue.createElementVNode("view", { class: "table-header" }, "数量"),
          vue.createElementVNode("view", { class: "table-header" }, "操作"),
          vue.createElementVNode("view", { class: "table-header1" }, "图片")
        ]),
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($data.items, (item, index) => {
            return vue.openBlock(), vue.createElementBlock("view", {
              class: "table-row",
              key: index
            }, [
              vue.createElementVNode(
                "view",
                { class: "table-cell" },
                vue.toDisplayString(item.name),
                1
                /* TEXT */
              ),
              vue.createElementVNode(
                "view",
                { class: "table-cell" },
                vue.toDisplayString(item.number) + " " + vue.toDisplayString(item.unit),
                1
                /* TEXT */
              ),
              vue.createElementVNode("view", { class: "table-cell" }, [
                vue.createElementVNode("button", {
                  class: "action-button",
                  onClick: ($event) => $options.editItem(index)
                }, "编辑", 8, ["onClick"]),
                vue.createElementVNode("button", {
                  class: "action-button",
                  onClick: ($event) => $options.deleteItem(index)
                }, "删除", 8, ["onClick"])
              ]),
              vue.createElementVNode("view", { class: "table-cell1" }, [
                !$data.selectedImage ? (vue.openBlock(), vue.createElementBlock("button", {
                  key: 0,
                  onClick: _cache[1] || (_cache[1] = (...args) => $options.openGallery && $options.openGallery(...args))
                }, "打开相册")) : vue.createCommentVNode("v-if", true),
                $data.selectedImage ? (vue.openBlock(), vue.createElementBlock("image", {
                  key: 1,
                  src: $data.selectedImage,
                  class: "preview",
                  mode: "aspectFit"
                }, null, 8, ["src"])) : vue.createCommentVNode("v-if", true)
              ])
            ]);
          }),
          128
          /* KEYED_FRAGMENT */
        ))
      ]),
      vue.createElementVNode("button", {
        class: "save-button",
        onClick: _cache[2] || (_cache[2] = (...args) => $options.saveAndNavigateBack && $options.saveAndNavigateBack(...args))
      }, "保存")
    ]);
  }
  const PagesXinzengXinzeng = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["render", _sfc_render$6], ["__file", "C:/Users/86181/Documents/WeChat Files/wxid_615clanckg0q22/FileStorage/File/2024-08/sprint1/sprint1（初步）/baitan1/pages/xinzeng/xinzeng.vue"]]);
  const _sfc_main$6 = {
    data() {
      return {
        items: [],
        showModal: false,
        modalData: {
          name: "",
          price: 0,
          number: 0,
          unit: ""
        },
        editIndex: null
      };
    },
    methods: {
      openGallery(index) {
        uni.chooseImage({
          count: 1,
          sizeType: ["original", "compressed"],
          sourceType: ["album"],
          success: (res) => {
            this.$set(this.items[index], "selectedImage", res.tempFilePaths[0]);
          },
          fail: (err) => {
            formatAppLog("error", "at pages/shoppingcart/shoppingcart.vue:80", "打开相册失败", err);
          }
        });
      },
      openAddModal() {
        this.editIndex = null;
        this.modalData = {
          name: "",
          price: 0,
          number: 0,
          unit: ""
        };
        this.showModal = true;
      },
      openEditModal(index) {
        this.editIndex = index;
        const item = this.items[index];
        this.modalData = {
          ...item
        };
        this.showModal = true;
      },
      saveModalData() {
        var _a;
        const { name, price, number, unit } = this.modalData;
        if (!name || isNaN(price) || isNaN(number)) {
          uni.showToast({
            title: "请输入有效的商品信息",
            icon: "none"
          });
          return;
        }
        const totalPrice = parseFloat(price) * parseFloat(number);
        const newItem = {
          name: name.trim(),
          price: parseFloat(price),
          number: parseFloat(number),
          unit: unit.trim(),
          totalPrice: totalPrice.toFixed(2),
          selectedImage: ((_a = this.items[this.editIndex]) == null ? void 0 : _a.selectedImage) || ""
        };
        if (this.editIndex !== null) {
          this.$set(this.items, this.editIndex, newItem);
        } else {
          this.items.push(newItem);
        }
        this.saveData();
        this.closeModal();
      },
      closeModal() {
        this.showModal = false;
      },
      deleteItem(index) {
        this.items.splice(index, 1);
        this.saveData();
        uni.showToast({
          title: "删除商品${index + 1}",
          icon: "none"
        });
      },
      saveData() {
        saveData("sell", this.items);
        let inventory = loadData("inventory");
        formatAppLog("log", "at pages/shoppingcart/shoppingcart.vue:145", "Loaded inventory:", inventory);
        if (!Array.isArray(inventory)) {
          inventory = [];
        }
        this.items.forEach((sellItem) => {
          const inventoryItem = inventory.find((item) => item.name === sellItem.name);
          if (inventoryItem) {
            inventoryItem.number += sellItem.number;
          } else {
            inventory.push({ ...sellItem });
          }
        });
        saveData("inventory", inventory);
      },
      saveAndNavigateBack() {
        this.saveData();
        const eventChannel = this.getOpenerEventChannel();
        eventChannel.emit("updateChart", this.items);
        uni.navigateBack();
      }
    },
    onLoad() {
      this.items = loadData("sell");
    }
  };
  function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_modal = vue.resolveComponent("modal");
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createElementVNode("view", { class: "header" }, [
        vue.createElementVNode("text", { class: "title" }),
        vue.createElementVNode("button", {
          class: "add-button",
          onClick: _cache[0] || (_cache[0] = (...args) => $options.openAddModal && $options.openAddModal(...args))
        }, "添加订单")
      ]),
      vue.createElementVNode("view", { class: "table" }, [
        vue.createElementVNode("view", { class: "table-row" }, [
          vue.createElementVNode("view", { class: "table-header" }, "商品名"),
          vue.createElementVNode("view", { class: "table-header" }, "售价"),
          vue.createElementVNode("view", { class: "table-header" }, "售量"),
          vue.createElementVNode("view", { class: "table-header" }, "销售额"),
          vue.createElementVNode("view", { class: "table-header" }, "操作"),
          vue.createElementVNode("view", { class: "table-header1" }, "图片")
        ]),
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($data.items, (item, index) => {
            return vue.openBlock(), vue.createElementBlock("view", {
              class: "table-row",
              key: index
            }, [
              vue.createElementVNode(
                "view",
                { class: "table-cell" },
                vue.toDisplayString(item.name),
                1
                /* TEXT */
              ),
              vue.createElementVNode(
                "view",
                { class: "table-cell" },
                vue.toDisplayString(item.price),
                1
                /* TEXT */
              ),
              vue.createElementVNode(
                "view",
                { class: "table-cell" },
                vue.toDisplayString(item.number) + " " + vue.toDisplayString(item.unit),
                1
                /* TEXT */
              ),
              vue.createElementVNode(
                "view",
                { class: "table-cell" },
                vue.toDisplayString(item.totalPrice),
                1
                /* TEXT */
              ),
              vue.createElementVNode("view", { class: "table-cell" }, [
                vue.createElementVNode("button", {
                  class: "action-button",
                  onClick: ($event) => $options.openEditModal(index)
                }, "编辑", 8, ["onClick"]),
                vue.createElementVNode("button", {
                  class: "action-button",
                  onClick: ($event) => $options.deleteItem(index)
                }, "删除", 8, ["onClick"])
              ]),
              vue.createElementVNode("view", { class: "table-cell1" }, [
                !item.selectedImage ? (vue.openBlock(), vue.createElementBlock("button", {
                  key: 0,
                  onClick: ($event) => $options.openGallery(index)
                }, "打开相册", 8, ["onClick"])) : vue.createCommentVNode("v-if", true),
                item.selectedImage ? (vue.openBlock(), vue.createElementBlock("image", {
                  key: 1,
                  src: item.selectedImage,
                  class: "preview",
                  mode: "aspectFit"
                }, null, 8, ["src"])) : vue.createCommentVNode("v-if", true)
              ])
            ]);
          }),
          128
          /* KEYED_FRAGMENT */
        ))
      ]),
      vue.createElementVNode("button", {
        class: "save-button",
        onClick: _cache[1] || (_cache[1] = (...args) => $options.saveAndNavigateBack && $options.saveAndNavigateBack(...args))
      }, "保存"),
      vue.createCommentVNode(" Add / Edit Modal "),
      $data.showModal ? (vue.openBlock(), vue.createBlock(_component_modal, {
        key: 0,
        onClose: $options.closeModal
      }, {
        default: vue.withCtx(() => [
          vue.createElementVNode("view", { class: "modal-content" }, [
            vue.createElementVNode("text", null, "商品名："),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                type: "text",
                "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $data.modalData.name = $event),
                placeholder: "请输入商品名"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.modalData.name]
            ]),
            vue.createElementVNode("text", null, "价格："),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                type: "number",
                "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $data.modalData.price = $event),
                placeholder: "请输入价格"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.modalData.price]
            ]),
            vue.createElementVNode("text", null, "数量："),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                type: "number",
                "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => $data.modalData.number = $event),
                placeholder: "请输入数量"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.modalData.number]
            ]),
            vue.createElementVNode("text", null, "单位："),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                type: "text",
                "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => $data.modalData.unit = $event),
                placeholder: "请输入单位"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.modalData.unit]
            ]),
            vue.createElementVNode("button", {
              onClick: _cache[6] || (_cache[6] = (...args) => $options.saveModalData && $options.saveModalData(...args))
            }, "保存"),
            vue.createElementVNode("button", {
              onClick: _cache[7] || (_cache[7] = (...args) => $options.closeModal && $options.closeModal(...args))
            }, "取消")
          ])
        ]),
        _: 1
        /* STABLE */
      }, 8, ["onClose"])) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const PagesShoppingcartShoppingcart = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$5], ["__file", "C:/Users/86181/Documents/WeChat Files/wxid_615clanckg0q22/FileStorage/File/2024-08/sprint1/sprint1（初步）/baitan1/pages/shoppingcart/shoppingcart.vue"]]);
  const _sfc_main$5 = {
    data() {
      return {};
    },
    methods: {
      close() {
        uni.switchTab({
          url: "/pages/repertory/repertory"
        });
      }
    }
  };
  function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "uni-group" }, [
      vue.createTextVNode(" 库存减少页面 "),
      vue.createElementVNode("button", {
        type: "warn",
        class: "uni-button",
        size: "mini",
        onClick: _cache[0] || (_cache[0] = (...args) => $options.close && $options.close(...args))
      }, "关闭")
    ]);
  }
  const PagesKucuntiaozhengDecreaseKucuntiaozhengDecrease = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$4], ["__file", "C:/Users/86181/Documents/WeChat Files/wxid_615clanckg0q22/FileStorage/File/2024-08/sprint1/sprint1（初步）/baitan1/pages/kucuntiaozheng_decrease/kucuntiaozheng_decrease.vue"]]);
  const _sfc_main$4 = {
    data() {
      return {};
    },
    methods: {
      close() {
        uni.switchTab({
          url: "/pages/repertory/repertory"
        });
      }
    }
  };
  function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", null, [
      vue.createTextVNode(" 增加库存页面 "),
      vue.createElementVNode("button", {
        type: "warn",
        class: "uni-button",
        size: "mini",
        onClick: _cache[0] || (_cache[0] = (...args) => $options.close && $options.close(...args))
      }, "关闭")
    ]);
  }
  const PagesKucuntiaozhengIncreaseKucuntiaozhengIncrease = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$3], ["__file", "C:/Users/86181/Documents/WeChat Files/wxid_615clanckg0q22/FileStorage/File/2024-08/sprint1/sprint1（初步）/baitan1/pages/kucuntiaozheng_increase/kucuntiaozheng_increase.vue"]]);
  const _sfc_main$3 = {
    data() {
      return {
        selectedImage: ""
        // 存储选择的图片路径
      };
    },
    methods: {
      openGallery() {
        uni.chooseImage({
          count: 1,
          // 允许选择的图片数量
          sizeType: ["original", "compressed"],
          // 可以指定是原图还是压缩图
          sourceType: ["album"],
          // 选择图片的来源为相册
          success: (res) => {
            this.selectedImage = res.tempFilePaths[0];
          },
          fail: (err) => {
            formatAppLog("error", "at pages/gallery/gallery.vue:25", "打开相册失败", err);
          }
        });
      }
    }
  };
  function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createElementVNode("button", {
        onClick: _cache[0] || (_cache[0] = (...args) => $options.openGallery && $options.openGallery(...args))
      }, "打开相册"),
      $data.selectedImage ? (vue.openBlock(), vue.createElementBlock("image", {
        key: 0,
        src: $data.selectedImage,
        class: "preview"
      }, null, 8, ["src"])) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const PagesGalleryGallery = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$2], ["__scopeId", "data-v-ff88f784"], ["__file", "C:/Users/86181/Documents/WeChat Files/wxid_615clanckg0q22/FileStorage/File/2024-08/sprint1/sprint1（初步）/baitan1/pages/gallery/gallery.vue"]]);
  const _sfc_main$2 = {
    data() {
      return {
        stockQuantity: 0,
        // 初始库存数量
        images: []
        // 用于存储添加的图片路径
      };
    },
    methods: {
      incrementStock() {
        this.stockQuantity++;
      },
      decrementStock() {
        if (this.stockQuantity > 0) {
          this.stockQuantity--;
        }
      },
      addImage() {
        const that = this;
        uni.chooseImage({
          count: 1,
          // 一次选择一张图片
          success: function(res) {
            const tempFilePaths = res.tempFilePaths;
            that.images.push({ url: tempFilePaths[0], uploaded: false });
            that.uploadImage(tempFilePaths[0]);
            this.updateImageStatus();
          }
        });
      },
      uploadImage(imagePath) {
        uni.uploadFile({
          url: "https://example.com/upload",
          // 你的上传接口地址
          filePath: imagePath,
          name: "file",
          success: (uploadFileRes) => {
            formatAppLog("log", "at pages/function/function.vue:60", "上传成功", uploadFileRes);
            this.updateImageStatus(imagePath, true);
          },
          fail: (error) => {
            formatAppLog("error", "at pages/function/function.vue:65", "上传失败", error);
            this.updateImageStatus(imagePath, false);
          }
        });
      },
      updateImageStatus(imagePath, uploaded) {
        const image = this.images.find((img) => img.url === imagePath);
        if (image) {
          image.uploaded = uploaded;
        }
      }
    }
  };
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createCommentVNode(" 库存增减部分 "),
      vue.createElementVNode("view", { class: "stock-control" }, [
        vue.createElementVNode("text", { class: "label" }, "库存数量:"),
        vue.createElementVNode("button", {
          onClick: _cache[0] || (_cache[0] = (...args) => $options.decrementStock && $options.decrementStock(...args)),
          class: "button"
        }, "-"),
        vue.withDirectives(vue.createElementVNode(
          "input",
          {
            type: "number",
            "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $data.stockQuantity = $event),
            class: "input"
          },
          null,
          512
          /* NEED_PATCH */
        ), [
          [vue.vModelText, $data.stockQuantity]
        ]),
        vue.createElementVNode("button", {
          onClick: _cache[2] || (_cache[2] = (...args) => $options.incrementStock && $options.incrementStock(...args)),
          class: "button"
        }, "+")
      ]),
      vue.createCommentVNode(" 图片上传部分 "),
      vue.createElementVNode("view", { class: "image-section" }, [
        vue.createElementVNode("button", {
          onClick: _cache[3] || (_cache[3] = (...args) => $options.addImage && $options.addImage(...args)),
          class: "add-image-button"
        }, "添加图片"),
        vue.createElementVNode("view", { class: "image-list" }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.images, (image, index) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                key: index,
                class: "image-container"
              }, [
                vue.createElementVNode("image", {
                  src: image.url,
                  class: "added-image"
                }, null, 8, ["src"]),
                vue.createElementVNode(
                  "text",
                  { class: "upload-status" },
                  vue.toDisplayString(image.uploaded ? "上传成功" : "上传中..."),
                  1
                  /* TEXT */
                )
              ]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ])
      ])
    ]);
  }
  const PagesFunctionFunction = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$1], ["__scopeId", "data-v-9a9723f6"], ["__file", "C:/Users/86181/Documents/WeChat Files/wxid_615clanckg0q22/FileStorage/File/2024-08/sprint1/sprint1（初步）/baitan1/pages/function/function.vue"]]);
  const _sfc_main$1 = {
    data() {
      return {};
    },
    methods: {}
  };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view");
  }
  const PagesSalesReportSalesReport = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render], ["__file", "C:/Users/86181/Documents/WeChat Files/wxid_615clanckg0q22/FileStorage/File/2024-08/sprint1/sprint1（初步）/baitan1/pages/salesReport/salesReport.vue"]]);
  __definePage("pages/shoping/shoping", PagesShopingShoping);
  __definePage("pages/store/store", PagesStoreStore);
  __definePage("pages/money/money", PagesMoneyMoney);
  __definePage("pages/num/num", PagesNumNum);
  __definePage("pages/per/per", PagesPerPer);
  __definePage("pages/index/index", PagesIndexIndex);
  __definePage("pages/xinzeng/xinzeng", PagesXinzengXinzeng);
  __definePage("pages/shoppingcart/shoppingcart", PagesShoppingcartShoppingcart);
  __definePage("pages/kucuntiaozheng_decrease/kucuntiaozheng_decrease", PagesKucuntiaozhengDecreaseKucuntiaozhengDecrease);
  __definePage("pages/kucuntiaozheng_increase/kucuntiaozheng_increase", PagesKucuntiaozhengIncreaseKucuntiaozhengIncrease);
  __definePage("pages/gallery/gallery", PagesGalleryGallery);
  __definePage("pages/function/function", PagesFunctionFunction);
  __definePage("pages/salesReport/salesReport", PagesSalesReportSalesReport);
  const _sfc_main = {
    onLaunch: function() {
      formatAppLog("log", "at App.vue:4", "App Launch");
    },
    onShow: function() {
      formatAppLog("log", "at App.vue:7", "App Show");
    },
    onHide: function() {
      formatAppLog("log", "at App.vue:10", "App Hide");
    },
    data() {
      return {
        id: 10
      };
    }
  };
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__file", "C:/Users/86181/Documents/WeChat Files/wxid_615clanckg0q22/FileStorage/File/2024-08/sprint1/sprint1（初步）/baitan1/App.vue"]]);
  function createApp() {
    const app = vue.createVueApp(App);
    return {
      app
    };
  }
  const { app: __app__, Vuex: __Vuex__, Pinia: __Pinia__ } = createApp();
  uni.Vuex = __Vuex__;
  uni.Pinia = __Pinia__;
  __app__.provide("__globalStyles", __uniConfig.styles);
  __app__._component.mpType = "app";
  __app__._component.render = () => {
  };
  __app__.mount("#app");
})(Vue);
