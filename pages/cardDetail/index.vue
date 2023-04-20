<template>
	<div class="container">
		<!-- coupon -->
		<!-- <div class="coupon" v-if="cardState=='可用'&&cardInfo.IsWriteOff==0" @click="showCodePopup">
        <p class="text">使用时请向服务员出示此条码</p>
        <div class="img">
            <img :src="'http://open.yubustep.cn/GetBarImg?BarCode='+cardInfo.CardNumber" alt="卡券" />
        </div>
    </div>
    <div class="division"></div> -->
		<!-- coupon end -->
		<!-- store -->
		<div class="info">
			<span class="name" style="font-weight: 600">卡券编号：</span>
			<span class="name" style="color:grey">{{cardInfo.CardNumber}}</span>
		</div>
		<div class="division"></div>
		<div class="info">
			<span class="name" style="font-weight: 600">卡券名称：</span>
			<span class="name" style="color:grey">{{cardInfo.CardName}}</span>
		</div>
		<div class="division"></div>
		<div class="info">
			<span class="name" style="font-weight: 600">卡券类型：</span>
			<span class="name" style="color:grey">{{cardInfo.CardType}}</span>
		</div>
		<div class="division"></div>
		<!-- int -->
		<div class="int" v-if="cardInfo.IsWriteOff==0">
			<span class="text" style="font-weight: 600">使用条件：</span>
			<span class="text" style="color:grey">消费满{{cardInfo.SatisfyAmount}}元可用</span>
		</div>
		<div class="division" v-if="cardInfo.IsWriteOff==0"></div>
		<!-- int -->
		<div class="int" v-if="cardInfo.IsWriteOff==0">
			<span class="text" style="font-weight: 600">生效时间：</span>
			<span class="text" style="color:grey">{{cardInfo.StartDate|DateFilter}}<span class="day"
					v-if="cardState=='未开始'">未开始</span></span>
		</div>
		<div class="division" v-if="cardInfo.IsWriteOff==0"></div>
		<!-- int -->
		<div class="int" v-if="cardInfo.IsWriteOff==0">
			<span class="text" style="font-weight: 600">失效时间：</span>
			<span class="text" style="color:grey">{{cardInfo.EndDate|DateFilter}}<span class="day"
					v-if="cardState=='过期'">已过期</span></span>
		</div>
		<div class="int" v-if="cardInfo.IsWriteOff==1">
			<span class="text" style="font-weight: 600">核销时间：</span>
			<span class="text" style="color:grey">{{cardInfo.WriteOffTime|DateFilter)}}</span>
		</div>
		<div class="division"></div>
		<!-- int -->
		<div class="int">
			<h5 class="text" style="font-weight: 600">使用说明：</h5>
			<p class="text" style="color:grey;white-space: pre-wrap;">{{cardInfo.Content}}<br />活动最终解释权归商家所有</p>
		</div>
		<!-- int end -->
		<div class="division"></div>
		<!-- store -->
		<div class="store" v-if="cardInfo.ApplyStores&&cardInfo.ApplyStores.length>0">
			<h5 class="title" style="font-weight: 600">适用门店：</h5>
			<ul class="store-list clearfix" style="color:grey">
				<li v-for="(item,index) in cardInfo.ApplyStores" :key="index" v-show="item.ApplyDishTypeItems.length>0">
					{{item.StoreName}}</li>
			</ul>
		</div>


		<div class="division fixed" v-if="cardState=='可用'&&cardInfo.IsWriteOff==0"></div>
		<!-- <div class="eating fixed" v-if="cardState=='可用'&&cardInfo.IsWriteOff==0" @click="showCodePopup">用券买单</div> -->
		<!-- store end -->
		<!-- btn-box -->
		<!-- <div class="btn-box">

<div class="btn" @click="receive" >领取到卡包</div>

    </div>-->
		<!-- btn-box end -->

		<!-- bar-code -->
		<uni-transition mode-class="fade" :show="barcodeshow">
			<div class="bar-code" v-show="barcodeshow">
				<div class="bar-code-cot">
					<h6 class="title">使用时请向服务员出示此条码</h6>
					<div class="bar">
						<img :src="'http://open.yubustep.cn/GetBarImg?BarCode='+cardInfo.CardNumber" alt="卡券" />
					</div>
				</div>
				<div class="bg" @click="hideCodePopup"></div>
			</div>
		</uni-transition>
		<!-- bar-code end -->
	</div>
</template>

