<template>
	<div>
		<!-- <input value="成功" type="button" class="PayOk" @click="PayCallBack(1,'')"/>
    <input value="失败" type="button" class="PayError"  @click="PayCallBack(-1,'超时未支付')"/> -->
		<!-- <br/>
    <h1>MsgStr:{{MsgStr}}</h1>
    <br/>
    <h1>PayStr:{{PayStr}}</h1>
    <br/>
    <h1>getBrandWCPayRequest:{{getBrandWCPayRequest}}</h1>
    <br/>
    PayOrderCode：{{PayOrderCode}}
    <br/>
    OpenIDOnServer：{{OpenIDOnServer}}
    <br/>
    WxPayObj{{WxPayObj}}
    <br/>-->
		<!-- {{testObj}}
    <br/> 
    PayStr1:{{PayStr1}}
    <br/> 
    PayStr2:{{PayStr2}}
    <br/> 
    PayStr3:{{PayStr3}}
    <br/> 
    PayStr4:{{PayStr4}} -->
	</div>
</template>

<script>
	import moment from 'moment'
	import {
		GetPayOrder,
		UpdatePayOrderState,
		PayPut
	} from "@/api/pay";
	export default {
		data() {
			return {
				PayOrder: null,
				PayType: '',
				BillID: null,
				PayOrderCode: null,
				GoodsOrderCode: null,
				OpenIDOnServer: null,

				Loading: true,
				PaySuccess: false, // 支付成功
				PayError: false, // 支付失败
				Payed: false, // 已支付过的

				StopGetState: false, //停止侦听支付状态

				PayStr: "",
				PayStr1: "",
				PayStr2: "",
				PayStr3: "",
				PayStr4: "",

				testObj: null,
				WxPayObj: null,

				time: 0,
				ispay: 0,
				MsgStr: "",
				getBrandWCPayRequest: null
			};
		},

		onLoad() {
			const eventChannel = this.getOpenerEventChannel();
			eventChannel.on('payOrder', data => {
				console.log(data)
				uni.requestPayment({
					"provider": "wxpay",
					"orderInfo": data,
					success(res) {
						this.$showLoading('支付中...');
						this.GetPayState(); // 开始侦听支付结果
					},
					fail(e) {
						console.log(e);
						uni.navigateBack();
					}
				})
			})
		},

		onHide() {
			// 销毁前停止侦听
			console.log("销毁前停止侦听");
			this.StopGetState = true;
		},
		methods: {
			PayCallBack(state, errorMsg) {
				// 调用接口确认支付状态
				var params = {
					PayOrderCode: this.PayOrderCode,
					PayState: state,
					ErrorMsg: errorMsg
				};
				UpdatePayOrderState(params)
					.then(res => {
						if (res.state == 200) {
							console.log("支付状态修改成功", res);
						} else {
							console.error("支付状态修改异常", res);
						}
					})
					.catch(res => {
						console.warn("UpdatePayOrderState.catch", res);
					});
			},
			// 感知支付状态
			GetPayState() {
				GetPayOrder({
						PayOrderCode: this.PayOrderCode
					})
					.then(res => {
						this.$hideLoaidng();
						if (res.state == 200) {
							const {
								PayState,
								ErrorMsg
							} = res.data;
							if (PayState == 1) {
								this.PaySuccess = true;
								console.log("已感知到-支付成功", res);
								this.PayStr = "已感知到-支付成功" + new Date();
								this.StopGetState = true;
								this.$showToast('支付成功');
								this.PayOkContinue();
							} else if (PayState == -1) {
								this.PayError = true;
								console.warn("已感知到-支付失败", res);
								this.PayStr = "已感知到-支付失败" + new Date();
								this.StopGetState = true;
								// this.$router.go(-1);
								this.$showToast('支付失败01！😀');
								uni.navigateBack();
								return;
							} else {
								this.PayStr = "支付结果未变化" + new Date();
								this.GetPayState();
							}
						} else {
							uni.navigateBack();
							console.error("感知支付状态异常", res);
						}
					})
					.catch(res => {
						this.$hideLoaidng();
						uni.navigateBack();
						console.warn("GetPayOrder.catch", res);
					});
			},
			// 支付成功后继续执行
			PayOkContinue() {
				this.$store.commit("RefreshMember");
				this.$showToast('支付成功');
				uni.redirectTo({
					url: '/pages/index/index'
				})
				// if (this.PayType == "TSRechargeAndCheck") {
				// 	this.MsgStr = "跳转到评价页";
				// 	this.$router.push({
				// 		name: "comment",
				// 		query: {
				// 			BillID: this.BillID
				// 		}
				// 	});
				// } else if (this.PayType == "TSCheck") { //TSCheck
				// 	this.MsgStr = "跳转到评价页";
				// 	this.$router.push({
				// 		name: "comment",
				// 		query: {
				// 			BillID: this.BillID
				// 		}
				// 	});
				// } else if (this.PayType == "StoredRecharge") {
				// 	this.MsgStr = "跳转到储值记录";
				// 	this.$router.push({
				// 		name: "StoredDetail"
				// 	});
				// } else if (this.PayType == "GoodsOrder") { //TSCheck
				// 	this.MsgStr = "跳转到卡券列表";
				// 	this.$router.push({
				// 		name: "CardList",
				// 		query: {
				// 			CanotBack: true
				// 		}
				// 	})
				// }
			},
		},
	};
</script>
<style scoped>
	input[type="button"] {
		width: 200px;
		height: 50px;
		margin: 20px auto;
	}
</style>
