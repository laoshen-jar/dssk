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
		<!-- Stopwatch:{{Stopwatch}} -->
	</div>
</template>

<script>
	import moment from 'moment'
	import {
		GetPayState
	} from "@/api/pay";
	import {
		clearStorage
	} from '../../utils/utils.js'
	export default {
		data() {
			return {
				PayOrder: null,

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
				getBrandWCPayRequest: null,

				StartTime: null
			};
		},
		computed: {
			Stopwatch() {
				if (!this.StartTime) {
					this.StartTime = new Date()
				}
				var Now = new Date();
				return (Now.getTime() - this.StartTime.getTime()) / 1000;
			}
		},

		onLoad() {
			this.PayOrder = this.$getStorage('PayOrder');
			const that = this;
			console.log('PayOrder', this.PayOrder)
			// if(this.PayOrder){uni.navigateBack();return;}
			uni.requestPayment({
				"provider": "wxpay",
				"orderInfo": that.PayOrder,
				...that.PayOrder,
				success(e) {
					console.log('success', e);
					that.$showLoading('支付中...');
					that.OnCheckPayState(that); // 开始侦听支付结果
				},
				fail(e) {
					console.log('fail', e);
					// 提示1：已取消支付，
					// 提示2：接口异常详情
					uni.navigateBack();
				}
			})
		},

		onHide() {
			// 销毁前停止侦听
			console.log("销毁前停止侦听");
			this.StopGetState = true;
		},
		methods: {
			// 感知支付状态
			OnCheckPayState(that) {
				console.log('OnCheckPayState')
				// return;
				if (that.Stopwatch > 120 || that.StopGetState) {
					that.$showToast('支付状态侦听超时，请不要重复支付！');
					that.$hideloading();
					uni.redirectTo({
						url: 'pages/orderInfo/index'
					})
					return;
				}
				GetPayState({
						PayOrderCode: that.PayOrder.PayOrderCode
					})
					.then(res => {
						uni.hideLoading();
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
								console.log('this.PayStr', this.PayStr)
								this.OnCheckPayState();
							}
						} else {
							uni.navigateBack();
							console.error("感知支付状态异常", res);
						}
					})
					.catch(res => {
						console.warn("GetPayOrder.catch", res);
						uni.hideLoading();
						uni.navigateBack();
					})
			},
			// 支付成功后继续执行
			PayOkContinue() {
				this.$store.dispatch("RefreshMember");
				if (this.PayOrder.PayType == "TSRechargeAndCheck") {
					this.MsgStr = "跳转到评价页";
					uni.reLaunch({
						url: `/pages/comment/index?BillID=${this.PayOrder.BillID}`
					})
				} else if (this.PayOrder.PayType == "TSCheck") { //TSCheck
					this.MsgStr = "跳转到评价页";
					uni.reLaunch({
						url: `/pages/comment/index?BillID=${this.PayOrder.BillID}`
					})
				} else if (this.PayOrder.PayType == "StoredRecharge") {
					this.MsgStr = "跳转到储值记录";
					uni.navigateTo({
						url: `/pages/billDetail/index?BillID=${this.PayOrder.BillID}`
					})
				} else if (this.PayOrder.PayType == "GoodsOrder") { //TSCheck
					this.MsgStr = "跳转到卡券列表";
					uni.navigateTo({
						url: `/pages/billDetail/index?BillID=${this.PayOrder.BillID}`
					})
				}
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
