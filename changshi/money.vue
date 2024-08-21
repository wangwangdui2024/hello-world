<template>
  <view class="container">
    <button class="add-button" @click="openAddModal" type="primary">添加订单</button>

    <view class="table">
      <view class="table-row1">
        <view class="table-header">商品名</view>
        <view class="table-header">售价</view>
        <view class="table-header">售量</view>
        <view class="table-header">销售额</view>
        <view class="table-header">操作</view>
        <view class="table-header1">图片</view>
      </view>
      <view class="table-row" v-for="(item, index) in items" :key="index">
        <view class="table-cell">{{ item.name }}</view>
        <view class="table-cell">{{ item.price }}</view>
        <view class="table-cell">{{ item.number }} {{ item.unit }}</view>
        <view class="table-cell">{{ item.totalPrice }}</view>
        <view class="table-cell">
          <button class="action-button" @click="openEditModal(index)">编辑</button>
          <button class="action-button" @click="deleteItem(index)">删除</button>
        </view>
        <view class="table-cell1">
          <button v-if="!(item.selectedImage)" @click="openGallery(index)">打开相册</button>
          <image :src="item.selectedImage" class="preview" mode="aspectFit"></image>
        </view>
      </view>
    </view>
    <view class="margin1"></view>
    
    <button class="save-button" @click="saveAndNavigateBack" type="primary">保存</button>
    <view class="margin"></view>
    <button class="save-button" @click="chengben" type="primary">成本统计</button>
    <view class="margin"></view>
    
    <!-- Add / Edit Modal -->
    <modal v-if="showModal" @close="closeModal">
      <view class="modal-content">
        <text>商品名：</text> 
        <view class="beautify">
          <input type="text" v-model="modalData.name" placeholder="请输入商品名" />
        </view>
        <text>售价：</text>
        <view class="beautify">
          <input type="number" v-model="modalData.price" placeholder="请输入价格" />
        </view>
        <text>售量：</text>
        <view class="beautify">
          <input type="number" v-model="modalData.number" placeholder="请输入数量" />
        </view>
        <text>单位：</text>
        <view class="beautify">
          <input type="text" v-model="modalData.unit" placeholder="请输入单位" />
        </view>
        <view class="margin"></view>
        <button @click="saveModalData" type="primary" plain>确定</button>
        <view class="margin"></view>
        <button @click="closeModal" type="primary" plain>取消</button>
      </view>
    </modal>
  </view>
</template>

<script>
import { saveData, loadData } from '@/services/storageService.js';

