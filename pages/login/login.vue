<template>
	<view class="bg">
		<image src="../../static/6.png" mode="scaleToFill" class="bg-img"></image>
		<!-- <view class="tips">
			友情提示：AI机器人的所有知识截止到2021年。
		</view> -->
		<button @click="toChat">开始聊天</button>
		<button class="avatar-wrapper" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
			选择头像
		        </button>
		<button @click="showQrcode">联系我们</button>
		<uni-popup ref="popup" type="center">
			<view class="qr-code">
				<image src="../../static/QRcode.jpg" mode="aspectFit"></image>
			</view>
		</uni-popup>
		<view class="advertising">
			<ad unit-id="adunit-ff48d59f501d5294"></ad>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				avatarUrl:'',
			}
		},
		onLoad() {
			wx.showShareMenu({
			        withShareTicket:true,
			        //设置下方的Menus菜单，才能够让发送给朋友与分享到朋友圈两个按钮可以点击
			        menus:["shareAppMessage","shareTimeline"]
			    })
		},
		methods: {
			showQrcode(){
				this.$refs.popup.open('center')
			},
			onChooseAvatar(e) {
				uni.setStorageSync('user-avatar',e.detail.avatarUrl);
				setTimeout(()=>{
						uni.navigateTo({
							url:'/pages/index/index'
						})
				},300)
				
			},
			toChat(){
				uni.navigateTo({
					url:'/pages/index/index'
				})
			},
			getUserInfo(){
				uni.getUserProfile({
					desc: '用于您的页面展示用户头像与昵称',
					lang: 'zh_CN',
					success: res => {
					    console.log(res);
						uni.setStorageSync('userInfo',res.userInfo)
						
					},
					fail: err => {
						console.log(err.errMsg);
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.bg{
		width: 100%;
		height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		.advertising{
			position: fixed;
			bottom: 0;
		}
		button{
			margin-bottom: 30rpx;
			width: 250rpx;
			height: 100rpx;
			border-radius: 10rpx;
			background: linear-gradient(to right,#008FFF,#29C8FC);
			color: #FFF;
			line-height: 100rpx;
		}
		.bg-img{
			position: fixed;
			width: 100%;
			height: 100%;
		}
		.tips{
			background: rgba(0,0,0,0.4);
			font-size: 32rpx;
			color: #FFF;
			position: fixed;
			top: 200rpx;
			z-index: 999;
			// width: 80%;
			border-radius: 20rpx;
			padding: 20rpx;
			margin-bottom: 60rpx;
		}
	}
</style>
