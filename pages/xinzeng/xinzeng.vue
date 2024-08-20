<template>
  <view class="container">
    <view class="header">
      <text class="title">库存盘点</text>
      <button class="add-button" @click="addItem">增加商品</button>
    </view>

    <view class="table">
      <view class="table-row">
        <view class="table-header">商品名</view>
        <view class="table-header">数量</view>
        <view class="table-header">操作</view>
		<view class="table-header1">图片</view>
      </view>
      <view class="table-row" v-for="(item, index) in items" :key="index">
        <view class="table-cell">{{ item.name }}</view>
        <view class="table-cell">{{ item.number }} {{ item.unit }}</view>
        <view class="table-cell">
          <button class="action-button" @click="editItem(index)">编辑</button>
          <button class="action-button" @click="deleteItem(index)">删除</button>
        </view>
		<view class="table-cell1">
			    <button v-if="!(selectedImage)" @click="openGallery">打开相册</button>
			    <image v-if="selectedImage" :src="selectedImage" class="preview" mode="aspectFit"></image>	  
		</view>
      </view>
    </view>
    
    <button class="save-button" @click="saveAndNavigateBack">保存</button>
  </view>
</template>

<script>
import { saveData, loadData } from '@/services/storageService.js';

export default {
  data() {
    return {
      items: [],
	  selectedImage: '' 
    };
  },
  methods: {
	  openGallery() {
	    uni.chooseImage({
	      count: 1,  // 允许选择的图片数量
	      sizeType: ['original', 'compressed'],  // 可以指定是原图还是压缩图
	      sourceType: ['album'],  // 选择图片的来源为相册
	      success: (res) => {
	        this.selectedImage = res.tempFilePaths[0];  // 获取选择的图片路径
	      },
	      fail: (err) => {
	        console.error('打开相册失败', err);
	      }
	    });
	  },
    addItem() {
      uni.showModal({
        title: '新增商品',
        content: '请输入商品名、数量和单位（用空格分隔）',
        editable: true,
        placeholderText: '商品名 数量 单位',
        success: (res) => {
          if (res.confirm) {
            const newValues = res.content.split(' ');
            if (newValues.length >= 2) {
              const [name, number, ...rest] = newValues;
              if (!isNaN(number) && number.trim() !== '') {
                const newItem = {
                  name: name.trim(),
                  number: parseFloat(number.trim()),
                  unit: rest.join(' ').trim() || ''
                };
                this.items.push(newItem);
              } else {
                uni.showToast({
                  title: '数量应为有效的数字',
                  icon: 'none'
                });
              }
            } else {
              uni.showToast({
                title: '输入格式错误，请输入"商品名 数量 单位"',
                icon: 'none'
              });
            }
          }
        }
      });
    },
    editItem(index) {
      const item = this.items[index];
      uni.showModal({
        title: '编辑商品',
        content: `当前商品名：${item.name}\n当前数量：${item.number} ${item.unit}`,
        editable: true,
        placeholderText: '请输入新的商品名和数量，使用空格隔开，如"商品名 10 kg"',
        success: (res) => {
          if (res.confirm) {
            const newValues = res.content.split(' ');
            if (newValues.length >= 2) {
              const [name, number, ...rest] = newValues;
              if (!isNaN(number) && number.trim() !== '') {
                this.items[index] = {
                  name: name.trim(),
                  number: parseFloat(number.trim()),
                  unit: rest.join(' ').trim() || ''
                };
              } else {
                uni.showToast({
                  title: '数量应为有效的数字',
                  icon: 'none'
                });
              }
            } else {
              uni.showToast({
                title: '输入格式错误，请输入"商品名 数量 单位"',
                icon: 'none'
              });
            }
          }
        }
      });
    },
    deleteItem(index) {
      this.items.splice(index, 1);
	  this.saveData(); // 确保每次操作后保存数据
      uni.showToast({
        title: `删除商品${index + 1}`,
        icon: 'none'
      });
    },
    saveData() {
      saveData('inventory', this.items);
    },
    saveAndNavigateBack() {
      this.saveData();
      const eventChannel = this.getOpenerEventChannel();
      eventChannel.emit('updateChart', this.items);
      uni.navigateBack();
    }
  },
  onLoad() {
    this.items = loadData('inventory');
  }
}
</script>
<style>
.container {
  padding: 20rpx;
}

.header {
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 750rpx;
  margin-bottom: 20rpx;
}

.add-button {
  width: 200rpx;
  height: 60rpx;
  background: #4CAF50;
  color: white;
  text-align: center;
  line-height: 60rpx;
  border-radius: 10rpx;
}

.table {
  width: 750rpx;
  margin-top: 20rpx;
  background: #f9f9f9;
}

.table-row {
  display: flex;
  justify-content: space-between;
  padding: 10rpx 20rpx;
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
}

.table-cell1 {
  width: 40%;
}

.action-button {
  margin-right: 10rpx;
  background: #f0ad4e;
  color: white;
  border-radius: 5rpx;
  padding: 5rpx 10rpx;
  font-size: 24rpx;
}

.preview{
	width: 100%;
}
</style>
