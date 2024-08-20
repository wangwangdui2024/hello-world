<template>
 <view class="container">
   <view class="header">
     <text class="title">销售记录</text>
     <button class="add-button" @click="addItem">录入订单</button>
   </view>
 
   <view class="table">
     <view class="table-row1">
       <view class="table-header">商品名</view>
       <view class="table-header">单价</view>
	   <view class="table-header">销售量</view>
       <view class="table-header">操作</view>
     </view>
     <view class="table-row" v-for="(item, index) in items1" :key="index">
       <view class="table-cell">{{ item.name }}</view>
	   <view class="table-cell">{{ item.price }}</view>
       <view class="table-cell">{{ item.number }} {{ item.unit }}</view>
       <view class="table-cell">
         <button class="action-button" @click="editItem(index)" >编辑</button>
         <button class="action-button" @click="deleteItem(index)">删除</button>
       </view>
     </view>
   </view>
 </view>
 <view v-for="(item, index) in items1" :key="index" class="disable">
	  <button @click="toadd" size="mini">销售量+1</button>
	  <button @click="todelete" size="mini">销售量-1</button>
 	  <view>商品名：{{item.name}}</view>
	  <view>销售量：{{item.number}}{{item.unit}}</view>
	  <view>销售额：{{item.number*item.price}}</view>
 </view>
 <button class="save-button" @click="saveAndNavigateBack">保存</button>
</template>

<script>
import { saveData, loadData } from '@/services/storageService.js';
export default {
  data() {
    return {
      items1: [] // 定义 items1 属性
    };
  },
  methods: {
	  toadd(){
		 this.items1=this.items1.map(item=>({
		 			  ...item,number:item.number+1,
		 		  }));
		 		  this.saveData();
	  },
	  todelete(){
        this.items1=this.items1.map(item=>({
        			  ...item,number:item.number-1,
        		  }));
        this.saveData();
	  },
    addItem() {
      uni.showModal({
        title: '新增商品',
        content: '请输入商品名,价格和销售量（用空格分隔）',
        editable: true,
        placeholderText: '商品名 销售价格 销售量 单位',
        success: (res) => {
          if (res.confirm) {
            const newValues = res.content.split(' ');
            if (newValues.length >= 4) {
              const newItem = {
                name: newValues[0].trim(),
				price: parseFloat(newValues[1].trim()) || 0,
                number: parseFloat(newValues[2].trim()) || 0,
				unit:newValues[3].trim(),
              };
              this.items1.push(newItem);
			  this.saveData(); // 保存数据到本地存储
            } else {
              uni.showToast({
                title: '输入格式错误，请输入"商品名 销售价格 数量 单位"',
                icon: 'none'
              });
            }
          }
        }
      });
    },
    editItem(index) {
      const item = this.items1[index];
      uni.showModal({
        title: '编辑商品',
        content: `当前商品名：${item.name}\n售价：${item.price}当前数量：${item.number} ${item.unit}`,
        editable: true,
        placeholderText: '请输入新的商品名和数量，使用空格隔开，如"商品名 50 10 kg"',
        success: (res) => {
          if (res.confirm) {
            const newValues = res.content.split(' ');
            if (newValues.length >= 4) {
              this.items1[index].name = newValues[0].trim();
			  this.items1[index].price = parseFloat(newValues[1].trim()) || 0;
              this.items1[index].number = parseFloat(newValues[2].trim()) || 0;
			  this.items1[index].unit = newValues[3].trim();
              this.saveData();
            } else {
              uni.showToast({
                title: '输入格式错误，请输入"商品名 售价 销售量 单位"',
                icon: 'none'
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
        icon: 'none'
      });
    },
    saveData() {
          uni.setStorageSync('inventory1', this.items1);
        },
	saveAndNavigateBack() {
	     this.saveData();
	     const eventChannel = this.getOpenerEventChannel();
	     if (eventChannel) {
	             eventChannel.emit('updateChart', this.items1); // 更新数据
	           }
	   }
      },
      onLoad() {
        // 页面加载时从本地存储加载数据
        const storedItems1 = uni.getStorageSync('inventory1');
          this.items1 = storedItems1;
      },
  onUnload() {
    this.saveData(); // 页面卸载时保存数据
  }
}
</script>
               <style>
               .container {
                 padding: 20rpx;
               }
               
               .box {
                 width: 700rpx;
                 height: 120rpx;
                 background: #5555ff;
                 display: flex;
                 align-items: center;
                 justify-content: space-between;
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
                 width: 700rpx;
                 margin-top: 20rpx;
                 background: #f9f9f9;
				 border: #ccc 5rpx solid;
				 box-shadow: #b6b6b6 3rpx 3rpx;
				 border-radius: 8rpx;
               }
               
               .table-row {
                 display: flex;
                 justify-content: space-between;
                 border-bottom: 1rpx solid #ccc;
               }
			   
			   .table-row1 {
			     display: flex;
			     justify-content: space-between;
				 background-color: #ccc065;
			     border-bottom: 1rpx solid #ccc065;
			   }
               
               .table-header {
                 font-weight: bold;
                 width: 33%;
				 height: 100%;
				 
               }
               
               .table-cell {
                 width: 33%;
               }
               
               .action-button {
                 margin-right: 10rpx;
                 background: #f0ad4e;
                 color: white;
                 border-radius: 5rpx;
                 padding: 5rpx 10rpx;
                 font-size: 24rpx;
				 box-shadow: #ccc 3rpx 3rpx;
               }
              .disable{
				 
                 border: #b6b6b6 5rpx solid;
				 margin:20rpx;
				 box-shadow: #5555ff 2rpx 2rpx 2rpx 2rpx;
				 border-radius: 8rpx;
				 padding: 20rpx;
				   }
               </style>