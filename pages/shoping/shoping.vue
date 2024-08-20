<template>
<view class="container">
    <input type="text" v-model="searchQuery" placeholder="搜索商品" @input="filterItems" class="search-box" />
  </view>	
  <view class="container">
    <view class="header">
		  <button class="button" @click="navigateToStockCheck" type="primary">库存盘点</button>
		  <button class="button" @click="navigateToStockCheck1" type="primary">商品进货</button>
    </view>

    <!-- 添加滚动容器 -->
        <scroll-view scroll-x="true" class="scroll-view">
          <canvas canvas-id="barChart" class="chart"></canvas>
        </scroll-view>
  </view>
  <!--search-->
  <view class="ziti">搜索结果：</view>
  <view class="container">
  <view class="table">
    <view class="table-row" v-for="(item, index) in filteredItems" :key="index">
      <view class="table-cell">{{ item.name }}</view>
      <view class="table-cell">{{ item.description }}</view>
      <view class="table-cell">{{ item.number }} {{ item.unit }}</view>
    </view>
  </view>
   </view>
</template>

<script>
import { loadData } from '@/services/storageService.js';

export default {
  data() {
    return {
	  items: [], // 初始化 items 数组
	  filteredItems: [], // 过滤后的 items
	  searchQuery: '' ,// 搜索关键词
	  canvasWidth: '750px' // 默认宽度
    };
  },
  mounted() {
    this.loadData(); // 加载数据
    this.filterItems(); // 初始化显示所有商品
  },
  onShow() {
    this.items = loadData('inventory');
    this.drawBarChart();
	this.showTemporaryToast();
	
  },
  methods: {
    navigateToStockCheck() {
      uni.navigateTo({
        url: '/pages/xinzeng/xinzeng',
        events: {
          sendDataBack: (data) => {
            this.items = data;
            this.drawBarChart();
			this.filterItems()
          }
        }
      });
    },
	navigateToStockCheck1() {
	  uni.navigateTo({
	    url: '/pages/shoppingcart/shoppingcart',
		})
		},
	showTemporaryToast() {
	    uni.showToast({
	      title: '柱状图可以往右拉动',
	      icon: 'none', // 可以选择 'success', 'loading', 'none'
	      duration: 2000 // 提示框显示的时间（毫秒）
	    });
	  },
	filterItems() {
	  const query = this.searchQuery.toLowerCase();
	  this.filteredItems = this.items.filter(item => {
	    return (
	      item.name.toLowerCase().includes(query) || 
	      (item.description && item.description.toLowerCase().includes(query))
	    );
	  });
	},
	 loadData() {
	      const storedItems = uni.getStorageSync('inventory');
	      if (storedItems) {
	        this.items = storedItems;
	      }
		  this.items = loadData('inventory'); // 从本地存储加载数据
		  this.filterItems(); // 根据加载的数据进行初始过滤
	    },
   drawBarChart() {
       const context = uni.createCanvasContext('barChart', this);
   
       if (this.items.length === 0) return;
   
       const quantities = this.items.map(item => item.number);
       const names = this.items.map(item => item.name);
   
       const maxQuantity = Math.max(...quantities) || 1;
       const canvasWidth = uni.upx2px(750);
       const canvasHeight = uni.upx2px(400);
       
       const itemCount = this.items.length;
       const maxBarCount = 7; // 最大柱状图数量
       const barPadding = 20; // 柱状图间距
   
       // 计算每个柱状图的宽度和间距
       const barWidth = Math.max((canvasWidth - barPadding * (itemCount + 1)) / itemCount, 30); // 最小宽度为30
       const spacing = barPadding; // 保持固定的间距
   
       context.clearRect(0, 0, canvasWidth, canvasHeight);
   
       quantities.forEach((quantity, index) => {
         const barHeight = (quantity / maxQuantity) * (canvasHeight - 40);
         const x = index * (barWidth + spacing) + spacing; // 添加间距以适应柱状图位置
         const y = canvasHeight - barHeight;
   
         context.setFillStyle('#4CAF50');
         context.fillRect(x, y, barWidth, barHeight);
   
         // 绘制商品名（水平显示）
         const name = names[index];
         context.setFontSize(24);
   
         // 调节字体大小以适应柱状图
         let nameWidth = context.measureText(name).width;
         let adjustedFontSize = 24;
   
         while (nameWidth > barWidth - 10 && adjustedFontSize > 8) {
           adjustedFontSize -= 2;
           context.setFontSize(adjustedFontSize);
           nameWidth = context.measureText(name).width;
         }
   
         const textX = x + (barWidth - nameWidth) / 2; // 中心对齐
         const textY = canvasHeight - 10; // 在柱状图下方的位置
   
         context.setFillStyle('#000');
         context.setFontSize(adjustedFontSize);
         context.fillText(name, textX, textY);
   
         // 绘制数量
         const quantityText = quantity.toString();
         const quantityWidth = context.measureText(quantityText).width;
         context.setFillStyle('#000');
         context.setFontSize(adjustedFontSize);
         context.fillText(quantityText, x + (barWidth - quantityWidth) / 2, y - 10);
       });
   
       context.draw();
    }
  }
}
</script>
<style>
.container {
  padding: 20rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.header {
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 750rpx;
  margin-bottom: 20rpx;
}

.button {
  width: 500rpx;	
  color: white;
  text-align: center;
  line-height: 60rpx;
  border-radius: 10rpx;
  margin: 0 10rpx;
  box-shadow: aliceblue 3rpx 3rpx;
}

.chart {
  width: 200%;
  height: 100%;
}
.scroll-view {
  width: 100%;
  height: 400rpx;
  overflow: hidden; /* 避免超出内容显示滚动条 */
}
.container {
  padding: 20rpx;
}

.search-box {
  width: 100%;
  height: 60rpx;
  padding: 10rpx;
  margin-bottom: 20rpx;
  border: 1rpx solid #ccc;
  border-radius: 10rpx;
}

.table {
  width: 100%;
  background: #f9f9f9;
}

.table-row {
  display: flex;
  justify-content: space-between;
  padding: 10rpx 20rpx;
  border-bottom: 1rpx solid #ccc;
}

.table-cell {
  width: 33%;
}

.ziti{
	font-size: 36rpx;
	font-weight: bold;
}
</style>
