<template>
	<div class="container">
		<!-- order-msg -->
		<div class="order-msg Box">
			<div class="order-msg-item">
				<span class="text">台位：{{DeskName}}</span>
				<span class="text">人数：{{Person}}</span>
			</div>
		</div>
		<!-- order-msg end -->
		<!-- add -->
		<div class="add">
			<image class="img" :src="staticUrl + 'images/add.png'" @click="ToDishMenu">
			</image>
			<text class="add-text">加菜</text>
		</div>
		<!-- add end -->
		<!-- order-list-box -->
		<div class="order-list-box">
			<ul class="order-list">
				<li v-if="WaitingOrders != null && WaitingOrders.length>0">
					<div class="item">
						<div class="Box" v-for="(order,index_p) in WaitingOrders" :key="index_p">
							<div class="title-box" :class="{'active':order.state == 1}">
								<h6 class="title" style="color:#ffbb05">待接单菜品清单</h6>
							</div>
							<div class="product-list">
								<ul>
									<li v-for="(item,index_s) in order.Items" :key="index_s">
										<div class="text-box">
											<h6 class="title"><span v-if="item.IsWeigh==1"
													class="weighdish">【称重】</span>{{item.DishName}}</h6>
											<span class="memberprice"
												v-if="item.MemberPrice!=item.DishPrice">￥{{item.MemberPrice}}</span>
											<span class="price del"
												v-if="item.MemberPrice!=item.DishPrice">￥{{item.DishPrice}}</span>
											<span class="price"
												v-if="item.MemberPrice==item.DishPrice">￥{{item.DishPrice}}</span>
											<span class="number">{{item.Number}} {{item.Unit}}</span>
										</div>
										<div class="dishremark" v-if="item.Flavors||item.MakeMethods">
											{{item.MakeMethods+(item.MakeMethods&&item.MakeMethods.length>0?'、':'')+item.Flavors}}
										</div>
									</li>
								</ul>
							</div>
							<div class="flavor">
								菜品备注：
								<p class="text">{{order.Remark}}</p>
							</div>
						</div>
					</div>
				</li>
				<li v-if="editingBill != null">
					<div class="item Box">
						<div class="title-box">
							<h6 class="title">消费菜品清单</h6>
						</div>
						<div class="product-list">
							<ul>
								<li v-for="(item,index_s) in editingBill.Items" :key="index_s"
									:class="[Vshow(item.Number-item.BackNumber>0)]">
									<div class="text-box" v-if="item.Number-item.BackNumber>0">
										<h6 class="title">
											<span v-if="item.IsWeigh==1 && item.UnWeighed==1" class="weighdish">[称重]
											</span>
											<span v-if="item.IsDiscount==1" class="weighdish">[打折] </span>
											<span v-if="item.IsPresent==1" class="weighdish">[赠送]
											</span>{{item.DishName}}
										</h6>
										<span class="memberprice"
											v-if="item.MemberPrice!=item.DishPrice">￥{{item.MemberPrice}}</span>
										<span class="price del"
											v-if="item.MemberPrice!=item.DishPrice">￥{{item.DishPrice}}</span>
										<span class="price"
											v-if="item.MemberPrice==item.DishPrice">￥{{item.DishPrice}}</span>
										<div class="number">{{item.Number}} {{item.Unit}}
											<span v-if="item.BackNumber>0" tag="123" class="back">{{0-item.BackNumber}}
												{{item.Unit}}</span>
										</div>
									</div>
									<div class="dishremark" v-if="item.Remark">{{item.Remark}}</div>
								</li>
								<li v-for="(item,index_s2) in editingBill.Items" :key="index_s2"
									:class="[Vshow(item.Number-item.BackNumber==0)]">
									<div class="text-box" v-if="item.Number-item.BackNumber==0">
										<h6 class="title"><span v-if="item.IsWeigh==1 && item.UnWeighed==1"
												class="weighdish">[称重]</span>{{item.DishName}}</h6>
										<span class="memberprice"
											v-if="item.MemberPrice!=item.DishPrice">￥{{item.MemberPrice}}</span>
										<span class="price del"
											v-if="item.MemberPrice!=item.DishPrice">￥{{item.DishPrice}}</span>
										<span class="price"
											v-if="item.MemberPrice==item.DishPrice">￥{{item.DishPrice}}</span>
										<span class="number">{{item.Number}} {{item.Unit}} <span
												v-if="item.BackNumber>0" class="back">{{0-item.BackNumber}}
												{{item.Unit}}</span></span>
									</div>
								</li>
								<!-- <li v-for="(item,index_s) in editingBill.RetreatItems" :key="'ret'+index_s">
                        <div class="text-box">
                            <h6 class="title">{{item.DishName}}</h6>
                            <span class="number back">{{0-item.BackNumber}} {{item.Unit}}</span>
                        </div>
                    </li> -->
							</ul>
						</div>
						<div class="flavor" :class="[Vshow(editingBill.Remark)]">
							菜品备注：<p class="text">{{editingBill.Remark}}</p>
						</div>
					</div>
				</li>
			</ul>
		</div>
		<!-- order-list-box end -->
		<!-- order-btn-box -->
		<div class="order-btn-box">
			<div class="order-btn">
				<div class="text-box" v-if="editingBill">
					<p class="text">合计：</p>
					<p class="memberprice" v-if="DiscountAmount>0">￥{{editingBill.Amount-DiscountAmount}}</p>
					<p class="num del" v-if="DiscountAmount>0">￥{{editingBill.Amount}}</p>
					<p class="num" v-if="DiscountAmount==0">￥{{editingBill.Amount}}</p>
				</div>
				<div class="text-box" v-else>
					<p class="text">合计：</p>
					<p class="num">￥0</p>
				</div>
				<!-- <div class="btn pay"  @click="goCheckDS">买单</div> -->
				<div class="btn pay" v-if="CheckBtnEnable" @click="goCheck">买单</div>
				<div class="btn inorder" v-else-if="WaitingOrders!=null&&WaitingOrders.length!=0">下单中…</div>
				<div class="btn inorder" v-else-if="HasUnWeighedDish">待称重</div>

			</div>
		</div>
		<!-- order-btn-box end -->
	</div>
