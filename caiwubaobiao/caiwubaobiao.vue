<template>
  <view>
    <picker mode="date" @change="onStartDateChange">
      <view class="picker">开始日期: {{ startDate }}</view>
    </picker>
    <picker mode="date" @change="onEndDateChange">
      <view class="picker">结束日期: {{ endDate }}</view>
    </picker>
 
    <view>
      <view class="financial-summary">
        <view class="summary-item" style="background-color: #f39c12; border: 2px solid #e67e22;">总收入: {{ totalIncome }}</view>
        <view class="summary-item" style="background-color: #e74c3c; border: 2px solid #c0392b;">总支出: {{ totalExpense }}</view>
        <view class="summary-item" style="background-color: #ffd166; border: 2px solid #e67e22;">净利润: {{ netProfit }}</view>
      </view>
      
      <view class="financial-table">
        <view class="table-header">
          <view class="table-cell">日期</view>
          <view class="table-cell">收入</view>
          <view class="table-cell">支出</view>
          <view class="table-cell">净利润</view>
        </view>
        <view v-for="item in aggregatedFinancialData" :key="item.date" class="table-row">
          <view class="table-cell">{{ item.date }}</view>
          <view class="table-cell">{{ item.income }}</view>
          <view class="table-cell">{{ item.expense }}</view>
          <view class="table-cell">{{ item.profit }}</view>
        </view>
      </view>
    </view>
  </view>
</template>
 
<script>
import { loadData } from '@/services/storageService.js';
 
export default {
  data() {
    return {
      startDate: '',
      endDate: '',
      incomeData: [],  // 存储收入数据
      expenseData: [], // 存储支出数据
      totalIncome: 0,
      totalExpense: 0,
      netProfit: 0,
    };
  },
  computed: {
    aggregatedFinancialData() {
      if (!this.startDate || !this.endDate) {
        return [];
      }
 
      const start = new Date(this.startDate);
      const end = new Date(this.endDate);
      
      // 将结束日期的时间设置为23:59:59
      end.setHours(23, 59, 59, 999);
 
      // 将日期格式化为 YYYY-MM-DD
      const formatDate = (date) => {
        const d = new Date(date);
        return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
      };
 
      // 按日期汇总收入和支出数据
      const summary = {};
      
      // 汇总收入数据
      this.incomeData.forEach(order => {
        const orderDate = formatDate(order.timestamp);
        const orderDateObj = new Date(order.timestamp);
        if (orderDateObj >= start && orderDateObj <= end) {
          if (!summary[orderDate]) {
            summary[orderDate] = {
              date: orderDate,
              income: 0,
              expense: 0,
              profit: 0,
            };
          }
          summary[orderDate].income += (order.price*order.number);
        }
      });
 
      // 汇总支出数据
      this.expenseData.forEach(sell => {
        const sellDate = formatDate(sell.timestamp);
        const sellDateObj = new Date(sell.timestamp);
        if (sellDateObj >= start && sellDateObj <= end) {
          if (!summary[sellDate]) {
            summary[sellDate] = {
              date: sellDate,
              income: 0,
              expense: 0,
              profit: 0,
            };
          }
          summary[sellDate].expense += (sell.price*sell.number);
        }
      });
 
      // 计算净利润
      Object.values(summary).forEach(item => {
        item.profit = item.income - item.expense;
      });
 
      return Object.values(summary);
    }
  },
  methods: {
    onStartDateChange(e) {
      this.startDate = e.detail.value;
      this.calculateSummary();
    },
    onEndDateChange(e) {
      this.endDate = e.detail.value;
      this.calculateSummary();
    },
    calculateSummary() {
      const filteredData = this.aggregatedFinancialData;
      this.totalIncome = filteredData.reduce((sum, item) => sum + item.income, 0);
      this.totalExpense = filteredData.reduce((sum, item) => sum + item.expense, 0);
      this.netProfit = this.totalIncome - this.totalExpense;
    }
  },
  mounted() {
    this.incomeData = loadData('orders');
    this.expenseData = loadData('sells');
  }
}
</script>
 
<style lang="scss">
.financial-summary {
  display: flex;
  justify-content: space-around;
}
 
.summary-item {
  padding: 10px;
  margin: 5px;
  border-radius: 10px;
  text-align: center;
  color: white;
  font-size: 16px;
}
 
.financial-table {
  margin-top: 10px;
}
 
.table-header {
  display: flex;
  align-items: center;
  background-color: #f39c12;
  font-weight: bold;
}
 
.table-row {
  display: flex;
  border: 1px solid #ccc;
}
 
.table-cell {
  flex: 1;
  padding: 10px;
  border-right: 1px solid #ccc;
  text-align: center;
}
 
.table-cell:last-child {
  border-right: none;
}
 
.picker {
  margin: 20rpx 0;
  padding: 10rpx;
  background-color: #f0f0f0;
  border-radius: 10rpx;
}
</style>

