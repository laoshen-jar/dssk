<template>
	<div class="container">
		<!-- diningrecord -->
		<div class="diningrecord" ref="wrapper">
			<load-refresh :showLoadText="false" :currentPage="billList.length" :totalPages="count" @refresh="loadBottom" custom-style="background: #f2f2f6" ref="loadRefresh">
				<!-- 上拉加载事件:bottom-method="loadBottom" -->
				<div slot="content-list">
					<ul class="list">
						<li v-for="(item,index) in billList" :key="index">
							<div class="item" @click="jump(item)">
								<div class="text-box">
									<p class="title">
										{{item.StoreName}}
										<span class="table">(台位：{{item.DeskName}})</span>
									</p>
									<p class="time" v-if="item.BillState==2">
										结账时间：{{dateFormart(item.BillCashierTime,'YYYY-MM-DD HH:mm:ss')}}</p>
									<p class="time" v-else>结账时间：未结账</p>
									<p class="price">消费金额：{{item.Amount}}元</p>
								</div>
								<div class="arrow">
									<iconfont class="iconfont" icon="iconjiantou-b-copy-l" />
								</div>
								<div class="state commented" v-if="moment()>moment(item.BillCashierTime).add(2,'days')">完成
								</div>
								<div class="state eating" v-else-if="item.BillState == 1">就餐中</div>
								<div class="state commented" v-else-if="item.CommentState == 1">已评价</div>
								<div class="state gocomment" v-else-if="item.BillState == 2 && item.CommentState == 0">去评价
								</div>
							</div>
							<!-- <router-link class="state gocomment" v-if="item.BillState == 2 && item.CommentState == 0">去评价</router-link> -->
						</li>
					</ul>
					<p v-if="allLoaded==false" style="font-size:12px;color:#777777;text-align:center" @click="loadBottom">
						点击加载更多</p>
				</div>
			</load-refresh>
			<!-- activicity -->
			<uni-transition mode-class="fade" :show="true">
				<div class="activicity">
					<div class="title-box">
						<div class="title-cot">
							<h5 class="title">活动</h5>
						</div>
					</div>
					<div class="img">
						<image :src="staticUrl + '/images/activicity.jpg'" alt />
					</div>
					<div class="division"></div>
					<!-- <div class="support">本服务由武汉邦越提供技术支持</div> -->
				</div>
			</uni-transition>
			<!-- activicity end -->
		</div>
		<!-- diningrecord end -->
		<!-- diningrecord-popup -->
		<uni-transition mode-class="fade" :show="showpopup">
			<div class="diningrecord-popup" v-show="showpopup">
				<div class="diningrecord-popup-cot">
					<form action method class="comment-form" id="comment-form" @submit.prevent="submit">
						<div class="star-box">
							<div class="star-item" v-for="(item,index) in starlist" :key="index">
								<p class="text">{{item.text}}</p>
								<iconfont class="iconfont" icon="iconwujiaoxingquanxing"
									:class="{'active':item.star > 0}" data-index="0" @click="rating(index,0)" />
								<iconfont class="iconfont" icon="iconwujiaoxingquanxing"
									:class="{'active':item.star > 1}" data-index="1" @click="rating(index,1)" />
								<iconfont class="iconfont" icon="iconwujiaoxingquanxing"
									:class="{'active':item.star > 2}" data-index="2" @click="rating(index,2)" />
								<iconfont class="iconfont" icon="iconwujiaoxingquanxing"
									:class="{'active':item.star > 3}" data-index="3" @click="rating(index,3)" />
								<iconfont class="iconfont" icon="iconwujiaoxingquanxing"
									:class="{'active':item.star > 4}" data-index="4" @click="rating(index,4)" />
							</div>
						</div>
						<div class="cot">
							<textarea name="cot" placeholder="您的评价有助于我们提供更好的服务" v-model="cot"></textarea>
						</div>
						<input type="submit" class="submit" value="提交" />
					</form>
				</div>
				<div class="bg"></div>
			</div>
		</uni-transition>
		<!-- diningrecord-popup end -->
	</div>
</template>

