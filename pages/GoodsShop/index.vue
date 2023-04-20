<template>
	<div class="container">
		<!-- can-use -->
		<div class="can-use">
			<p class="text">可用积分：{{ Member.IntegralBalance }}</p>
			<navigator url="/pages/IntegralDetail/index" class="link">
				<p class="text">积分详情</p>
				<iconfont class="iconfont" icon="iconjiantou-b-copy-l" />
			</navigator>
		</div>
		<!-- can-use end -->
		<div class="division"></div>
		<!-- shop-list -->
		<div class="shop-list-box" ref="wrapper"
			style="position: absolute;left: 0;top: 50px;right: 0;bottom: 0;overflow-y: scroll;">
			<load-refresh :currentPage="GoodsList.length" :totalPages="count" @refresh="LoadNextPage" ref="loadRefresh">
				<div class="shop-list" slot="content-list">
					<ul class="list clearfix">
						<li v-for="(item, index) in GoodsList" :key="index">
							<navigator class="item" :url="'/pages/goodsInfo/index?GoodsCode=' + item.GoodsCode">
								<div class="img" :style="'background-image: url(' + item.Picture + ');'">
									<!-- <img :src="item.Picture" :alt="item.GoodsName" /> -->
									<div class="Stock">
										库存：{{(item.EffectiveStock > item.Stock? item.Stock: item.EffectiveStock)>500?'充足':(item.EffectiveStock > item.Stock? item.Stock: item.EffectiveStock)}}
									</div>
								</div>
								<div class="text-box">
									<h6 class="title">{{ item.GoodsName }}</h6>
									<p style="text-align:-webkit-center">
										<!-- <span class="Price" v-if="1-item.IntegralMaxRatio>0">￥{{ parseInt(item.Price *(1-item.IntegralMaxRatio)*100)/100}}</span><span class="Price" v-if="item.IntegralMaxRatio<1&&item.IntegralMaxRatio>0"> + </span><span class="Price" v-if="item.IntegralMaxRatio>0">{{ parseInt(item.Price *item.IntegralMaxRatio* IntegralExchange*100)/100 }}积分</span> -->

										<span class="Price"
											v-if="1-item.IntegralMaxRatio>0">￥{{ item.Price *parseInt((1-item.IntegralMaxRatio)*100)/100}}</span><span
											class="Price" v-if="item.IntegralMaxRatio<1&&item.IntegralMaxRatio>0"> +
										</span><span class="Price"
											v-if="item.IntegralMaxRatio>0">{{ item.Price *parseInt(item.IntegralMaxRatio* IntegralExchange*100)/100 }}积分</span>
										<!-- <span :class="'Amount'">￥{{ item.Price }}</span> -->
									</p>
								</div>
							</navigator>
						</li>
					</ul>
					<p v-if="allLoaded == false" style="font-size:12px;color:#777777;text-align:center"
						@click="LoadNextPage">
						点击加载更多
					</p>
					<NoDate v-if="GoodsList && GoodsList.length == 0" showtext="暂无可兑换商品" />
				</div>
			</load-refresh>
		</div>
		<!-- shop-list end -->
		<!-- excharge-racord -->
		<div class="excharge-racord">
			<navigator :url="{
          name: 'ExchargeRecord',
          query: {
            BusinessCode: this.Member.BusinessCode,
            MemberCode: this.Member.MemberCode
          }
        }">
				<p class="text">兑换<br />记录</p>
			</navigator>
		</div>
		<!-- excharge-racord end -->
	</div>
</template>

