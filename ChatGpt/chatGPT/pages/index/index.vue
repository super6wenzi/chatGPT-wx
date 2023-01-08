<template>
	<view >
		<scroll-view scroll-with-animation scroll-y="true" style="width: 100%;">
			<!-- 用来获取消息体高度 -->
			<view id="okk" scroll-with-animation>
				<!-- 消息 -->
				<view class="flex-column-start" v-for="(x,i) in msgList" :key="i">
					<!-- 用户消息 头像可选加入-->
					<view v-if="x.my" class="userinfo">
						<view class="flex justify-end" style="margin-right: 5%;">
							<view class="usermsg">
								<text style="word-break: break-all;">{{x.msg}}</text>
							</view>
						</view>
					</view>
					<!-- 机器人消息 -->
					<view v-if="!x.my" class="aiinfo">
						<view class="chat-img ">
							<image style="height: 75rpx;width: 75rpx;" src="../../static/openai.png" mode="aspectFit">
							</image>
						</view>
						<view class="flex" style="width: 500rpx;">
							<view class="aimsg" style="border-radius: 35rpx;background-color: #f9f9f9;">
								<text style="word-break: break-all;">{{x.msg}}</text>
							</view>
						</view>
					</view>
				</view>
				<!-- 防止消息底部被遮 -->
				<view style="height: 130rpx;">
				</view>
			</view>
		</scroll-view>
		<!-- 底部导航栏 -->
		<view class="flex-column-center">
			<button @click="openpop" class="btn" style="margin-bottom: 20rpx;width: auto;" v-if="!apisucc">{{apibut}}</button>
			<view class="inpubut" v-if="apisucc">
				<input v-model="msg" class="dh-input" type="text" @confirm="sendMsg" confirm-type="search"
					placeholder-class="my-neirong-sm" placeholder="描述您的问题" />
				
				<button @click="sendMsg" :disabled="msgLoad" class="btn " >{{sentext}}</button>
			</view>
		</view>
		<uni-popup ref="popup" type="center">
			<view class="popcls">
				<view class="uni-textarea" style="width: 90%;margin: 20rpx 20rpx;border: 1px solid #000000;">
					<textarea style="width: 100%; " placeholder-style="color:#F76260" :placeholder="apiadj"
						v-model="api" />
				</view>
				<view style="display: flex;flex-direction: row;">
					<button style="margin: 10rpx;" type="primary" @click="apiset">确认</button>
					<button style="margin: 10rpx;" @click="clopop">取消</button>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				apiurl:'1',
				apisucc:false,
				apibut: '需要先进行API配置才能使用',
				sentext: '先配置api',
				apiadj: '在此输入你的APIKEY',
				api: '',
				msgLoad: true,
				anData: {},
				animationData: {},
				showTow: false,
				msgList: [{
					my: false,
					msg: "你好呀,想问什么就问吧"
				}],
				msgContent: "",
				msg: ""
			}
		},

		onLoad() {
			try {
				const value = uni.getStorageSync('sk');
				if (value) {
					console.log(value);
					this.api = value
					this.apiset()

				}
			} catch (e) {
				// error
				console.log(e);
			}
			uni.request({
				url:this.apiurl,
			
				method:'GET',
				success: (res) => {
					console.log(res);
					this.apiadj = res.data
				}})
			
		},

		methods: {
			setsklocal(apikey) {
				uni.setStorage({
					key: 'sk',
					data: apikey,
					success: function(res) {
						console.log('success', res);
					}
				});
			},
			clopop() {
				this.$refs.popup.close('center')
			},
			openpop() {
				this.$refs.popup.open('center')
			},
			apiset() {
				this.$refs.popup.close('center')
				this.apibut = 'api检测中'
				
				let data = JSON.stringify({
					msg: "你好",
					openaikey: this.api
				})
				uni.request({
					url:this.apiurl+'/message',
					data:data,
					method:'POST',
					success: (res) => {
						console.log('suc',res,res.data.code)
						
						if (res.data.code == 200){
							
							this.apibut = '连接成功',
							this.apisucc = true
							this.sentext = '发送'
							this.msgLoad = false
							this.setsklocal(this.api)
						}else{
							this.apibut = '连接失败，请检查apikey后重试'
						}
					},
				})			
				
			},
			sendMsg() {
				// 消息为空不做任何操作
				if (this.msg == "") {
					return 0;
				}
				if (this.msgLoad == true) {
					this.$u.toast('请先配置api再进行使用')
					return 0
				}
				this.sentext = '请求中'
				this.msgList.push({
					"msg": this.msg,
					"my": true
				})
				this.msgContent += ('YOU:' + this.msg + "\n")
				console.log(this.msgContent);
				this.msgLoad = true
				// 清除消息
				this.msg = ""
				let data = JSON.stringify({
					msg: this.msgContent,
					openaikey: this.api
				})
				uni.request({
					url:this.apiurl+'/message',
					data:data,
					method:'POST',
					success: (res) => {
						if (res.data.code == 200){
							let text = res.data.resmsg.replace("openai:", "").replace("openai：", "")
								.replace(/^\n|\n$/g, "")
							console.log(text);
							this.msgList.push({
								"msg": text,
								"my": false
							})
							this.msgContent += (text + "\n")
							this.msgLoad = false
							this.sentext = '发送'
						}else{
							this.apibut = '连接失败，请检查apikey后重试'
							this.apisucc = false
						}
					},
				})
			},
		}
	}
</script>

<style>
	.userinfo {
		animation: oneshow 0.8s ease 1;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		padding-right: 20rpx;
	}

	.usermsg {
		margin-left: 20rpx;
		padding: 17rpx 20rpx;
		border-radius: 35rpx;
	}

	.aiinfo {
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-left: 20rpx;
		margin-top: 20rpx;
		animation: oneshow 0.8s ease 1;
	}

	.chat-img {
		border-radius: 50%;
		width: 100rpx;
		height: 100rpx;
		background-color: #f7f7f7;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}

	.aimsg {
		display: flex;
		flex-direction: column;
		justify-content: center;
		margin-left: 20rpx;
		padding: 17rpx 20rpx;
	}

	.flex-column-center {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		position: fixed;
		bottom: 0px;
		width: 100%;
	}

	.inpubut {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		align-items: center;
		background-color: #f9f9f9;
		width: 100%;
		height: 110rpx;
		font-size: 40rpx;
	}

	.dh-input {
		width: 90%;
		height: 80rpx;
		border-radius: 100rpx;
		padding-left: 40rpx;
		margin-left: 20rpx;

		background-color: #f0f0f0;
	}

	.my-neirong-sm {
		font-size: 23rpx;
		color: #616161;
	}

	.btn {
		height: 90rpx;
		width: 35%;
		background-color: cornflowerblue;
		color: #ffffff;
		border-radius: 2500px;

	}

	.popcls {
		width: 80vw;
		height: 40vh;
		background: white;
		border-radius: 20rpx;
		display: flex;
		flex-direction: column;
		justify-items: center;
		align-items: center;



	}
</style>

