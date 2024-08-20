<template>
	<view>
		增加库存页面
		<button type="warn"class="uni-button" size="mini" @tap="close">关闭</button>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			close(){
				uni.switchTab({
					url:'/pages/repertory/repertory'
				})
			}
			
			
		}
	}
</script>

<style>
	
</style>
