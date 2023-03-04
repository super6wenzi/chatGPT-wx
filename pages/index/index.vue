<template>
	<view class="bg">
		<image src="../../static/6.png" mode="scaleToFill" class="bg-img"></image>
		<view class="advertising">
			<ad unit-id="adunit-94ed6bcc5bb80d7f"></ad>
		</view>
		<scroll-view scroll-with-animation :scroll-y="isScroll" :scroll-top="scrollTop" style="width: 100%;">
			
			<!-- 用来获取消息体高度 -->
			<view id="okk" scroll-with-animation>
				<!-- 消息 -->
				<view class="flex-column-start" v-for="(x,i) in msgList" :key="i">
					<!-- 用户消息 头像可选加入-->
					<view v-if="x.my" class="userinfo">
						<view class="flex justify-end my-info">
							<view class="usermsg" style="max-width: 500rpx;">
								<text style="word-break: break-all;">{{x.msg}}</text>
							</view>
							<view class="chat-img" style="margin-left:20rpx ;">
								<image style="height: 100rpx;width: 100rpx;" :src="userAvatar" mode="aspectFit">
								</image>
							</view>
						</view>
					</view>
					<!-- 机器人消息 -->
					<view v-if="!x.my" class="aiinfo">
						<view class="chat-img ">
							<image style="height: 100rpx;width: 100rpx;" src="../../static/9.jpg" mode="scaleToFill">
							</image>
						</view>
						<view class="flex" style="max-width: 500rpx;">
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
			<button class="btn" open-type="share" @click="shareFriends" v-if="showShareBtn">
			     分享获取次数
			 </button>
			<button class="btn" style="margin-bottom: 20rpx;width: auto;"
				v-if="!apisucc">{{apibut}}</button>
			<view class="inpubut" v-else>
				<input v-model="msg" class="dh-input" type="text" @confirm="sendMsg" confirm-type="search"
					placeholder-class="my-neirong-sm" placeholder="描述您的问题" @blur="isScroll=true;" @focus="isScroll=false;"/>
				
				<button @click="sendMsg" :disabled="msgLoad" class="btn">{{num<=0?'获取次数':isRequesting?'请求中...':sentext}}</button>
			</view>
		</view>
		<!-- <uni-popup ref="popup" type="center">
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
		</uni-popup> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				showShareBtn:true,
				rewardedVideoAd:null,//广告
				num:1,//次数
				scrollTop:9999,
				isScroll:true,//是否可以滑动
				userAvatar: '',//头像
				apiurl: 'https://flask-web-framework-s-gkhnhvucgc.cn-hangzhou.fcapp.run',
				apisucc: true,
				apibut: 'api检测中,请稍等...',
				// sentext: '发送',
				// apiadj: '在此输入你的APIKEY',
				msgLoad: false,
				anData: {},
				isRequesting:false,
				animationData: {},
				showTow: false,
				msgList: [{
					my: false,
					msg: "年轻人，我看你很迷茫。想要问些什么？"
				}],
				msgContent: "",
				msg: ""
			}
		},
		computed:{
			sentext:function(){
				return `发送(${this.num}次)`
			}
		},
		onLoad() {
			// 激励广告
			if(wx.createRewardedVideoAd){
			      this.rewardedVideoAd = wx.createRewardedVideoAd({ adUnitId: 'adunit-29ff42bda9593523' })
			      this.rewardedVideoAd.onLoad(() => {
			        console.log('onLoad event emit')
			      })
			      this.rewardedVideoAd.onError((err) => {
			        console.log('onError event emit', err)
			      })
			      this.rewardedVideoAd.onClose((res) => {
			        console.log('onClose event emit', res)
					if(res.isEnded){
						this.num=5
					}
			      })
			    }
			wx.showShareMenu({
			        withShareTicket:true,
			        //设置下方的Menus菜单，才能够让发送给朋友与分享到朋友圈两个按钮可以点击
			        menus:["shareAppMessage","shareTimeline"]
			    })
		
			const that = this;
			this.userAvatar = uni.getStorageSync('user-avatar')
			// this.apiset()
			try {
				const value = uni.getStorageSync('sk');
				// if (value) {
				// 	console.log(value);
				// 	this.api = value

				// }
			} catch (e) {
				// error
				console.log(e);
			}

		},
		methods: {
			shareFriends() {
				uni.share({
					provider: 'weixin',
					scene: 'WXSenceTimeline',
					title: 'chatGPT智能聊天机器人',
					success: (res)=> {
						console.log('111success:' + JSON.stringify(res));
					},
					fail: (err)=> {
						console.log('222fail:' + JSON.stringify(err));
					}
			})
			this.num=3;
			this.showShareBtn=false;
			},
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
			// apiset() {
			// 	// this.$refs.popup.close('center')
			// 	this.apibut = 'api检测中,请稍等...'
			// 	let data = JSON.stringify({
			// 		msg: "你好",
			// 		// openaikey: this.api
			// 	})
			// 	uni.request({
			// 		url: this.apiurl + '/message',
			// 		data: data,
			// 		method: 'POST',
			// 		success: (res) => {
			// 			console.log('suc', res, res.data.code)
			// 			if (res.data.code == 200) {
			// 				this.apibut = '连接成功',
			// 					this.apisucc = true
			// 				this.sentext = '发送'
			// 				this.msgLoad = false
			// 				this.setsklocal(this.api)
			// 			} else {
			// 				this.apibut = '连接失败，请检查apikey后重试'
			// 			}
			// 		},
			// 		fail:(err)=> {
			// 			this.apibut = '连接失败，请检查apikey后重试'
			// 		}
			// 	})

			// },
			sendMsg() {
				if(this.num<=0){
					this.rewardedVideoAd.show()
					return
				}
				// 消息为空不做任何操作
				if (this.msg == "") {
					return 0;
				}
				if (this.msgLoad == true) {
					this.$u.toast('请先配置api再进行使用')
					return 0
				}
				this.isRequesting=true;
				// this.sentext = '请求中'
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
					url: this.apiurl + '/message',
					data: data,
					method: 'POST',
					success: (res) => {
						if (res.data.code == 200) {
							let text = res.data.resmsg.replace("openai:", "").replace("openai：", "")
								.replace(/^\n|\n$/g, "")
							console.log(text);
							this.msgList.push({
								"msg": text,
								"my": false
							})
							this.isRequesting=false;
							this.num--
							this.msgContent += (text + "\n")
							this.msgLoad = false
							// this.sentext = `发送(${this.num}次)`
							this.scrollToBottom()
						} else {
							this.apibut = '连接失败，请检查apikey后重试'
							this.apisucc = false
						}
					},
					fail: (err) => {
						console.log(3344444,'失败');
					}
				})
			},
			scrollToBottom(){
				const that=this;
				setTimeout(()=>{
					that.scrollTop++
				},500)
			},
		}
	}
</script>

<style>
	page {
		height: 100%;
	}
	.advertising{
		
	}
	.bg {
		/* overflow: scroll; */
		/* background: url('../../static/6.png') no-repeat;
		background-size: 100% 100%; */
		width: 100%;
		height: 100%;
	}

	.bg-img {
		width: 100%;
		height: 100%;
		position: fixed;
	}

	.userinfo {
		animation: oneshow 0.8s ease 1;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		padding-right: 20rpx;
		margin-top: 20rpx;
	}

	.usermsg {
		margin-left: 20rpx;
		padding: 17rpx 20rpx;
		border-radius: 35rpx;
		background-color: #f9f9f9 !important;
		// margin-top: 20rpx;
	}

	.my-info {
		display: flex;
		align-items: center;
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
		overflow: hidden;
		border-radius: 50%;
		/* width: 100rpx;
		height: 100rpx; */
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
		/* background-color: #f9f9f9; */
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
		font-size: 32rpx;
		color: #616161;
	}

	.btn {
		height: 80rpx;
		line-height: 80rpx;
		width: 35%;
		background: linear-gradient(to right, #008FFF, #29C8FC);
		color: #ffffff;
		font-size: 32rpx;
		;
		border-radius: 2500px;
		margin: 0 20rpx;

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