<script>
	import {
		GetCardInfo,
		GetAvailablestores
	} from "@/api/card"
	import moment from 'moment'
	export default {
		name: 'order',
		data() {
			return {
				coupon: {}, // 卡券详情
				cardInfo: {}, //卡券详情
				cardState: '', //卡券状态：可用/过期/未开始
				barcodeshow: false, // 是否显示条形码弹窗
			}
		},
		filters: {
			DateFilter: function(value) {
				return moment(value).format('YYYY-MM-DD HH:mm:ss');
			},
		},
		onLoad(option) {
			this.$showLoading();
			var parameter = {}
			parameter.MemberCardCode = option.MemberCardCode
			parameter.CardCode = option.CardCode
			GetCardInfo(parameter).then(res => {
				console.log('res', res)
				if (res.state == 200) {
					this.cardInfo = res.MemberCard
					this.now = moment()
					this.endTime = moment(res.MemberCard.EndDate, 'YYYY-MM-DD 23:59:59')
					this.startTime = moment(res.MemberCard.StartDate, 'YYYY-MM-DD HH:mm:ss')

					if (moment(moment().format('YYYY-MM-DD HH:mm:ss')) > moment(res.MemberCard.EndDate)) {
						this.cardState = '过期'
					} else if (moment() < moment(res.MemberCard.StartDate, 'YYYY-MM-DD HH:mm:ss')) {
						this.cardState = '未开始'
					} else {
						this.cardState = '可用'
					}
					console.log('cardState', this.cardState)

				} else {
					this.$showToast('卡券数据加载失败！')
				}
			}).finally(() => {
				uni.hideLoading()
			})
		},
		methods: {
			// 弹出条形码
			showCodePopup() {
				this.barcodeshow = true;
			},
			// 关闭条形码
			hideCodePopup() {
				this.barcodeshow = false;
			},
		}
	}
</script>

<style lang="scss" scoped>
	$main: #ffbb05;
	$red: #ff423e;
	$border: #e6e6ea;
	$grey: #777;
	$glod: #b6986a;

	@mixin border-radius($size) {
		-webkit-border-radius: $size;
		-moz-border-radius: $size;
		border-radius: $size;
	}

	@mixin transition {
		-webkit-transition: all 0.3s;
		-moz-transition: all 0.3s;
		-ms-transition: all 0.3s;
		-o-transition: all 0.3s;
		transition: all 0.3s;
	}

	.container {
		background: #f2f2f6;
		min-height: 100vh;
		padding-bottom: 70px;
	}

	/* coupon */
	.coupon {
		background: #fff;
		padding: 15px 10px;

		.text {
			text-align: center;
			line-height: 1;
			font-size: 14px;
		}

		.img {
			width: 240px;
			margin: 15px auto;

			img {
				width: 100%;
				display: block;
			}
		}

		.id {
			text-align: center;
			font-size: 12px;
			line-height: 1;
		}
	}

	/* coupon end */
	/* int*/
	.int {
		padding: 15px 10px;
		background: #fff;

		.text {
			font-size: 14px;
			line-height: 1.5;
			margin-bottom: 10px;

			&:last-child {
				margin-bottom: 0;
			}

			.day {
				color: $red;
				display: inline-block;
				margin-left: 5px;
			}
		}
	}

	/* int end */
	/* store */
	.store {
		padding: 15px 10px;
		background: #fff;

		.title {
			font-size: 14px;
			line-height: 1.5;
		}

		.store-list {
			li {
				float: left;
				margin-right: 25px;
				margin-top: 10px;
				font-size: 12px;
				line-height: 1.5;
			}
		}
	}

	/* title */
	.info {
		padding: 15px 10px;
		background: #fff;

		.name {
			font-size: 14px;
			line-height: 1.5;
		}
	}

	/* store end */
	/* bar-code */
	.bar-code {
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 99;
		@include transition;

		.bar-code-cot {
			width: 300px;
			padding: 15px 30px;
			position: absolute;
			top: 50%;
			left: 50%;
			background: #fff;
			@include border-radius(10px);
			margin-left: -150px;
			margin-top: -80px;
			z-index: 1;

			.title {
				font-size: 14px;
				text-align: center;
				line-height: 1;
			}

			.bar {
				width: 100%;
				margin: 15px 0;

				img {
					display: block;
				}
			}

			.text {
				text-align: center;
				line-height: 1;
				font-size: 12px;
			}
		}

		.bg {
			position: absolute;
			top: 0;
			bottom: 0;
			left: 0;
			right: 0;
			background: rgba(0, 0, 0, 0.5);
		}
	}

	/* bar-code end */
	.btn-box {
		height: 70px;
		padding: 10px;
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background: #f2f2f6;

		.btn {
			width: 100%;
			height: 50px;
			background: $main;
			line-height: 50px;
			text-align: center;
			@include border-radius(25px);
			font-size: 14px;
			display: block;
		}
	}

	.eating {
		width: 100%;
		height: 40px;
		background: #ff423e;
		line-height: 40px;
		text-align: center;
		// @include border-radius(13px);
		color: #fff;
		font-size: 16px;
		box-shadow: 0px 0px 9.9px 0.1px rgba(255, 66, 62, 0.5);
		display: block;
		position: absolute;
		bottom: 0px;
		right: 0px;
	}

	.fixed {
		position: fixed
	}
</style>
