<template>
	<view class="main">
		
		<view class="box">
			<view class="text">
				登录
			</view>
			
			<view class="input">
				<input type="text" placeholder="请输入账号" v-model="dUser" value="" id="login-username" placeholder-class="loadplace">
			</view>
			<view class="input">
				<input type="text" placeholder="请输入密码" v-model="dPass" value="" password="true" id="login-password" placeholder-class="loadplace">
			</view>
			
			<view class="remember-psw">
				<checkbox-group>
					<checkbox type="checkbox" :checked='rememberPsw' @click="rememberPsw=!rememberPsw" color="#09CC86">
						记住账号密码
					</checkbox>
				</checkbox-group>
			</view>
			<view class="button">
				<button size="default" type="default" style="color: #ffffff;"
				class="button" @click="dl">登录</button>
			</view>
			
		</view>
		
	</view>
	
	<view>
		
	</view>
	
	<view class="zhuce">
		<text  @click="zhuce()">注册</text>
		
	</view>
	
</template>

<script>
	export default {
		data() {
			return {
				rememberPsw: true,
				dUser: "",
				dPass: "",
				// User:[{username:"123",password:"123"},{username:"111",password:"123456"}]
			}
		},
		
		methods: {
			// login(){
			// 	uni.switchTab({
			// 		url:'/pages/shopping/shopping'
			// 	})
			// },
			zhuce(){
				uni.navigateTo({
					url:'/pages/zhuce/zhuce'
				})
			},
			
			
			onload(){
				
			},
			
			login(){
				uni.switchTab({
					url:'/pages/shopping/shopping'
				})
			},
			
			dl(){
				
				 var remember = [{user:"456",password:"123"},{user:"111",password:"123"}];
				if(this.dUser&&this.dPass){
					var arr = uni.getStorageSync("List") ? uni.getStorageSync("List") : [];
					console.log(arr);
					for(var i=0;i<arr.length;i++){
						if(arr[i].user==this.dUser){
							if(arr[i].pass==this.dPass){
							   uni.showModal({
									title:"登录成功",
									showCancel:false,
								});
								setTimeout(() => {this.login()},1000);
								this.dUser = "";
								this.dPass = "";
								
								
							}else{
								uni.showModal({
										title:"密码错误",
										showCancel:false
								})
							}
							break;
							}
						}
							
						if(i==arr.length){
							uni.showModal({
								title:"该用户不存在",
								showCancel:false
								})
							}
						
						
						
					
					
				}
				
				else if(this.dUser){
					for(var i=0;i<remember.length;i++){
						if(this.dUser==remember[i].user){
						// uni.showModal({
						// 	title : "密码是"+remember[i].password
						// })
						this.dPass=remember[i].password;
						}
					}
				}
				
			},
			
		
		     	
			
			
			// 326159487
			// 362951847
			// 784951623
			// 748159263
			// 124357689
			// 142753869
			// 968357241
			// 986753421



			
			
		}
	}
</script>

<style lang="scss">
	.is-hover {
		color: rgba(255, 255, 255, 0.6);
		background-color: #179b16;
		border-color: #179b16;
		
	  }
	  
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
	.uni-mt-5 {
		margin-top: 5px;
	}
	.main {
		display:flex;
		justify-content: center;
		background-color: whitesmoke;
		
		
	}
	.box {
		display:flex;
		width: 90%;
		height:250px;
		flex-direction: column;
		justify-content: space-between;
		
	}
	.text {
		font-size: 35rpx;
		
	}
	.input {
		display:flex;
		border: 1px solid #8f8f94;
		align-items: center;
		height: 35px;
		background: white;
	}
	.button {
		text-align: center;
		background-image: linear-gradient(to right,#0ef8c8,#10fc58);
		border-radius: 23px;
	}
	.zhuce {
		//文本加下划线
		text-decoration: underline;
		font-size: 28rpx;
		color: #8f8f94;
		text-align: center;
	}
	.loadplace {
		display: flex;
		padding-left: 10px;
		font-size: 13px;
	}
	
	.remember-psw{
		font-size: 16px;
		color: #4a4a4a;
	}
</style>
