<template>
	  <view class="container">
		<view class="header">
		  <text class="title"></text>
		  <button class="add-button" @click="openAddModal">添加订单</button>
		</view>

		<view class="table">
		  <view class="table-row">
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
			  <button v-if="!item.selectedImage" @click="openGallery(index)">打开相册</button>
			  <image v-if="item.selectedImage" :src="item.selectedImage" class="preview" mode="aspectFit"></image>
			</view>
		  </view>
		</view>

		<button class="save-button" @click="saveAndNavigateBack">保存</button>

		<!-- Add / Edit Modal -->
		<modal v-if="showModal" @close="closeModal">
		  <view class="modal-content">
			<text>商品名：</text>
			<input type="text" v-model="modalData.name" placeholder="请输入商品名" />
			<text>价格：</text>
			<input type="number" v-model="modalData.price" placeholder="请输入价格" />
			<text>数量：</text>
			<input type="number" v-model="modalData.number" placeholder="请输入数量" />
			<text>单位：</text>
			<input type="text" v-model="modalData.unit" placeholder="请输入单位" />
			<button @click="saveModalData">保存</button>
			<button @click="closeModal">取消</button>
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
			title: '删除商品${index + 1}',
			icon: 'none'
		  });
		},
		saveData() {
		  // 保存当前订单数据
		  saveData('sell', this.items);
		
		  // 加载现有的库存数据
		  let inventory = loadData('inventory');
		  console.log('Loaded inventory:', inventory);
		
		  // 确保 inventory 是一个数组
		  if (!Array.isArray(inventory)) {
		    inventory = [];
		  }
		  // 遍历sell数组，将数量合并到inventory数组中
		  this.items.forEach(sellItem => {
		    const inventoryItem = inventory.find(item => item.name === sellItem.name);
		    if (inventoryItem) {
		      // 如果inventory中已有该商品，数量相加
		      inventoryItem.number += sellItem.number;
		    } else {
		      // 如果inventory中没有该商品，添加新商品
		      inventory.push({ ...sellItem });
		    }
		  });
		  // 保存更新后的库存数据
		  saveData('inventory', inventory);
		this.items = [];
		 saveData('sell', this.items);
		 uni.showToast({
		     title: '库存已更新，购买记录已清空',
		     icon: 'success',
					    });
		  
		 
		},
		saveAndNavigateBack() {
		  
		  this.saveData();
		  const eventChannel = this.getOpenerEventChannel();
		  eventChannel.emit('updateChart', this.items);
		  
		
		
		}
	  },
	  onLoad() {
		this.items = loadData('sell');
	  }
	}
	</script>

	<style>
	.container {
	  padding: 20rpx;
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
	  border-radius: 10rpx;
	}

	.add-button, .save-button {
	  width: 200rpx;
	  height: 60rpx;
	  background: #FF9800;
	  color: white;
	  text-align: center;
	  line-height: 60rpx;
	  border-radius: 10rpx;
	}

	.table {
	  margin-top: 20rpx;
	  background: white;
	  border-radius: 10rpx;
	}

	.table-row {
	  display: flex;
	  justify-content: space-between;
	  padding: 10rpx;
	  border-bottom: 1rpx solid #ccc;
	}

	.table-header {
	  font-weight: bold;
	  width: 20%;
	}

	.table-header1 {
	  font-weight: bold;
	  width: 40%;
	}

	.table-cell {
	  width: 20%;
	  display: flex;
	  align-items: center;
	  justify-content: center;
	}

	.table-cell1 {
	  width: 40%;
	  display: flex;
	  align-items: center;
	  justify-content: center;
	}

	.action-button {
	  margin-right: 5rpx;
	  background: #f0ad4e;
	  color: white;
	  border-radius: 5rpx;
	  padding: 5rpx 10rpx;
	  font-size: 24rpx;
	}

	.preview {
	  width: 100rpx;
	  height: 100rpx;
	  border-radius: 10rpx;
	}

	.modal-content {
	  padding: 20rpx;
	  background: white;
	  border-radius: 10rpx;
	  box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.1);
	}

	.modal-content text {
	  display: block;
	  margin-bottom: 10rpx;
	  font-weight: bold;
	}

	.modal-content input {
	  width: 100%;
	  height: 60rpx;
	  margin-bottom: 20rpx;
	  padding: 0 10rpx;
	  border: 1rpx solid #ddd;
	  border-radius: 5rpx;
	}
	</style>