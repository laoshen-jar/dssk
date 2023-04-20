<template>
	<div class="container" v-if="loadding==0&&GoodsInfo">
		<div class="msg">
			<div class="msg-cot">
				<p class="text">商品信息</p>
				<div @click="goback" class="order-msg">
					<div class="img" :style="'background-image: url(' + GoodsInfo.Picture + ');'" />
					<!-- <img :src="GoodsInfo.Picture" /> -->
					<div class="text-box">
						<h6 class="title">{{GoodsInfo.GoodsName}}</h6>
						<p class="num" style="margin-top:10px">
							<span
								v-if="1-GoodsInfo.IntegralMaxRatio>0">￥{{ GoodsInfo.Price *parseInt((1-GoodsInfo.IntegralMaxRatio)*100)/100}}</span>
							<span v-if="GoodsInfo.IntegralMaxRatio<1&&GoodsInfo.IntegralMaxRatio>0"> + </span>
							<span
								v-if="GoodsInfo.IntegralMaxRatio>0">{{ GoodsInfo.Price *parseInt(GoodsInfo.IntegralMaxRatio* IntegralExchange*100)/100 }}积分</span>
						</p>
						<!-- <p class="spend">市场价￥{{GoodsInfo.Price}}</p> -->
					</div>
				</div>
			</div>
		</div>
		<div class="division"></div>
		<div class="price">
			<p class="text">数量</p>
			<div class="editnumberbox">
				<div style="font-size:14px">{{PayCount}}</div>
				<!-- <div :class="PayCount<2?'btn disable':'btn available'" @click="PayCountReduce"><i class="iconfont iconjianhao"></i></div> -->
				<!-- <div class="number">{{PayCount}}</div> -->
				<!-- <div class="btn available" @click="PayCountPlus"><i class="iconfont iconjiajianzujianjiahao"></i></div> -->
			</div>
		</div>
		<div class="price">
			<p class="text">需支付积分</p>
			<p class="cot number"><span>{{ IntegralNum }}</span></p>
		</div>
		<div class="division"></div>
		<div class="price">
			<p class="text">积分（可用{{Member.IntegralBalance}}）</p>
			<p class="cot" v-if="Member.IntegralBalance<IntegralNum"><span>{{ Member.IntegralBalance }}</span><span
					class="num">（积分不足）</span></p>
			<p class="cot" v-else><span>{{ IntegralNum }}</span></p>
		</div>
		<div class="pay" v-if="1-GoodsInfo.IntegralMaxRatio>0">
			<div class="text-box">
				<iconfont class="iconfont" icon="iconweixinzhifu" />
				<p class="text">微信支付</p>
			</div>
			<div class="cot">￥{{WxPayAmount}}</div>
		</div>
		<div class="btn-box">
			<div class="btn" v-if="!expire&&!Paying&&Member.IntegralBalance>=IntegralNum" @click="SubmitGoodsOrder">
				确认并支付</div>
			<div class="btn_disable" v-if="!expire&&!Paying&&Member.IntegralBalance<IntegralNum">确认并支付</div>
			<div class="btn_disable" v-if="!expire&&Paying">支付中...</div>
			<div class="btn_disable" v-if="expire">商品已经失效</div>
		</div>
	</div>
</template>

