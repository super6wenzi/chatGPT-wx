<template>
	<view class="bg">
		<image src="../../static/6.png" mode="scaleToFill" class="bg-img"></image>
		<view class="advertising">
			<ad unit-id="adunit-94ed6bcc5bb80d7f"></ad>
		</view>
		<scroll-view scroll-with-animation :scroll-y="isScroll" style="width: 100%;" :scroll-into-view="intoindex">
			<!-- 用来获取消息体高度 -->
			<view id="okk" scroll-with-animation>
				<!-- 消息 -->
				<view class="flex-column-start" v-for="(x,i) in msgList" :key="i" :id="'text'+i">
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
					<view v-if="!x.my" class="aiinfo" >
						<view class="chat-img ">
							<image style="height: 100rpx;width: 100rpx;" src="../../static/9.jpg" mode="scaleToFill">
							</image>
						</view>
						<view class="flex" style="max-width: 500rpx;">
							<view class="aimsg" style="border-radius: 35rpx;background-color: #f9f9f9;">
								<text style="word-break: break-all;">{{x.output}}</text>
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
			<button class="btn" v-if="error">
			     服务端发生错误，请刷新后重试
			 </button>
			 <block v-else>
			<button class="btn" open-type="share" @click="shareFriends" v-if="showShareBtn">
			     分享获取次数
			 </button>
			<view class="inpubut">
				<input v-model="msg" class="dh-input" type="text" @confirm="sendMsg" confirm-type="search"
					placeholder-class="my-neirong-sm" placeholder="描述您的问题" @blur="isScroll=true;" @focus="isScroll=false;"/>
				<button @click="sendMsg" :disabled="msgLoad" class="btn">{{num<=0?'获取次数':isRequesting?'请求中...':sentext}}</button>
			</view>
			</block>
		</view>
		
	</view>
</template>

<script>
	import EasyTyper from 'easy-typer-js'
	export default {
		data() {
			return {
				intoindex:'',
				error:false,
				showShareBtn:true,
				rewardedVideoAd:null,//广告
				num:5,//次数
				apiurl:'',//后端转发地址
				api:'',//在此输入你的apikey
				isScroll:true,//是否可以滑动
				userAvatar: '',//头像
				msgLoad: false,
				anData: {},
				isRequesting:false,
				animationData: {},
				showTow: false,
				msgList: [{
					// my: false,
					// msg: "年轻人，我看你很迷茫。想要问些什么？"
					output: '年轻人，我看你很迷茫。想要问些什么？',
					isEnd: false,
					speed: 80,
					singleBack: false,
					sleep: 0,
					type: 'normal',
					backSpeed: 40,
					sentencePause: false
				}],
				msgContent: [],
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
			
			sendMsg() {
				const that=this;
				if(this.num<=0){
					this.rewardedVideoAd.show()
					return
				}
				// 消息为空不做任何操作
				if (this.msg == "") {
					return 0;
				}
				this.isRequesting=true;
				this.msgList.push({
					"msg": this.msg,
					"my": true
				})
				this.msgContent.push({
					"role": "user",
					"content": this.msg,
				})
				this.msgLoad = true
				// 清除消息
				this.msg = ""
				let data = JSON.stringify({
					body: this.msgContent,
					apiKey:this.api
				})
				uni.request({
					url: this.apiurl + '/message',
					data: data,
					method: 'POST',
					success: (res) => {
						if (res.data.code == 200) {
							let text = res.data.data.choices[0].message.content.replace("openai:", "").replace("openai：", "").replace(/^\n|\n$/g, "")
							// this.msgList.push({
							// 	"msg": text,
							// 	"my": false
							// })
							this.msgList.push({
								output: '',
								isEnd: false,
								speed: 100,
								singleBack: false,
								sleep: 0,
								type: 'normal',
								backSpeed: 40,
								sentencePause: false
							})
							new EasyTyper(this.msgList[this.msgList.length-1], text)
							this.isRequesting=false;
							this.num--
							this.msgContent.push({
								"role": res.data.data.choices[0].message.role,
								"content": text,
							})
							this.msgLoad = false
							// this.sentext = `发送(${this.num}次)`
							this.$nextTick(()=> {
								that.intoindex = "text" + (this.msgList.length-1)
								console.log(44555,that.intoindex);
							});
						} else {
							this.error=true
						}
					},
					fail: (err) => {
						console.log(3344444,'失败');
						this.error=true
					}
				})
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
		width: 70%;
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
		white-space: nowrap;
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
