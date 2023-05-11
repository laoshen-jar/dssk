<template>
	<div class="container">
		<!-- exchargerecord-list -->
		<div class="exchargerecord-list-box" ref="wrapper">
			<load-refresh :currentPage="recordList.length" :totalPages="count" @refresh="loadBottom"ref="loadRefresh">
				<div slot="content-list">
					<div class="exchargerecord-list">
						<ul class="list">
							<li v-for="(item,index) in recordList" :key="index">
								<div class="item">
									<div class="msg">
										<div class="img">
											<img :src="item.Picture" :alt="item.GoodsName" />
										</div>
										<div class="text-box">
											<h6 class="title">{{item.GoodsName}}</h6>
											<p class="time">订单编号：{{item.OrderSN}}</p>
											<p class="time">交易时间：{{moment(item.PayOKTime).format('YYYY-MM-DD HH:mm:ss')}}
											</p>
										</div>
										<div class="state">兑换成功</div>
									</div>
									<p class="spend">{{item.PayIntegralNumber}}积分</p>
								</div>
							</li>
						</ul>
					</div>
					<p v-if="allLoaded==false" style="font-size:12px;color:#777777;text-align:center" @click="loadBottom">
						点击加载更多</p>
					<NoDate v-if="recordList&&recordList.length==0" showtext="暂无兑换记录" />
				</div>
			</load-refresh>
		</div>
		<uni-transition mode-class="fade" :show="true">
			<!-- activicity -->
			<div class="activicity">
				<div class="title-box">
					<div class="title-cot">
						<h5 class="title">活动</h5>
					</div>
				</div>
				<div class="img">
					<img :src="staticUrl+'/images/activicity.jpg'" alt="" />
				</div>
				<!-- <div class="support">本服务由武汉邦越提供技术支持</div> -->
			</div>
			<!-- activicity end -->
		</uni-transition>
		<!-- shop-list end -->
	</div>
</template>

<script>
	import {
		mapActions,
		mapGetters
	} from 'vuex'
	import {commonMixin} from '../../mixins/index.js'
	import {
		GoodsOrderList
	} from '@/api/GoodsShop'
	import NoDate from "@/components/NoDate.vue"
	import loadRefresh from '@/components/load-refresh/load-refresh.vue';
	import moment from "moment"
	export default {
		name: 'exchargerecord',
		components: {
			NoDate,
			loadRefresh
		},
		mixins: [commonMixin],
		data() {
			return {
				moment,
				recordList: {}, // 兑换记录
				allLoaded: true, // 是否全部加载
				isAutoFill: false, // 自动上拉加载一次
				wrapperHeight: 0, // 滚动区域高度
				pageNo: 1,
				count: null,
			}
		},
		computed: {
			...mapGetters(['MemberCode', 'MediaService', 'StoreCode', 'Member', 'DeskID', 'BusinessConfig'])
		},
		onLoad() {
			// 请求数据
			var parmas = {};
			console.log('this.Member', this.Member)
			parmas.BusinessCode = this.Member.BusinessCode;
			parmas.MemberCode = this.$route.query.MemberCode;
			parmas.PayState = 1;
			parmas.sortOrder = 'descend';
			parmas.pageIndex = this.pageNo;
			parmas.PageSize = 5;
			GoodsOrderList(parmas).then(res => {
				console.log('兑换记录列表', res)
				if (res.state == 200) {
					this.recordList = res.data
					if (res.count > 5) {
						this.allLoaded = false
					} else {
						this.allLoaded = true
					}
					this.count = res.count
				} else {
					this.$showToast(res.state + '-' + res.msg)
				}
			});
		},
		methods: {
			// 触底加载
			loadBottom() {
				if (this.recordList.length < this.count) {
					var parameter = {};
					parameter.BusinessCode = this.Member.BusinessCode;
					parameter.MemberCode = this.$route.query.MemberCode;
					parameter.PayState = 1;
					parameter.sortOrder = 'descend';
					this.pageNo = this.pageNo + 1;
					parameter.pageNo = this.pageNo;
					parameter.pageSize = 5;
					GoodsOrderList(parameter).then(res => {
							console.log("加载更多", res.data)
							res.data.forEach(item => {
								this.recordList.push(item);
							});
							if (this.recordList.length == this.count) {
								this.allLoaded = true; // 数据已全部获取完毕
							}
							console.log("res", res)
							console.log("parameter", parameter)
							console.log("recordList", this.recordList)
							this.$refs.loadRefresh.complete(); // 重置下拉加载
						})
						.catch(err => console.log(err));
				}
			},
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
		position: relative;
		background: #f2f2f6;
		min-height: 100vh;
		padding-bottom: 165px;
	}

	/* exchargerecord-list */
	.exchargerecord-list-box {
		padding: 0 10px 10px;
		overflow: scroll;

		.exchargerecord-list {
			padding-bottom: 10px;
		}

		// ul {

		// }
		li {
			margin-top: 10px;

			.item {
				background: #fff;
				@include border-radius(5px);
				padding: 0 10px;
				display: block;

				.msg {
					height: 100px;
					padding: 10px 0;
					position: relative;
					border-bottom: 1px solid $border;
				}

				.img {
					width: 80px;
					height: 80px;
					@include border-radius(5px);
					overflow: hidden;
					float: left;

					img {
						width: 100%;
						display: block;
					}
				}

				.text-box {
					margin-left: 90px;
					padding-right: 60px;
					padding-top: 5px;

					.title {
						font-size: 14px;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}

					.time {
						color: $grey;
						font-size: 12px;
						margin-top: 5px;
						white-space: nowrap;
						// overflow: hidden;
						text-overflow: ellipsis;
					}
				}

				.state {
					position: absolute;
					right: 0;
					top: 15px;
					color: #09bb07;
					line-height: 1;
					font-size: 12px;
				}

				.spend {
					height: 25px;
					line-height: 25px;
					color: $red;
					text-align: right;
					font-size: 12px;
				}
			}
		}
	}

	/* exchargerecord-list end */
	/* activicity */

	.activicity {
		position: absolute;
		bottom: 0px;
		left: 0px;
		height: 165px;
		padding: 15px 10px 0 15px;
		background: #f2f2f6;
		@include transition;

		.title-box {
			text-align: center;

			.title-cot {
				line-height: 1;
				display: inline-block;
				position: relative;
				padding: 0 40px;
				z-index: 2;

				&:after {
					content: '';
					width: 100%;
					height: 1px;
					background: #d0d0d0;
					position: absolute;
					top: 6px;
					left: 0;
					z-index: -1;
				}
			}

			.title {
				font-size: 14px;
				padding: 0 15px;
				line-height: 1;
				background: #f2f2f6;
			}
		}

		.img {
			overflow: hidden;
			margin-top: 15px;
			@include border-radius(5px);

			img {
				width: 100%;
				display: block;
			}
		}

		.support {
			height: 25px;
			line-height: 25px;
			text-align: center;
			font-size: 10px;
			text-align: center;
			color: $grey;
		}
	}

	/* activicity end */
	/*fade*/
	.fade-enter,
	.fade-leave-to {
		opacity: 0;
	}

	/*fade*/
</style>