<script>
	import {
		GetGoodsInfo,
		SubGoodOrder
	} from '@/api/GoodsShop'
	import {
		CreatePayOrder
	} from '@/api/pay'
	import {
		mapActions,
		mapGetters
	} from 'vuex'
	import moment from "moment"
	export default {
		name: 'pay',
		data() {
			return {
				GoodsInfo: null, //商品详情
				isSwitch: false,
				IntegralExchange: 10, //1元人民币兑换多少积分 
				Paying: false, //支付中状态
				PayCount: 1,
				loadding: 0
			}
		},
		computed: {
			...mapGetters(['Member', 'MediaService', 'StoreCode', 'DeskID', 'BusinessConfig']),
			IntegralNum() {
				return (this.Member.IntegralBalance > this.GoodsInfo.MaxExchange ? this.GoodsInfo.MaxExchange : this.Member
					.IntegralBalance) * this.PayCount
			},
			WxPayAmount() {
				return this.GoodsInfo.Price * parseInt((1 - this.GoodsInfo.IntegralMaxRatio) * 100 * this.PayCount) / 100
			},
			PayIntegral() {
				return this.isSwitch ? (this.IntegralNum / this.IntegralExchange).toFixed(2) : 0
			},
			PayIntegralNumber() {
				return this.isSwitch ? this.IntegralNum : 0
			},
			expire() {
				return moment(this.GoodsInfo.EndTime) < moment()
			}
		},
		onLoad() {
			// 请求数据 
			this.$showLoading();
			this.NeedMember().then(res => {
				this.loadding = this.loadding + 1;
				this.NeedBusinessConfig().then(res2 => {
					this.loadding = this.loadding + 1;
					this.IntegralExchange = this.$store.getters.BusinessConfig.IntegralExchange ? this
						.$store.getters.BusinessConfig.IntegralExchange : 10;
				}).finally(() => {
					this.loadding = this.loadding - 1;
					var params = {}
					params.GoodsCode = this.$route.query.GoodsCode
					GetGoodsInfo(params).then(res => {
						if (res.state == 200) {
							res.data.PictureMove = JSON.parse(res.data.PictureMove)
							res.data.PictureMove.forEach(element => {
								element = this.MediaService + element
							});
							res.data.MaxExchange = res.data.Price * parseInt(res.data
								.IntegralMaxRatio * 100) / 100 * this.IntegralExchange
							this.isSwitch = this.Member.IntegralBalance > 0
							this.GoodsInfo = res.data
						} else {
							this.$showToast(res.state + '-' + res.msg)
						}
					}).finally(() => {
						this.loadding = this.loadding - 1;
					})
				});
			});
			console.log('this.loadding', this.loadding)
		},
		methods: {
			//购买数量加减事件
			PayCountReduce() {
				if (this.PayCount > 1) {
					this.PayCount--
				}
			},
			PayCountPlus() {
				this.PayCount++
			},
			...mapActions(["NeedMember", "NeedBusinessConfig"]),
			goback() {
				uni.navigateBack();
			},
			SubmitGoodsOrder() {
				this.Paying = true;
				SubGoodOrder({
					BusinessCode: this.Member.BusinessCode,
					MemberCode: this.Member.MemberCode,
					GoodsCode: this.GoodsInfo.GoodsCode,
					Number: this.PayCount,
					TotalPrice: this.GoodsInfo.Price,
					PayWechat: (parseInt(this.GoodsInfo.Price * this.PayCount * 100) / 100 - this.PayIntegral)
						.toFixed(2),
					PayIntegral: this.PayIntegral,
					PayIntegralNumber: this.PayIntegralNumber,
				}).then(res => {
					if (res.state == 200) {
						if (res.data.PayState == 1) {
							this.Member.IntegralBalance -= this.PayIntegralNumber;
							// Toast({
							// 	message: ,
							// 	position: 'middle',
							// 	duration: 2000,
							// 	action: this.$router.push({
							// 		name: "CardList",
							// 		query: {
							// 			CanotBack: true
							// 		}
							// 	})
							// });
							this.$showToast('兑换成功，请在"我的卡券"中查看!');
						} else if (res.data.PayState == 0) {
							this.GoPay('积分商城', res.data.GoodsOrderCode);
						}
					} else {
						this.Paying = false;
						this.$showToast('兑换失败：' + res.msg)
					}
				})
			},

			GoPay(SceneType, GoodsOrderCode) {
				var PayOrder = {
					BusinessCode: this.Member.BusinessCode,
					MemberCode: this.Member.MemberCode,
					SceneType: SceneType,
					Amount: this.WxPayAmount,
					GoodsOrderCode: GoodsOrderCode,
					PayCallBackOpenIDUrl: window.location.origin + '/check-pay'
				}
				console.log('PayOrder', PayOrder);
				CreatePayOrder(PayOrder).then(res => {
					if (res.state != 200) {
						console.warn('CreatePayOrder.error', res);
					} else {
						PayOrder.PayOrderCode = res.data.PayOrderCode; // 结帐单号
						PayOrder.PayState = 0;
						var GetOpenIDUrl = res.data.GetOpenIDUrl;
						console.log('PayOrderCode', PayOrder.PayOrderCode);
						console.log('GetOpenIDUrl', GetOpenIDUrl);



						// this.$router.push({name:'CheckPay',query:{Code:this.editingBill.BillID+"_"+PayOrder.PayOrderCode,openid:"123"}});//跳过支付

						window.location.href = GetOpenIDUrl;


						// https://open.51shoubei.com/openpay/jsapi/getauth2?redirect_uri=https%3A%2F%2Fwww.baidu.com%3Faa%3D123&inst_no=900001&mch_no=851902270018&sign=b4e64d988059c1cf6b824a03b4a18b80
						// https://open.51shoubei.com/openpay/jsapi/getauth2?inst_no=900120&mch_no=852002260003&redirect_uri=192.168.124.6:8080/check-pay?PayOrderCode=a4501e59e3804a23b57a3fe6f8ba5368&sign=93b9a3a09ea000771deffe8a44d42069
						// https://open.51shoubei.com/openpay/jsapi/getauth2?inst_no=900120&mch_no=852002260003&redirect_uri=192.168.124.6:8080/check-pay?PayOrderCode=a4501e59e3804a23b57a3fe6f8ba5368&sign=93b9a3a09ea000771deffe8a44d42069
						// this.$router.push({ name: 'CheckPay', query: { PayOrderCode:PayOrder.PayOrderCode },params:{PayOrder:PayOrder} });
					}
				}).catch(res => {
					console.warn('CreatePayOrder.catch', res);
				})
			},
			pay() {
				this.$router.push({
					name: "myself_payresult",
					params: {
						id: this.order.id
					}
				})
			}
		},
		watch: {
			loadding(newValue, oldValue) {
				if (newValue == 0) {
					this.$hideLoading();
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	$main: #ffbb05;
	$red: #ff423e;
	$border: #e6e6ea;
	$grey: #777;
	$glod:#b6986a;

	@mixin border-radius($size) {
		-webkit-border-radius: $size;
		-moz-border-radius: $size;
		border-radius: $size;
	}

	@mixin transition {
		-webkit-transition: all .3s;
		-moz-transition: all .3s;
		-ms-transition: all .3s;
		-o-transition: all .3s;
		transition: all .3s;
	}

	.container {
		background: #f2f2f6;
		min-height: 100vh;
	}

	/* id */
	.id {
		height: 45px;
		line-height: 45px;
		padding: 0 10px;
		background: #fff;

		.text {
			float: left;
			font-size: 14px;
		}

		.cot {
			float: right;
			font-size: 12px;
			color: $grey;
		}
	}

	/* id end */
	/* msg */
	.msg {
		padding: 0 10px;
		background: #fff;

		.msg-cot {
			padding: 15px 0;
			// border-bottom: 1px solid #e6e6ea;
		}

		.text {
			font-size: 14px;
			line-height: 1;
		}

		.order-msg {
			width: 100%;
			height: 105px;
			padding: 8px 0 0 8px;
			display: block;
			@include border-radius(5px);
			-webkit-box-shadow: 0 0 3px 0 rgba(0, 0, 0, .1);
			-moz-box-shadow: 0 0 3px 0 rgba(0, 0, 0, .1);
			box-shadow: 0 0 3px 0 rgba(0, 0, 0, .1);
			margin-top: 15px;
			position: relative;

			.img {
				width: 89px;
				height: 89px;
				@include border-radius(5px);
				overflow: hidden;
				position: relative;
				background-size: 110% auto;
				background-repeat: no-repeat;
				background-position: center;
				float: left;
				background-color: #8080804f;

				img {
					width: 100%;
					display: block;
				}
			}

			.text-box {
				margin-left: 100px;
				padding-right: 10px;

				// padding-top: 10px;
				.title {
					// white-space: nowrap;
					// overflow: hidden;
					// text-overflow: ellipsis;
					word-break: break-all;
					word-wrap: break-word;
					white-space: normal;
					font-size: 16px;
					font-weight: bold;
				}

				.num {
					font-size: 12px;
					line-height: 1;
					margin-top: 10px;
				}

				.spend {
					font-size: 12px;
					color: $grey;
					line-height: 1;
					margin-top: 10px;
					text-decoration: line-through;
				}
			}

			.select-box {
				width: 50px;
				height: 100%;
				text-align: center;
				background: $main;
				-webkit-border-radius: 0 5px 5px 0;
				-moz-border-radius: 0 5px 5px 0;
				border-radius: 0 5px 5px 0;
				position: absolute;
				right: 0;
				top: 0;

				.text {
					width: 50px;
					height: 100%;
					line-height: 50px;
					text-align: center;
					-webkit-writing-mode: vertical-rl;
					-ms-writing-mode: bt-rl;
					writing-mode: vertical-rl;
					font-size: 12px;
					color: #fff;
					letter-spacing: 1px;
				}
			}
		}
	}

	/* msg end */
	/* price */
	.price {
		height: 45px;
		padding: 0 10px;
		background: #fff;

		.text {
			line-height: 45px;
			float: left;
			font-size: 14px;
		}

		.cot {
			float: right;
			line-height: 45px;
			font-size: 14px;
		}

		.num {
			color: $red;
			font-size: 14px;
		}
	}

	/* price end */
	/* deduction-box*/
	.deduction-box {
		padding: 0 10px;
		background: #fff;

		.deduction {
			height: 45px;

			// border-top: 1px solid $border;
			.text {
				line-height: 45px;
				font-size: 14px;
				float: left;

				.num {
					color: $red;
					font-size: 14px;
				}
			}

			.cot {
				float: right;

				.mint-switch {
					height: 25px;
					margin-top: 10px;
				}
			}
		}
	}

	/* deduction-box end */
	/* pay */
	.pay {
		padding: 0 10px;
		height: 45px;
		background: #fff;
		border-top: 1px solid $border;

		.text-box {
			float: left;
			line-height: 45px;

			i {
				font-size: 20px;
				color: #09bb07;
				float: left;
			}

			.text {
				float: left;
				font-size: 14px;
				margin-left: 5px;
			}
		}

		.cot {
			line-height: 45px;
			float: right;
			font-size: 14px;
		}
	}

	/* pay end */
	.btn-box {
		height: 60px;
		padding: 10px;
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background: #f2f2f6;

		.btn {
			width: 100%;
			height: 40px;
			background: $main;
			line-height: 40px;
			text-align: center;
			@include border-radius(25px);
			font-size: 14px;
			display: block;
		}
	}

	.btn_disable {
		width: 100%;
		height: 40px;
		background: #9e9d9d;
		line-height: 40px;
		text-align: center;
		color: #fff;
		@include border-radius(25px);
		font-size: 14px;
		display: block;
	}

	.editnumberbox {
		max-width: 120px;
		float: right;
		margin-top: 8px
	}

	.editnumberbox .available {
		background: #ffbb05
	}

	.editnumberbox .disable {
		background: #C0C4CC
	}

	.editnumberbox .btn {
		display: inline-block;
		position: relative;
		width: 25px;
		border-radius: 50%;
	}

	.editnumberbox .btn i {
		margin-left: 5px;
		color: #fff;
		line-height: 25px;
	}

	.editnumberbox .number {
		display: inline-block;
		min-width: 30px;
		text-align: center;
		line-height: 26px;
		vertical-align: center;
	}
</style>
