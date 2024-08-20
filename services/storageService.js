// services/storageService.js
export function saveData(key, data) {
  uni.setStorageSync(key, data);
}

export function loadData(key) {
  return uni.getStorageSync(key) || [];
}
