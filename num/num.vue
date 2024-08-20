<template>
  <view class="container">
    <picker mode="date" @change="onStartDateChange">
      <view class="picker">开始日期: {{ startDate }}</view>
    </picker>
    <picker mode="date" @change="onEndDateChange">
      <view class="picker">结束日期: {{ endDate }}</view>
    </picker>
    <button @click="filterOrders">筛选订单</button>

    <view v-if="filteredItems.length > 0">
      <view class="order-summary">
        <text>选定范围内的总金额: ¥{{ totalAmount }}</text>
      </view>
      <view class="order-list">
        <view class="order-item" v-for="(item, index) in filteredItems" :key="index">
          <view>商品名: {{ item.name }}</view>
          <view>售量: {{ item.number }} {{ item.unit }}</view>
          <view>销售额: ¥{{ item.totalPrice }}</view>
          <view>时间: {{ formatDate(item.timestamp) }}</view>
        </view>
      </view>
    </view>
    <view v-else>
      <text>没有符合条件的订单</text>
    </view>
  </view>
</template>

<script>
import { loadData } from '@/services/storageService.js';

export default {
  data() {
    return {
      filteredItems: [],
      totalAmount: 0,
      startDate: '',
      endDate: '',
    };
  },
  methods: {
    onStartDateChange(e) {
      this.startDate = e.detail.value;
    },
    onEndDateChange(e) {
      this.endDate = e.detail.value;
    },
    filterOrders() {
      if (!this.startDate || !this.endDate) {
        uni.showToast({
          title: '请选择日期范围',
          icon: 'none',
        });
        return;
      }

      const start = new Date(`${this.startDate}T00:00:00`).getTime();
      const end = new Date(`${this.endDate}T23:59:59`).getTime();

      this.filteredItems = this.items.filter((item) => {
        const itemTime = new Date(item.timestamp).getTime();
        return itemTime >= start && itemTime <= end;
      });

      this.totalAmount = this.filteredItems.reduce(
        (sum, item) => sum + parseFloat(item.totalPrice),
        0
      ).toFixed(2);
    },
    formatDate(timestamp) {
      const date = new Date(timestamp);
      return `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date
        .getHours()
        .toString()
        .padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date
        .getSeconds()
        .toString()
        .padStart(2, '0')}`;
    },
  },
  mounted() {
    this.items = loadData('orders') || [
      {
        name: '商品A',
        price: 10,
        number: 5,
        unit: '个',
        totalPrice: '50.00',
        timestamp: '2024-08-19T10:00:00Z',
      },
      {
        name: '商品B',
        price: 20,
        number: 2,
        unit: '个',
        totalPrice: '40.00',
        timestamp: '2024-08-20T12:30:00Z',
      },
      {
        name: '商品C',
        price: 15,
        number: 3,
        unit: '个',
        totalPrice: '45.00',
        timestamp: '2024-08-21T14:00:00Z',
      },
    ];
  },
};
</script>

<style>
.container {
  padding: 20rpx;
}

.picker {
  margin: 20rpx 0;
  padding: 10rpx;
  background-color: #f0f0f0;
  border-radius: 10rpx;
}

.order-summary {
  margin-top: 20rpx;
  font-weight: bold;
}

.order-list {
  margin-top: 20rpx;
}

.order-item {
  margin-bottom: 20rpx;
  padding: 10rpx;
  background-color: #fff;
  border-radius: 10rpx;
  box-shadow: 0 0 5rpx rgba(0, 0, 0, 0.1);
}
</style>
