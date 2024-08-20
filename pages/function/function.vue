<template>
  <view class="container">
    <!-- 库存增减部分 -->
    <view class="stock-control">
      <text class="label">库存数量:</text>
      <button @click="decrementStock" class="button">-</button>
      <input type="number" v-model="stockQuantity" class="input" />
      <button @click="incrementStock" class="button">+</button>
    </view>

    <!-- 图片上传部分 -->
    <view class="image-section">
      <button @click="addImage" class="add-image-button">添加图片</button>
      <view class="image-list">
        <view v-for="(image, index) in images" :key="index" class="image-container">
          <image :src="image.url" class="added-image"></image>
          <text class="upload-status">{{ image.uploaded ? '上传成功' : '上传中...' }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      stockQuantity: 0,  // 初始库存数量
      images: []  // 用于存储添加的图片路径
    };
  },
  methods: {
    incrementStock() {
      this.stockQuantity++;
    },
    decrementStock() {
      if (this.stockQuantity > 0) {
        this.stockQuantity--;
      }
    },
    addImage() {
      const that = this;
      uni.chooseImage({
        count: 1,  // 一次选择一张图片
        success: function (res) {
          const tempFilePaths = res.tempFilePaths;
          // 将选择的图片路径添加到images数组中，并开始上传
          that.images.push({ url: tempFilePaths[0], uploaded: false });
          that.uploadImage(tempFilePaths[0]);  // 上传图片
		  this.updateImageStatus()
        }
      });
    },
    uploadImage(imagePath) {
      uni.uploadFile({
        url: 'https://example.com/upload', // 你的上传接口地址
        filePath: imagePath,
        name: 'file',
        success: (uploadFileRes) => {
          console.log('上传成功', uploadFileRes);
          // 根据接口返回的结果更新图片状态
          this.updateImageStatus(imagePath, true);
        },
        fail: (error) => {
          console.error('上传失败', error);
          this.updateImageStatus(imagePath, false);
        }
      });
    },
    updateImageStatus(imagePath, uploaded) {
      // 更新images数组中的上传状态
      const image = this.images.find(img => img.url === imagePath);
      if (image) {
        image.uploaded = uploaded;
      }
    }
  }
};
</script>

<style scoped>
.container {
  padding: 20px;
}

/* 库存增减样式 */
.stock-control {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 50px;
}

.label {
  font-size: 18px;
  margin-right: 10px;
}

.button {
  width: 50px;
  height: 50px;
  background-color: #27BA9B;
  color: white;
  font-size: 24px;
  border: none;
  border-radius: 5px;
  text-align: center;
  line-height: 50px;
  cursor: pointer;
  margin: 0 10px;
}

.input {
  width: 100px;
  text-align: center;
  font-size: 24px;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 5px;
}

/* 图片上传样式 */
.image-section {
  margin-top: 20px;
}

.add-image-button {
  background-color: #27BA9B;
  color: white;
  padding: 10px 20px;
  border-radius: 10px;
  text-align: center;
}

.image-list {
  margin-top: 20px;
}

.image-container {
  margin-bottom: 20px;
}

.added-image {
  width: 200px;
  height: 200px;
  border-radius: 10px;
}

.upload-status {
  font-size: 14px;
  color: #666;
  text-align: center;
  margin-top: 5px;
}
</style>
