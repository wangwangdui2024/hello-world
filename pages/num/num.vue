<template>
  <view class="container">
    <!-- 时间段选择器 -->
    <view class="date-picker">
      <picker mode="date" @change="startDateChange">
        <view class="picker-item">开始日期：{{ startDate }}</view>
      </picker>
      <picker mode="date" @change="endDateChange">
        <view class="picker-item">结束日期：{{ endDate }}</view>
      </picker>
    </view>

    <!-- 报表统计数据 -->
    <view class="report-summary">
      <view class="summary-item">总销售额：<text class="value">{{ totalSales | formatCurrency }}</text></view>
      <view class="summary-item">总订单数：<text class="value">{{ totalOrders }}</text></view>
      <view class="summary-item">平均订单值：<text class="value">{{ averageOrderValue | formatCurrency }}</text></view>
    </view>

    <!-- 销售详情 -->
    <view class="sales-details">
      <view v-for="(item, index) in salesDetails" :key="index" class="detail-item">
        <view>日期：<text class="date">{{ item.date }}</text></view>
        <view>订单数：<text class="number">{{ item.orders }}</text></view>
        <view>销售额：<text class="value">{{ item.sales | formatCurrency }}</text></view>
      </view>
    </view>
  </view>
</template>

<script>
import { saveData, loadData } from '@/services/storageService.js';
export default {
  data() {
    return {
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      totalSales: 0,
      totalOrders: 0,
      averageOrderValue: 0,
      salesDetails: []
    }
  },
  methods: {
    async updateReport() {
      const data = await storageService.getSalesData()
      const filteredData = data.filter(item => item.date >= this.startDate && item.date <= this.endDate)

      this.totalSales = filteredData.reduce((acc, item) => acc + item.sales, 0)
      this.totalOrders = filteredData.reduce((acc, item) => acc + item.orders, 0)
      this.averageOrderValue = this.totalOrders === 0 ? 0 : this.totalSales / this.totalOrders

      this.salesDetails = this.formatSalesDetails(filteredData)
    },
    formatSalesDetails(data) {
      const details = []
      data.forEach(item => {
        const existing = details.find(detail => detail.date === item.date)
        if (existing) {
          existing.orders += item.orders
          existing.sales += item.sales
        } else {
          details.push({
            date: item.date,
            orders: item.orders,
            sales: item.sales
          })
        }
      })
      return details
    },
    startDateChange(e) {
      this.startDate = e.detail.value
      this.updateReport()
    },
    endDateChange(e) {
      this.endDate = e.detail.value
      this.updateReport()
    }
  },
  mounted() {
    this.updateReport()
  },
  filters: {
    formatCurrency(value) {
      if (!value) return '0.00'
      return (value / 100).toFixed(2)
    }
  }
}
</script>

<style>
.container {
  padding: 20px;
  background: linear-gradient(135deg, #f0f4f8, #e8f1f4);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.date-picker {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.picker-item {
  background-color: #ffffff;
  border: 1px solid #dcdcdc;
  border-radius: 8px;
  padding: 12px;
  width: 48%;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.picker-item:hover {
  background-color: #f9f9f9;
  border-color: #bfbfbf;
}

.report-summary {
  background-color: #ffffff;
  border: 1px solid #dcdcdc;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.summary-item {
  margin-bottom: 12px;
  font-size: 18px;
  color: #333;
}

.value {
  font-weight: 600;
  color: #2a9d8f;
}

.sales-details {
  background-color: #ffffff;
  border: 1px solid #dcdcdc;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.detail-item {
  margin-bottom: 12px;
  font-size: 16px;
  color: #333;
}

.date {
  font-weight: 600;
  color: #4a90e2;
}

.number {
  color: #e76f51;
}

.value {
  color: #2a9d8f;
}
</style>