<script>
	import {
		mapActions,
		mapGetters
	} from "vuex";
	import {
		GetGoodsList
	} from "@/api/GoodsShop";
	import {
		GetMember
	} from "@/api/member";
	import NoDate from "@/components/NoDate.vue"
	import loadRefresh from '@/components/load-refresh/load-refresh.vue';

	export default {
		name: "shop",
		components: {
			NoDate,
			loadRefresh
		},
		data() {
			return {
				isAutoFill: false, // 自动上拉加载一次
				count: null,
				pageNo: 1,
				GoodsList: [], //加载商品列表
				IntegralExchange: 10, //1元人民币兑换多少积分
				loadding: 0
			};
		},
		computed: {
			...mapGetters(["Member", "MemberCode", "StoreCode", "DeskID", "BusinessConfig"]),
			// 全部加载完成
			allLoaded() {
				return this.GoodsList.length == this.count;
			},
		},
		onLoad() {
			console.log('this.Member', this.Member)
			this.loadding = this.loadding + 1;
			this.NeedMember().then(res => {
					this.loadding = this.loadding + 1;
					this.NeedBusinessConfig().then(res2 => {
							console.log('this.NeedBusinessConfig().finally(res2', res2, this.$store.getters
								.BusinessConfig);
							this.IntegralExchange = this.$store.getters.BusinessConfig.IntegralExchange;
						})
						.finally(res => {
							this.loadding = this.loadding - 1;
						});
					// 请求数据
					this.LoadData();
				})
				.finally(res => {
					this.loadding = this.loadding - 1;
				});
		},
		methods: {
			...mapActions(["NeedMember", "NeedBusinessConfig"]),
			// 下一页
			LoadNextPage() {
				if (this.GoodsList.length < this.count) {
					this.pageNo = this.pageNo + 1;
				}
				this.LoadData()
			},
			LoadData() {
				var parameter = {};
				parameter.BusinessCode = this.Member.BusinessCode;
				parameter.OnlyNotExpired = 1;
				parameter.OnlyOnShelves = 1;
				parameter.pageNo = this.pageNo;
				parameter.pageSize = 6;
				parameter.MemberCode = this.Member.MemberCode;
				this.loadding = this.loadding + 1;
				GetGoodsList(parameter).then(res => {
						if (res.state == 200) {
							this.count = res.count;
							res.data.forEach(item => {
								this.GoodsList.push(item);
							});
						} else {
							this.$showToast(res.state + "-" + res.msg);
						}

					})
					.catch(err => console.log(err))
					.finally(res => {
						this.loadding = this.loadding - 1;
						this.$refs.loadRefresh && this.$refs.loadRefresh.completed();
					});
			}
		}
	};
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
		height: 100vh;
		padding-bottom: 165px;
		background: #f2f2f6;
		overflow: hidden;
	}

	/* can-use */
	.can-use {
		height: 45px;
		padding: 0 10px;
		background: #fff;
		font-size: 14px;

		>.text {
			float: left;
			line-height: 45px;
		}

		.link {
			float: right;
			line-height: 45px;

			.text {
				float: left;
				margin-right: 2px;
				color: $grey;
			}

			i {
				font-size: 12px;
				color: $grey;
			}
		}
	}

	/* can-use end */
	/* shop-list */
	.shop-list-box {
		overflow: scroll;
		background: #fff;

		.shop-list {
			padding: 15px;
			padding-bottom: 10px;
		}

		ul {
			margin: -5px -7px;
		}

		li {
			width: 50%;
			padding: 5px 7px;
			float: left;

			.item {
				width: 100%;

				.img {
					height: 44vw;
					@include border-radius(5px);
					overflow: hidden;
					position: relative;
					background-size: 110% auto;
					background-repeat: no-repeat;
					background-position: center;

					img {
						width: 100%;
						display: block;
					}
				}

				.title {
					font-size: 14px;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					margin-top: 10px;
					text-align: center;
				}

				.Amount {
					color: $grey;
					font-size: 12px;
					margin-top: 5px;
					text-decoration: line-through;
					text-align: -webkit-center;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}

				.Price {
					color: $red;
					font-size: 12px;
					margin-top: 5px;
					text-align: -webkit-center;
					white-space: nowrap;
					font-weight: 900;
					overflow: hidden;
					text-overflow: ellipsis;
				}

				.Stock {
					position: absolute;
					background: #00000093;
					color: white;
					float: right;
					bottom: 5px;
					right: 5px;
					padding: 0 5px;
					border-radius: 4px;
					font-size: 12px;
					line-height: 20px;
				}
			}
		}
	}

	/* shop-list end */
	/* excharge-racord */
	.excharge-racord {
		position: fixed;
		bottom: 200px;
		right: 10px;
		z-index: 99;

		a {
			width: 45px;
			height: 45px;
			border: 2px solid #888;
			display: block;
			background: #fff;
			padding-top: 5px;
			text-align: center;
			@include border-radius(50%);

			.text {
				font-size: 10px;
				color: $main;
			}
		}
	}

	/* excharge-racord end */
	/* activicity */

	.activicity {
		position: absolute;
		bottom: 0px;
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
					content: "";
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