export default {
  data() {
    return {
      items: [],
      showModal: false,
      modalData: {
        name: '',
        price: 0,
        number: 0,
        unit: ''
      },
      editIndex: null
    };
  },
  methods: {
    openGallery(index) {
      uni.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album'],
        success: (res) => {
          this.$set(this.items[index], 'selectedImage', res.tempFilePaths[0]);
        },
        fail: (err) => {
          console.error('打开相册失败', err);
        }
      });
    },
    openAddModal() {
      this.editIndex = null;
      this.modalData = {
        name: '',
        price: 0,
        number: 0,
        unit: ''
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
      const { name, price, number, unit } = this.modalData;
      if (!name || isNaN(price) || isNaN(number)) {
        uni.showToast({
          title: '请输入有效的商品信息',
          icon: 'none'
        });
        return;
      }
      uni.showToast({
        title: '切记要点保存！！！',
        icon: 'none',
        duration: 2000
      });
      const totalPrice = parseFloat(price) * parseFloat(number);
      const newItem = {
        name: name.trim(),
        price: parseFloat(price),
        number: parseFloat(number),
        unit: unit.trim(),
        totalPrice: totalPrice.toFixed(2),
        selectedImage: this.items[this.editIndex]?.selectedImage || ''
      };
      if (this.editIndex !== null) {
        this.$set(this.items, this.editIndex, newItem);
      } else {
        this.items.push(newItem);
      }

      this.closeModal();
    },
    closeModal() {
      this.showModal = false;
    },
    deleteItem(index) {
      this.items.splice(index, 1);
      this.saveData();
      uni.showToast({
        title: `删除商品${index + 1}`,
        icon: 'none'
      });
    },
    chengben(){
      uni.navigateTo({
        url:'/pages/chengben/chengben'
      });
    },
   saveData() {
     // 获取当前时间
     const currentTime = new Date().toISOString();
   
     // 为每个订单项添加时间戳
     this.items.forEach(orderItem => {
       orderItem.timestamp = currentTime;
     });
   
     // 载入现有的订单数据
     let orders = loadData('orders');
     
     // 确保 orders 是一个数组
     if (!Array.isArray(orders)) {
       orders = [];
     }
   
     // 将新订单追加到现有订单中
     orders = orders.concat(this.items);
   
     // 保存新的订单数据
     saveData('orders', orders);
   
     // 加载现有的库存数据
     let inventory = loadData('inventory');
     console.log('Loaded inventory:', inventory);
   
     // 确保 inventory 是一个数组
     if (!Array.isArray(inventory)) {
       inventory = [];
     }
   
     // 遍历 order 数组，将数量合并到 inventory 数组中
     this.items.forEach(orderItem => {
       const inventoryIndex = inventory.findIndex(item => item.name === orderItem.name);
       if (inventoryIndex !== -1) {
         // 更新库存数量
         inventory[inventoryIndex].number -= orderItem.number;
   
         // 检查库存数量是否为0或更小，如果是则删除该库存项
         if (inventory[inventoryIndex].number <= 0) {
           inventory.splice(inventoryIndex, 1);
         }
       }
     });
   
     // 保存更新后的库存数据
     saveData('inventory', inventory);
     
     // 清空当前订单
     this.items = [];
     saveData('order', this.items);
   
     // 显示提示信息
     uni.showToast({
       title: '库存已更新，订单记录已清空',
       icon: 'success',
     });
   },
   
    saveAndNavigateBack() {
      this.saveData();
      const eventChannel = this.getOpenerEventChannel();
      eventChannel.emit('updateChart', this.items);
      uni.showToast({
        title: '已保存',
        icon: 'success',
        duration: 2000
      });
    },
    formatDate(timestamp) {
      // 将时间戳格式化为可读的日期字符串
      if (!timestamp) return '';
      const date = new Date(timestamp);
      return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
    }
  },
  onLoad() {
    this.items = loadData('order') || [];
  }
}
</script>

<style>
.container {
  background-color: #f5f5f5;
  min-height: 100vh;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx;
  background: #4CAF50;
  color: white;
  box-shadow: #ccc 5rpx 4rpx 3rpx;
  border-radius: 10rpx;
}

.add-button, .save-button {
  width: 200rpx;
  height: 60rpx;
  color: white;
  text-align: center;
  font-size: 24rpx;
  line-height: 60rpx;
  border-radius: 10rpx;
}

.table {
  margin-top: 20rpx;
  background-color: beige;
  border-radius: 10rpx;
  border: #ccc 3rpx solid;
}

.table-row {
  display: flex;
  justify-content: space-between;
  font-size: 12rpx;
  border: 3rpx solid #ccc;
  margin-bottom: 10rpx;
  min-width: 55vh;
  max-width: 120vh;
}

.table-row1 {
  display: flex;
  justify-content: space-between;
  padding: 10rpx;
  border: 3rpx solid #ccc;
  margin-bottom: 10rpx;
  background-color: #4a95e0;
}

.table-header {
  font-weight: bold;
  width: 16%;
  border-right: #c5c5c5 3rpx solid;
}

.table-header1 {
  font-weight: bold;
  width: 20%;
  border-right: #c5c5c5 3rpx solid;
}

.table-cell {
  width: 16%;
  text-align: center;
  line-height: 60rpx;
  border-right: #c5c5c5 3rpx solid;
}

.table-cell1 {
  width: 20%;
  text-align: center;
  line-height: 60rpx;
}

.action-button {
  margin: 0 5rpx;
  padding: 5rpx 10rpx;
  font-size: 12rpx;
  color: white;
  background-color: #4CAF50;
  border: none;
  border-radius: 5rpx;
}

.modal-content {
  padding: 20rpx;
  background-color: white;
  border-radius: 10rpx;
}

.margin {
  margin: 20rpx;
}

.margin1 {
  margin: 30rpx;
}

.beautify{
	border: #c5c5c5 1rpx solid;
	margin-bottom: 10rpx;
	border-radius: 3rpx;
}

.preview {
  width: 60rpx;
  height: 60rpx;
  border-radius: 5rpx;
}
</style>
