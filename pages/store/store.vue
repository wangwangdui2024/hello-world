<template>
  <view class="container">
    <view class="header">
      <text class="title">进货管理</text>
      <button class="add-btn" @click="showAddDialog">添加新项</button>
    </view>
    <view class="content">
      <view v-for="(item, index) in items" :key="index" class="item">
        <text class="item-name">{{ item.name }}</text>
        <text class="item-price">￥{{ item.price }}</text>
        <text class="item-quantity">数量: {{ item.quantity }}</text>
      </view>
    </view>
    <u-dialog v-model="showDialog" title="添加新项" :show-cancel="true" @confirm="addItem">
      <view class="dialog-content">
        <input v-model="newItem.name" placeholder="产品名称" />
        <input v-model.number="newItem.price" type="number" placeholder="价格" />
        <input v-model.number="newItem.quantity" type="number" placeholder="数量" />
      </view>
    </u-dialog>
  </view>
</template>

<script>
export default {
  data() {
    return {
      items: [], // 存储进货项的数组
      showDialog: false, // 控制对话框的显示
      newItem: {
        name: '',
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
        this.newItem = { name: '', price: 0, quantity: 0 }; // 重置输入框
        this.showDialog = false; // 关闭对话框
        this.saveItems(); // 保存进货项到本地
      } else {
        uni.showToast({ title: '请填写完整信息', icon: 'none' });
      }
    },
    saveItems() {
      uni.setStorageSync('items', this.items);
    },
    loadItems() {
      const storedItems = uni.getStorageSync('items');
      if (storedItems) {
        this.items = storedItems;
      }
    }
  },
  onShow() {
    this.loadItems(); // 进入页面时加载进货项
  }
};
</script>

<style scoped>
.container {
  padding: 20px;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.title {
  font-size: 24px;
  font-weight: bold;
}
.add-btn {
  background-color: #007aff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
}
.content {
  display: flex;
  flex-direction: column;
}
.item {
  margin-bottom: 15px;
}
.item-name {
  font-size: 18px;
  font-weight: bold;
}
.item-price {
  color: #ff3b30;
}
.item-quantity {
  color: #8e8e93;
}
.dialog-content {
  padding: 10px;
}
.dialog-content input {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
</style>