</template>

<script>
	import Vue from 'vue'
	import {
		commonMixin
	} from '../../mixins/index.js'
	import {
		mapActions,
		mapGetters
	} from 'vuex'
	import {
		GetBill,
		GetWaitingOrder,
		GetOrderState,
		BillCheckEffective
	} from '@/api/tsorder'
	export default {
		name: 'order',
		mixins: [commonMixin],
		data() {
			return {
				DeskName: '',
				Person: 0,
				BillAmount: 0,
				WaitingOrders: [],
				editingBill: null,
				leaving: false,
				// order:{} , // 订单
				btnstate: false, // 按钮状态,是否可买单
			}
		},
		computed: {
			...mapGetters(['MemberCode', 'StoreCode', 'DeskID', 'Member']),
			CheckBtnEnable() {
				return (this.WaitingOrders == null || this.WaitingOrders.length == 0) &&
					(this.editingBill && this.editingBill.Items.filter(a => a.IsWeigh == 1 && a.UnWeighed == 1 && a
						.Number - a.BackNumber != 0).length == 0);
			},
			HasUnWeighedDish() {
				return this.editingBill && this.editingBill.Items.filter(a => a.IsWeigh == 1 && a.UnWeighed == 1 && a
					.Number - a.BackNumber > 0).length != 0;
			},
			// 优惠金额
			DiscountAmount() {
				let amount = 0;
				if (!this.editingBill) return 0;
				this.editingBill.Items.forEach(dish => {
					if (dish.SellingPrice == dish.DishPrice) {
						amount += (dish.DishPrice - dish.MemberPrice) * dish.Number;
					}
				});
				return parseInt(amount * 100) / 100;
				// return this.CanDiscountAmount;
			},
		},
		onShow() {
			this.initData();
			this.$nextTick(() => {
				// this._calcBtnState();
				// this._calcTotal();
			})
		},
		methods: {
			initData() {
				this.$showLoading('加载中…');
				this.loadBill().then(res => {
					console.log('loadBill', res);
					if (res.state == 200) {
						this.loadWaitOrder().then(res => {
							console.log('loadWaitOrder', res);
							if (res.state == 200) {
								if ((this.WaitingOrders == null || this.WaitingOrders.length == 0) && this
									.editingBill == null) {
									this.$showToast('还没有进行中的消费呦！😀');
									uni.navigateTo({
										url: '/pages/dishMenu/index'
									})
								}
								if (this.editingBill != null) {
									this.DeskName = this.editingBill.DeskName;
									this.Person = this.editingBill.Person;
								} else if (this.WaitingOrders != null && this.WaitingOrders.length > 0) {
									this.DeskName = this.WaitingOrders[0].DeskName;
									this.Person = this.WaitingOrders[0].Person;
								}
								this.$nextTick(() => {
									this.accountBillAmount();
									this.refeachWaiting();
								});
							}
						})
					}
				}).finally(res => {
					this.$hideLoading();
				});
			},
			loadBill() {
				return new Promise((resolve, reject) => {
					var paramer = {};
					paramer.DeskID = this.DeskID;
					paramer.MemberCode = this.MemberCode;
					GetBill(paramer).then(res => {
						if (res.state == 200) {
							this.editingBill = res.data;

						} else {
							console.error('GetBill.error', res);
						}
						resolve(res);
					}).catch(res => {
						console.error('GetBill.catch', res);
					}).finally(res => {});
				});
			},
			loadWaitOrder() {
				return new Promise((resolve, reject) => {
					var paramer = {};
					paramer.DeskID = this.DeskID;
					paramer.MemberCode = this.MemberCode;
					GetWaitingOrder(paramer).then(res => {
						if (res.state == 200) {
							this.WaitingOrders = res.data;
						} else {
							console.log('GetWaitingOrder.error', res);
						}
						resolve(res);
					}).catch(res => {
						console.log('GetWaitingOrder.catch', res);
					}).finally(res => {});
				});
			},
			accountBillAmount() {
				let amount = 0;
				if (this.editingBill != null) {
					amount += this.editingBill.Amount;
					console.log('editingBill', );
				}
				if (this.WaitingOrders && this.WaitingOrders.length > 0) {
					this.WaitingOrders.forEach(order => {
						order.Items.forEach(item => {
							console.log('editingBill', item.Number * item.MemberPrice, amount);
							amount += item.Number * item.MemberPrice;
						});
					});
				}
				this.BillAmount = amount;
			},
			refeachWaiting() {
				if (this.WaitingOrders) {
					var b = this;
					var paramer = {};
					paramer.OrderCodes = [];
					this.WaitingOrders.forEach(order => {
						paramer.OrderCodes.push(order.OrderCode);
					});
					GetOrderState(paramer).then(res => {
						if (res.state = 200) {
							console.log('GetOrderState.res', paramer, res);
							res.data.forEach(item => {
								if (item.State != null && item.State != 1) {
									this.initData();
									return;
								}
							});
							if (!b.leaving) {
								setTimeout(() => {
									b.refeachWaiting();
								}, 3000);
							}
						}
					}).catch(res => {});
				}

			},
			// goCheckDS(){

			//       Toast({
			//         message: "系统维护中，请到吧台买单！您的卡号是："+this.Member.MemberNumber,
			//         position: "top",
			//         duration: 3000
			//       });
			// },
			goCheck() {
				// 如果有人正在结账（20s）内，提示***正在买单，不可以重复买单
				this.$showLoading('加载中…')
				BillCheckEffective({
					BillID: this.editingBill.BillID,
					MemberCode: this.Member.MemberCode
				}).then(res => {
					this.$hideLoading();
					if (res.state == 200) {
						if (res.data.BillState == -1) {
							this.$showToast("网络开小差啦，请稍后重试！(State:" + res.state.BillState + ")");
						} else if (res.data.BillState == 2) {
							this.$showToast("该消费已消台或已提交买单！");
							uni.reLaunch({
								url: `/pages/TimeOut/index?MemberCode=${this.Member.MemberCode}&StoreCode=${this.StoreCode}`
							})
						} else if (res.data.CheckState == 2) {
							this.$showToast("已经有小伙伴买过单了哦！");
							uni.reLaunch({
								url: `/pages/TimeOut/index?MemberCode=${this.Member.MemberCode}&StoreCode=${this.StoreCode}`
							})
						} else if (res.data.CheckState == 1) {
							this.$showToast("有小伙伴正在买过单了哦！");
						} else if (res.data.WaitOrderCount != 0) {
							this.$showToast("您刚提交的订单还未处理，请稍后再试！");
							this.initData();
						} else {
							uni.navigateTo({
								url: '/pages/Check/index?editingBill=' + JSON.stringify(this.editingBill)
							})
						}
					} else {
						this.$showToast("网络开小差啦，请稍后重试！");
					}
				}).catch(err => {
					console.log(err);
					this.$hideLoading();
					this.$showToast("网络开小差啦，请稍后重试！");
				})
			},
			ToDishMenu() {
				this.leaving = true;
				uni.navigateTo({
					url: `/pages/dishMenu/index?AddDish=${true}&Person=${this.Person}`
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	$main: #ea454c;
	$red: #ff423e;
	$border: #e6e6ea;
	$grey: #777;

	@mixin border-radius($size) {
		-webkit-border-radius: $size;
		-moz-border-radius: $size;
		border-radius: $size;
	}

	.container {
		padding-bottom: 70px;
		// margin: 45% auto 0;
	}

	/* order-msg */
	.order-msg {

		// height: 45px;
		.order-msg-item span {
			width: 49%;
			text-align: center;
			display: inline-block;
			font-size: 14px;
		}
	}

	/* order-msg end */
	/* add */
	.add {
		width: 100%;
		height: 45px;
		position: relative;
		margin-bottom: -43px;
		
		.add-text {
			position: absolute;
			bottom: 35px;
			left: 47%;
			color: white;
			font-size: 12px;
		}

		.img {
			width: 60px;
			height: 67.5px;
			position: absolute;
			bottom: 5px;
			left: 50%;
			margin-left: -29px;

			animation: addbtn 1.25s infinite;
			color: white;
			text-align: center;
			padding-top: 20px;

			@keyframes addbtn {
				0% {
					-webkit-transform: scale(0.7);
					transform: scale(0.7)
				}

				50% {
					-webkit-transform: scale(1);
					transform: scale(1)
				}

				100% {
					-webkit-transform: scale(0.7);
					transform: scale(0.7)
				}
			}

			@-webkit-keyframes addbtn

			/*Safari and Chrome*/
				{
				0% {
					-webkit-transform: scale(0.7);
					transform: scale(0.7)
				}

				50% {
					-webkit-transform: scale(1);
					transform: scale(1)
				}

				100% {
					-webkit-transform: scale(0.7);
					transform: scale(0.7)
				}
			}
		}
	}

	.Box {
		border-radius: 10px;
		margin: 15px 15px 0;
		background: white;
		padding: 10px;
		line-height: 40px;
	}

	/* add end */
	/* order-list-box */
	.order-list-box {
		.title-box {
			height: 45px;
			line-height: 45px;
			text-align: center;
			font-size: 14px;
			color: $main;
			border-bottom: 1px solid $border;
			margin: 0 10px;
		}

		.title-box.active {
			color: $grey;
		}

		.product-list {
			padding: 10px;

			li {
				clear: both;
				// height: 40px;
				line-height: 40px;
				font-size: 14px;

				.text-box {
					.title {
						width: 150px;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
						font-size: 14px;
						float: left;
					}

					.text {
						font-size: 14px;
						color: $grey;
						float: left;
					}
				}

				.dishremark {
					color: #777;
					clear: both;
					line-height: 12px;
					margin-bottom: 14px;
					font-size: 12px;
				}

				.dishremark span {
					margin: 0 5px 0 0;
				}

				.number {
					float: right;
					font-size: 14px;
				}

				.back {
					color: $red;
				}

				.weighdish {
					font-weight: bold;
					padding-right: 5px;
					color: #ff423e;
				}

				.memberprice {
					margin-right: 10px;
					font-size: 14px;
					min-width: 30px;
					display: inline-block;
					color: #ff423e;
				}

				.price {
					color: initial;
					font-size: 14px;
				}

				.price.del {
					text-decoration: line-through;
					color: #777;
					font-size: 12px;
				}
			}

			.list-total {
				height: 30px;
				line-height: 30px;
				margin-top: 5px;

				.title {
					width: 120px;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					font-size: 14px;
					float: left;
				}

				.total {
					float: right;
					color: $red;
					font-size: 14px;
				}

			}
		}

		.flavor {
			clear: both;
			// height: 45px;
			line-height: 24px;
			padding: 10px 0;
			margin: 0 10px;
			font-size: 12px;
			border-top: 1px solid #e6e6ea;

			.text {
				font-size: 14px;
				color: $grey;
				display: inline-block;
			}
		}
	}

	/* order-list-box end */
	/* order-btn-box */
	.order-btn-box {
		padding: 10px;
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;

		.order-btn {
			width: 100%;
			height: 50px;
			background: #fff;
			@include border-radius(25px);
			-webkit-box-shadow: 0 0 3px 0 rgba(0, 0, 0, .1);
			-moz-box-shadow: 0 0 3px 0 rgba(0, 0, 0, .1);
			box-shadow: 0 0 3px 0 rgba(0, 0, 0, .1);
			overflow: hidden;
			position: relative;

			.text-box {
				line-height: 50px;
				float: left;
				margin-left: 20px;

				.text {
					font-size: 14px;
					display: inline-block;
				}

				.num {
					font-size: 16px;
					display: inline-block;
				}

				.num.del {
					font-size: 16px;
					color: $grey;
					display: inline-block;
					text-decoration: line-through;
				}

				.memberprice {
					font-size: 16px;
					color: red;
					display: inline-block;
				}
			}

			.btn {
				width: 130px;
				height: 50px;
				line-height: 50px;
				background: $main;
				float: right;
				font-size: 14px;
				text-align: center;
				display: block;
				color: white;
				position: absolute;
				right: 0;
				bottom: 0;
			}

			.inorder {
				background: #d8d8d8;
			}
		}
	}

	/* order-btn-box end */
</style>
