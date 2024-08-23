<template>
	<view class="main">
		
		<view class="box2">
			
			<view class="text">
				注册
			</view>
			<view class="input">
				<input type="text" placeholder="设置账号" v-model="zUser" value="" placeholder-class="loadplace">
			</view>
			<view class="input">
				<input type="text" placeholder="设置密码" v-model="zPass" password="true" value="" placeholder-class="loadplace">
			</view>
			
			<view class="input">
				<input type="text" placeholder="确认密码" v-model="qrPass" password="true" value="" placeholder-class="loadplace">
			</view>
			
			<view class="button1">
				<button size="default" type="default" style="color:#ffffff"
				class="button1" @click="zc">注册</button>
			</view>
			<view class="button2">
				<button size="default" type="default" style="color:#ffffff"
				class="button2" @click="goback">取消</button>
			</view>
		</view>
		
	</view>
	
	
	
</template>

<script>
	export default {
		data() {
			return {
				//注册
				zUser: "",
				zPass: "",
				qrPass: "",
			}
		},
		
		onLoad() {
		
		},
		
		methods: {
			goback(){
				uni.navigateTo({
					url:'/pages/index/index'
				})
			},
			
			
			zc(){
				if(this.zUser&&this.zPass&this.qrPass){
					var obj = {
						"user" : this.zUser,
						"pass" : this.zPass
					}
					// var arr = [];
					// if(uni.getStorageSync("list")){
					// 	arr = uni.getStorageSync("list");
					// 	console.log(this.arr);
					// }
					var arr = uni.getStorageSync("List") ? uni.getStorageSync("List") : [];
					console.log(arr);
					for(var i=0;i<arr.length;i++){
						if(arr[i].user==this.zUser){
							uni.showModal({
								title:"该用户已存在",
								showCancel:false
							})
							break;
						}
					}
					
					if(i==arr.length&&(this.zPass==this.qrPass)){
						arr.push(obj);
						uni.showModal({
							title:"注册成功",
							showCancel:false
						});
						setTimeout(() => {this.goback()},900);
						this.zUser = "";
						this.zPass = "";
						uni.setStorageSync("List",arr);
					}else{
						uni.showModal({
							title:"设置的密码与确认密码不一致，请再次输入",
							showCancel:false
						})
					}
				}else if(this.zUser&&this.zPass){
					uni.showModal({
						title:"请输入确认密码",
						showCancel:false
					})
				}
				else{
					uni.showModal({
						title:"用户名或密码不能为空",
						showCancel:false
					})
				}
				
				
			},
			
			
			

			
		}
	}
</script>

<style>
	/* .popup {
		display: none;
		position: fixed;
		left: 50%;
		top: 50%;
		transform: translate(-50%,-50%);
	} */
	.button1 {
		
		border-radius: 23px;
		text-align: center;
		background-image: linear-gradient(to right,#0bc5f6,#0b73f6);
		
		
	}
	.button2 {
		border-radius: 23px;
		text-align: center;
		background-image: linear-gradient(to right,#f6340b,#f6760b);
		
		
	}
	.box2 {
		display:flex;
		width: 90%;
		height:300px;
		flex-direction: column;
		justify-content: space-between;
		
	}
	.input {
		display:flex;
		border: 1px solid #8f8f94;
		align-items: center;
		height: 35px;
		background-color: white;
	}
	.main {
		display:flex;
		justify-content: center;
		background-color: whitesmoke;
		
		
	}
	.text {
		font-size: 35rpx;
		
	}
	.loadplace {
		display: flex;
		padding-left: 10px;
		font-size: 13px;
	}
</style>