<script>
	import loadRefresh from '@/components/load-refresh/load-refresh.vue';
	import {
		GetBillList
	} from "@/api/bill";
	import moment from "moment";
	import {
		mapActions,
		mapGetters
	} from "vuex";
	import {
		commonMixin
	} from '../../mixins/index.js'
	export default {
		name: "excharge",
		mixins: [commonMixin],
		components: {
			loadRefresh
		},
		data() {
			return {
				moment,
				billList: [], // 消费列表
				allLoaded: false, // 是否全部加载
				isAutoFill: false, // 自动上拉加载一次
				wrapperHeight: 0, // 滚动区域高度
				count: null,
				pageNo: 1,
				starlist: [{
						text: "整体就餐",
						star: 0
					},
					{
						text: "服务评价",
						star: 0
					},
					{
						text: "菜品评价",
						star: 0
					}
				],
				cot: "", // 评论内容
				showpopup: false // 显示评论弹窗
			};
		},
		computed: {
			...mapGetters(["MemberCode", "StoreCode", "DeskID", "Member"])
		},
		onLoad() {
			// 请求数据
			var parameter = {};
			parameter.MemberCode = this.MemberCode;
			parameter.pageNo = this.pageNo;
			parameter.pageSize = 6;
			console.log("parameter", parameter);
			GetBillList(parameter)
				.then(res => {
					this.billList = res.data || [];
					this.count = res.count;
					console.log("res", this.billList);
					if (this.billList.length >= this.count) {
						this.allLoaded = true; // 数据已全部获取完毕
					}
				})
				.catch(err => console.log(err));
		},
		methods: {
			//时间转化函数
			dateFormart(time, formart) {
				return moment(time).format(formart);
			},
			// 触底加载
			loadBottom() {
				if (this.billList.length < this.count) {
					var parameter = {};
					var pageCount = Math.ceil(this.count / 6);
					parameter.MemberCode = this.MemberCode;
					if (this.pageNo < pageCount) {
						this.pageNo = this.pageNo + 1;
					}
					parameter.pageNo = this.pageNo;
					parameter.pageSize = 6;
					GetBillList(parameter)
						.then(res => {
							console.log("加载更多", res.data);
							res.data.forEach(item => {
								this.billList.push(item);
							});
							if (this.billList.length >= this.count) {
								this.allLoaded = true; // 数据已全部获取完毕
							}
							console.log("res", res);
							console.log("parameter", parameter);
							console.log("billList", this.billList);
							this.$refs.loadRefresh.completed()
						})
						.catch(err => {
							this.$refs.loadRefresh.completed()
							console.log(err)
						});
				}
			},
			// 跳转
			jump(item) {
				if (item.BillState == 1 || item.CommentState == 1) {
					// this.$router.push({
					//         name: "BillDetail",
					//         query: {
					//             BillID: item.BillID,
					//             BillCode: item.BillCode,
					//             StoreCode: item.StoreCode
					//         }
					//     });
					uni.redirectTo({
						url: `/pages/billDetail/index?BillID=${item.BillID}`
					})
				}
				if (item.BillState == 2 && item.CommentState == 0) {
					// this.$router.push({
					//     name:'comment',
					//     query: {
					//         BillID: item.BillID,
					//         BillCode: item.BillCode,
					//         StoreCode: item.StoreCode
					//     }
					// });
					uni.redirectTo({
						url: `/pages/comment/index?BillID=${item.BillID}`
					})
				}
			},
			// 评星
			rating(index, num) {
				this.starlist[index].star = num + 1;
			},
			// 提交表单
			submit(e) {
				if (this.cot != "") {}
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
	$green: #09bb07;

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
		min-height: 100vh;
		background: #f2f2f6;
	}

	/* diningrecord */
	.diningrecord {
		padding: 10px 10px 0;
		overflow: scroll;

		li {
			height: 85px;
			background: #fff;
			@include border-radius(5px);
			margin-bottom: 10px;
			padding: 12px 15px 0 20px;
			position: relative;
		}

		.item {}

		.title {
			font-size: 14px;
			line-height: 1;

			.table {
				font-size: 12px;
				color: $grey;
				margin-left: 10px;
			}
		}

		.time {
			font-size: 12px;
			line-height: 1;
			color: $grey;
			margin-top: 12px;
		}

		.price {
			font-size: 12px;
			line-height: 1;
			color: $grey;
			margin-top: 10px;
		}

		.arrow {
			position: absolute;
			top: 12px;
			right: 15px;

			i {
				font-size: 12px;
				color: $grey;
			}
		}

		.eating,
		.gocomment,
		.commented {
			width: 75px;
			height: 25px;
			background: #ff423e;
			line-height: 25px;
			text-align: center;
			@include border-radius(13px);
			color: #fff;
			font-size: 12px;
			position: absolute;
			bottom: 12px;
			right: 15px;
			box-shadow: 0px 0px 9.9px 0.1px rgba(255, 66, 62, 0.5);
			display: block;
		}

		.gocomment {
			background: #ffbb05;
			box-shadow: 0px 0px 9.9px 0.1px rgba(255, 187, 5, 0.5);
		}

		.commented {
			background: #c9c9c9;
			box-shadow: none;
		}
	}

	/* diningrecord end */
	/* diningrecord-popup */
	.diningrecord-popup {
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 99;
		@include transition;

		.diningrecord-popup-cot {
			position: absolute;
			bottom: 10px;
			left: 10px;
			right: 10px;
			background: #fff;
			z-index: 1;
			@include border-radius(10px);
			overflow: hidden;

			.comment-form {
				padding: 15px 15px 70px;
			}

			.star-item {
				height: 20px;
				line-height: 20px;
				margin-bottom: 10px;

				.text {
					display: inline-block;
					font-size: 14px;
					color: #555;
				}

				i {
					display: inline-block;
					margin-left: 10px;
					font-size: 16px;
					color: #e6e6ea;
				}

				.active {
					color: $main;
				}
			}

			.cot {
				width: 100%;
				height: 105px;

				textarea {
					width: 100%;
					height: 100%;
					padding: 10px;
					display: block;
					border-color: #e6e6ea;
					font-size: 12px;
					@include border-radius(5px);
				}
			}

			.submit {
				width: 100%;
				height: 50px;
				position: absolute;
				bottom: 0;
				left: 0;
				background: $main;
				border: none;
				font-size: 14px;
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

	/* diningrecord-popup end */
	/* activicity */

	.activicity {
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

			image {
				width: 100%;
				height: 90px;
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
