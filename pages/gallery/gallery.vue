<template>
  <view class="container">
    <button @click="openGallery">打开相册</button>
    <image v-if="selectedImage" :src="selectedImage" class="preview"></image>
  </view>
</template>

<script>
export default {
  data() {
    return {
      selectedImage: ''  // 存储选择的图片路径
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
    }
  }
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f8f8f8;
}

button {
  padding: 20rpx 40rpx;
  background-color: #27ba9b;
  color: white;
  border-radius: 10rpx;
  font-size: 32rpx;
  margin-bottom: 20rpx;
}

.preview {
  width: 300rpx;
  height: 300rpx;
  border: 1px solid #ccc;
  border-radius: 10rpx;
}
</style>
