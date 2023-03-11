<template>
	<div class="container" style="font-size: 14px;">
		<!-- <div v-if="PageLoading">加载中...，设计骨架屏</div> -->
		<div v-if="!PageLoading">
			<!-- order-price -->
			<div class="Box order-price">订单金额
				<p class="price">{{BillLoading?'加载中...':'￥'+editingBill.Amount}}</p>
			</div>
			<!-- order-price end -->
			<!-- pay-msg -->
			<div class="Box pay-msg">
				<div class="pay-msg-item member clearfix" v-if="!BillLoading& DiscountAmount>0">
					<div @click="ChangeDiscount()">
						<div class="select" :class="{'active':UseDiscount}">
							<iconfont class="iconfont" icon="iconduihao" size="12px" />
						</div>
						<span class="title">会员优惠</span>
					</div>
					<span class="num">￥{{DiscountAmount}}</span>
				</div>
				<div class="pay-msg-item coupon clearfix"
					v-if="Member&&Member.IntegralBalance>0&&BusinessConfig&&BusinessConfig.IntegralPaySwitch==1">
					<div>
						<span class="title">积分 共
							{{Member.IntegralBalance}}{{BusinessConfig?BusinessConfig.IntegralPaySwitch:0}}</span>
					</div>
					<span class="num">可使用 {{IntegralAmount*BusinessConfig?BusinessConfig.IntegralExchange:0}} 积分，抵现
						{{IntegralAmount}} 元</span>
				</div>
				<div class="pay-msg-item coupon clearfix">
					<div @click="ChangeCard(null)">
						<div class="select" :class="{'active':CardUseLimitState&&UseCard}">
							<iconfont class="iconfont" icon="iconduihao" size="12px" />
						</div>
						<span class="title">优惠券</span>
					</div>
					<span class="num" v-if="CardsLoading">加载中...</span>
					<span class="num" @click="cardvisibale=!cardvisibale" v-if="UsedCard!=null">{{UsedCard.CardName}}，抵扣
						{{UsedCard.DiscountAmount}} 元</span>
					<span class="num" @click="cardvisibale=!cardvisibale"
						v-else-if="CardUseLimitState&&!CardsLoading&&UsedCard==null">{{CanUseCardCount==0?'无':CanUseCardCount+' 张'}}可用</span>
					<span class="num" @click="cardvisibale=!cardvisibale" v-else>不可用</span>
				</div>

				<div class="pay-msg-item save clearfix">
					<div class="select-box">
						<span class="num" style="min-width:50px;text-align:right">￥{{StoredAmount}}</span>
						<div @click="ChangeStored(!UseStored)">
							<div class="select" :class="{'active':UseStored}">
								<iconfont class="iconfont" icon="iconduihao" size="12px" />
							</div>
							<div class="text">储值：剩余￥{{Member.StoredBalance}}
								<div class="locktext" v-if="AccoutInfo&&AccoutInfo.LockAmount>0"><span>含赠送
										{{AccoutInfo.LockAmount}} 元 {{AccoutInfo.UnLockTime|TimeSpanFilter}} 后可用</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<!-- pay-msg end -->
			<!-- save -->
			<div class="Box save-box" :class="[Vshow(UseStored)]" v-if="!UsedCard||CanShare">
				<div>请选择充值项</div>
				<ul class="save-list clearfix">
					<li :class="{'active':UsedRecord == null}">
						<div class="item" @click="selectStoredRecord(null)">
							<h6 style="line-height: 34px;">不充值</h6>
							<div class="select">
								<img src="../../static/images/xuanzhong.png" alt="选中" />
							</div>
						</div>
					</li>
					<li v-for="(item,index) in StoredRecords" :key="index"
						:class="[UsedRecord!=null&&UsedRecord.RowNumber == item.RowNumber ? 'active' : '', Vshow(item.Amount>NeedRuleAmount-AccoutInfo.Balance+LockStoredAmount)]"
						<div class="item" @click="selectStoredRecord(item)">
						<h6 class="title">{{item.Amount}}</h6>
						<p class="text">送<span class="num">{{item.GiveAmount}}</span>元</p>
						<div class="select">
							<img src="../../static/images/xuanzhong.png" alt="选中" />
						</div>
			</div>
			</li>
			</ul>
			<p class="data">当前储值余额{{Member.StoredBalance}}元</p>
			<p class="score" v-if="UsedRecord!=null">
				充值{{UsedRecord.Amount}}元送{{UsedRecord.GiveAmount}}元，充值后储值结余{{parseInt((Member.StoredBalance*100+UsedRecord.Amount*100+UsedRecord.GiveAmount*100))/100}}元
			</p>
			<p class="score" v-if="UsedRecord!=null">
				本次使用储值{{StoredAmount}}元，结账后储值结余{{parseInt((Member.StoredBalance*100+UsedRecord.Amount*100+UsedRecord.GiveAmount*100-StoredAmount*100))/100}}元
			</p>
			<p class="score" v-if="UsedRecord!=null&&UsedRecord.GiveIntegral!=0">赠送积分：{{UsedRecord.GiveIntegral}}
			</p>
			<div class="give-coupon" v-if="UsedRecord!=null&&UsedRecord.GiveCards.length>0&&false">
				<p class="title">赠送优惠券：</p>
				<ul class="coupon-list">
					<li v-for="(item,index) in UsedRecord.GiveCards" :key="index">
						<div class="item">
							<div class="msg">
								<div class="img">
									<!-- <img :src="item.Picture" alt="优惠券" /> -->
									<img src="../../static/images/coupon.jpg" alt="优惠券" />
								</div>
								<div class="text-box">
									<h6 class="title">{{item.CardName}}</h6>
									<p class="condition">使用条件：满{{item.SatisfyAmount}}元可用</p>
									<p class="date">有效期：{{item.EndDate}}</p>
								</div>
							</div>
							<div class="int">
								<p class="text">{{item.GiveNumber}} 张</p>
							</div>
						</div>
					</li>
				</ul>
			</div>
		</div>
		<!-- save end -->
		<!-- pay-btn-box -->
		<div class="pay-btn-box">
			<div class="pay-btn">
				<div class="text-box">
					<p class="text">微信支付：</p>
					<p class="num">￥{{NeedPayAmount}}</p>
				</div>
				<div class="btn" v-if="PayStepNumber==0" @click="GoCheck">确认支付</div>
				<div class="btn" v-else>准备中……</div>
			</div>
		</div>
		<!-- pay-btn-box end -->

		<div class="member-cards" :class="{'active':cardvisibale}">
			<div class="title-box">
				<h5 class="title">选择优惠券</h5>
				<div class="clear" @click="cardvisibale=false">关闭</div>
			</div>
			<ul class="list" v-if="CardUseLimitState">
				<li v-for="(card,index) in MemberCards" :key="index" @click="ChangeCard(card)"
					:style="!card.Switch?'opacity:0.5':''">
					<i class="icon"
						:class="UsedCard!=null&&UsedCard.MemberCardCode==card.MemberCardCode?'active':''"></i>
					<div class="content" :class="card.DiscountAmount>0?'youxiao':''">
						<p class="cardname">{{card.CardName}}<span class="tuijian"
								:class="[Vshow(card.TuiJian)]">推荐</span>
						</p>
						<p class="info">{{card.Content}}</p>
						<p class="info">过期时间：{{card.EndDate|DateFilter}}</p>
					</div>
					<div class="discount" :class="[Vshow(card.DiscountAmount!=0)]">抵现{{card.DiscountAmount}}</div>
					<div class="discount" :class="[Vshow(card.DiscountAmount==0)]">不可用</div>
				</li>
			</ul>
			<ul class="list" v-else>
				<li style="text-align: center;line-height: 50px;font-size: 14px;" class="errorfont">
					每<strong>{{CardLimitSpan}}</strong>可使用<strong> {{BusinessConfig.OrderConfig.CardLimitUseNumber}}
					</strong>张卡券哦！</li>
				<li v-for="(card,index) in MemberCards" :key="index" style="opacity:0.5">
					<i class="icon" :class="''"></i>
					<div class="content">
						<p class="cardname">{{card.CardName}}</p>
						<p class="info">{{card.Content}}</p>
						<p class="info">过期时间：{{card.EndDate|DateFilter}}</p>
					</div>
					<div class="discount">不可用</div>
				</li>
			</ul>
		</div>
		<div class="bg" :class="[Vshow(cardvisibale)]" @click="cardvisibale=false"></div>
		<GetPhone :ShowGetPhone="ShowGetPhone" @CallBack="GetPhoneCallBack"></GetPhone>
	</div>
	</div>
</template>
<script>
	import GetPhone from '@/components/member/modules/GetPhone';
	import {
		commonMixin
	} from '../../mixins/index.js'
	import {
		mapActions,
		mapGetters
	} from 'vuex'
	import {
		GetBill,
		CreateCheckOrder,
		BillCheckEffective
	} from '@/api/tsorder'
	import {
		GetStoredRuleActive,
		CreateRecharge
	} from '@/api/stored'
	import {
		CreatePayOrder
	} from '@/api/pay'
	import {
		GetMember,
		GetStoredInfo
	} from '@/api/member'
	import {
		GetBillCard
	} from '@/api/card'
	import moment from 'moment'

	export default {
		name: 'pay',
		components: {
			GetPhone,
		},
		mixins: [commonMixin],
		data() {
			return {
				editingBill: {
					Items: []
				},
				AccoutInfo: {},

				// CanDiscountAmount: 0, // 可优惠金额

				UseDiscount: true, // 适用会员优惠

				MemberCards: [], // 会员卡券列表
				UsedCard: null, // 使用的卡券
				UseCard: false, // 使用的储值支付
				CardUseCount: 0, // 当日已使用卡券数量
				cardvisibale: false,

				StoredRecords: [], // 储值规则列表
				UsedRecord: null, // 使用的储值规则
				UseStored: false, // 使用的储值支付

				PageLoading: true, // 页面装载中……
				BillLoading: true, // 账单装在中……
				CardsLoading: true, // 卡券装载中……
				StoredRuleLoading: true, // 储值规则装载中……

				GoPayLoading: false,
				PayStepNumber: 0,
				StoreCode: '',

				// CanShare:false, // 卡券与储值优惠是否可共用
				OnCard: false,
				OnStored: false,

				LoadingNumber: 0, // 加载中数量为0时关闭加载效果

				CreatLoading: true,

				ShowGetPhone: false,
			}
		},
		filters: {
			DateFilter: function(value) {
				return moment(value).format('YYYY-MM-DD HH:mm:ss');
			},
			TimeSpanFilter(value) {
				var timespan = moment.duration(moment(value) - moment());
				console.log('timespan,', timespan)
				var SpanStr = "";
				if (timespan.days() > 0) {
					SpanStr += timespan.days() + '天'
				}
				if (timespan.hours() > 0) {
					SpanStr += timespan.hours() + '小时'
				}
				if (timespan.minutes() > 0) {
					SpanStr += timespan.minutes() + '分'
				}
				if (SpanStr.length <= 3 && timespan.seconds() > 0) {
					SpanStr += timespan.seconds() + '秒'
				}
				return SpanStr;
			},
		},
		computed: {
			...mapGetters(['MemberCode', 'DeskID', 'Member', 'Business', 'BusinessConfig']),
			LockStoredAmount() {
				if (this.AccoutInfo.LockAmount > 0 && moment(this.AccoutInfo.UnLockTime) > moment()) {
					return this.AccoutInfo.LockAmount;
				}
				return 0;
			},
			// 卡券使用限制状态
			CardUseLimitState() {
				if (this.BusinessConfig && this.BusinessConfig.OrderConfig && this.BusinessConfig.OrderConfig
					.CardLimitUseNumber != 0) {
					return this.CardUseCount < this.BusinessConfig.OrderConfig.CardLimitUseNumber;
				} else {
					return true;
				}
			},
			// 卡券与储值优惠是否可共用
			CanShare() {
				return this.BusinessConfig.OrderConfig.StoredWithCard == 1;
			},
			// 优惠金额
			DiscountAmount() {
				let amount = 0;
				this.editingBill.Items.forEach(dish => {
					if (dish.SellingPrice == dish.DishPrice) {
						amount += (dish.DishPrice - dish.MemberPrice) * dish.Number;
					}
				});
				return amount;
				// return this.CanDiscountAmount;
			},
			// 积分抵扣金额
			IntegralAmount() {
				if (this.BusinessConfig.IntegralPaySwitch == 0) {
					return 0;
				}
				if (this.BusinessConfig.IntegralExchangeUpperLimitMode == 'Ratio') {
					if (this.BusinessConfig.IntegralExchangeUpperLimitRatio * this.editingBill.Amount * this.BusinessConfig
						.IntegralExchange > this.Member.IntegralBalance) {
						return parseFloat(this.Member.IntegralBalance / this.BusinessConfig.IntegralExchange).toFixed(2) /
							1;
					} else {
						return parseFloat(this.BusinessConfig.IntegralExchangeUpperLimitRatio * this.editingBill.Amount)
							.toFixed(2) / 1;
					}
				} else {
					if (this.BusinessConfig.IntegralExchangeUpperLimitFixed > this.Member.IntegralBalance) {
						return parseFloat(this.Member.IntegralBalance / this.BusinessConfig.IntegralExchange).toFixed(2) /
							1;
					} else {
						return parseFloat(this.BusinessConfig.IntegralExchangeUpperLimitFixed / this.BusinessConfig
							.IntegralExchange).toFixed(2) / 1;
					}
				}
			},
			// 卡券抵扣金额
			CardAmount() {
				return this.UsedCard == null ? 0 : this.UsedCard.DiscountAmount;
			},
			// 储值前仍需支付金额，用户隐藏无效储值梯度
			NeedRuleAmount() {
				return this.editingBill ? parseFloat(this.editingBill.Amount - (this.UseDiscount ? this.DiscountAmount :
					0) - this.IntegralAmount - this.CardAmount).toFixed(2) / 1 : '--'
			},
			// 储值使用金额
			StoredAmount() {
				if (this.UseStored) {
					if (this.NeedRuleAmount > 0) {
						// 充值后可用储值余额
						let storedamount = 0;
						if (this.UsedRecord == null) {
							storedamount = this.Member.StoredBalance - this.AccoutInfo.LockAmount;
						} else {
							storedamount = this.Member.StoredBalance - this.AccoutInfo.LockAmount + this.UsedRecord.Amount;
						}
						return this.NeedRuleAmount > storedamount ? storedamount : this.NeedRuleAmount;
					} else {
						return 0;
					}
				} else {
					return 0;
				}
			},
			// 微信支付使用金额，直接用于买单的支付金额
			WeiXinAmount() {
				return this.editingBill ?
					parseFloat((this.editingBill.Amount - (this.UseDiscount ? this.DiscountAmount : 0) - this
						.IntegralAmount - this.CardAmount - this.StoredAmount).toFixed(10)) / 1 :
					'--';
			},
			// 最终需要支付金额
			NeedPayAmount() {
				if (this.UseStored && this.UsedRecord != null) {
					return this.UsedRecord.Amount;
				} else {
					return this.WeiXinAmount;
				}

			},
			// 可用卡券数量
			CanUseCardCount() {
				if (this.MemberCards && this.MemberCards.length > 0) {
					return this.MemberCards.filter(a => a.DiscountAmount > 0).length;
				} else {
					return 0;
				}
			},
			CardLimitSpan() {
				if (this.BusinessConfig.OrderConfig.CardLimitUseHours % 24 == 0) {
					return ' ' + (this.BusinessConfig.OrderConfig.CardLimitUseHours / 24) + ' 天';
				} else {
					return ' ' + this.BusinessConfig.OrderConfig.CardLimitUseHours + ' 小时';
				}
			},
		},
		onShow() {
			this.GoPayLoading = false;
			const me = this;
			this.LoadingNumber++;
			this.NeedMember(this).then(res => {
				this.NeedBusinessConfig(this).then(res => {
					this.NeedStore(this).then(res => {
						this.StoreCode = res.data.StoreCode;
						this.PageLoading = false;
						// setTimeout(()=>{this.PageLoading=false;},1000)
						this.BillLadding();
					}).finally(res => {
						this.LoadingNumber--
					})

					this.LoadingNumber++;
					GetStoredInfo({
						StoredCodeOrMemberCode: this.MemberCode,
						LockHours: this.BusinessConfig.OrderConfig.StoredGiftDelayHours
					}).then(res => {
						if (res.state == 200) {
							this.AccoutInfo = res.data
						} else {
							this.$showToast("会员储值账户信息加载失败！")
						}
					}).finally(res => {
						this.LoadingNumber--
					})
				})
			});
			// if(this.Member.BusinessCode=="8c61a6a4939e4e4095f9eb6ce4d363ad"){
			//     this.CanShare=0;
			// }
		},
		methods: {
			...mapActions(['NeedMember', 'NeedStore', 'NeedBusinessConfig', 'BusinessConfig', 'Member']),

			BillLadding() {
				this.LoadingNumber++;
				this.loadBill().then(res => {
					this.BillLoading = false;
					//setTimeout(()=>{this.BillLoading=false;},2000)
					if (this.editingBill == null) {
						this.LoadingNumber = 0;
						uni.navigateTo({
							url: '/pages/dishMenu/index'
						})
						return
					}
					if (this.CanShare) {
						// 加载会员储值及储值规则信息
						this.LoadingNumber++;
						this.loadStoredRule().then(res => {
							this.LoadingNumber--;
							this.StoredRuleLoading = false;
							// setTimeout(()=>{this.StoredRuleLoading=false;},3000)
						});
						// 加载会员卡券并设置默认选择卡券
						this.LoadingNumber++;
						this.loadBillCard().then(res => {
							this.LoadingNumber--;
							this.CardsLoading = false;
							// setTimeout(()=>{this.CardsLoading=false;},4000)
						});
						this.UseStored = true;
						this.UseCard = true;
						this.UseDiscount = true;
					} else {
						// 加载会员卡券并设置默认选择卡券
						this.LoadingNumber++;
						this.loadBillCard().then(res => {
							// 加载会员储值及储值规则信息
							this.loadStoredRule().then(res => {
								if (this.DiscountAmount > 0) {
									this.UseDiscount = true;
									this.UseCard = false;
									this.UseStored = false;
								} else if (this.UsedCard) {
									this.UseDiscount = false;
									this.UseStored = false;
									this.UseCard = true;
								} else {
									this.UseDiscount = false;
									this.UseCard = false;
									this.UseStored = true;
								}
								console.log('loadStoredRule', this.UseCard, this.UseStored);


								this.LoadingNumber--;
								this.StoredRuleLoading = false;
								// setTimeout(()=>{this.StoredRuleLoading=false;},3000)
							});
							this.CardsLoading = false;
						});
					}

					// 计算会员优惠金额
					// this.AccountDiscountAmount();
					this.LoadingNumber--;
				}).finally(res => {
					this.GoPayLoading = false;
				});
			},
			// 支付
			GoCheck() {
				if (this.UseStored && this.UsedRecord != null) {
					if (this.BusinessConfig.StoredMustPhoneSwitch && !this.Member.Phone) {
						this.ShowGetPhone = true;
						return;
					}
				}
				this.$showLoading();
				this.PayStepNumber++;
				GetBill({
					DeskID: this.DeskID,
					MemberCode: this.MemberCode
				}).then(res => {
					if (res.state == 200) {
						if (!this.editingBill) {
							this.$showToast("该消费已消台或已提交买单！")
							uni.reLaunch({
								url: '/pages/TimeOut/index'
							})
						} else if (this.editingBill.Amount != res.data.Amount) {
							this.$showToast("账单已发生变更，请重新结算！")
							this.BillLoading = true;
							this.StoredRuleLoading = true;
							this.CardsLoading = true;

							// this.CanDiscountAmount= 0; // 可优惠金额

							this.MemberCards = []; // 会员卡券列表
							this.UsedCard = null; // 使用的卡券

							this.StoredRecords = []; // 储值规则列表
							this.UsedRecord = null; // 使用的储值规则
							this.BillLadding();
						} else {
							// 校验是否有人已支付
							this.PayStepNumber++;
							BillCheckEffective({
								BillID: this.editingBill.BillID,
								MemberCode: this.Member.MemberCode
							}).then(res => {
								if (res.state == 200) {
									if (res.data.BillState == -1) {
										this.$showToast("网络开小差啦，请稍后重试！(State:" + res.state.BillState +
											")")
									} else if (res.data.BillState == 2) {
										this.$showToast("该消费已消台或已提交买单！")
										uni.reLaunch({
											url: '/pages/TimeOut/index'
										})
									} else if (res.data.CheckState == 2) {
										this.$showToast("已经有小伙伴买过单了哦！")
										uni.reLaunch({
											url: '/pages/TimeOut/index'
										})
									} else if (res.data.CheckState == 1) {
										this.$showToast("有小伙伴正在买过单了哦")
									} else if (res.data.WaitOrderCount != 0) {
										this.$showToast("您刚提交的订单还未处理，请稍后再试！")
										uni.reLaunch({
											url: '/pages/orderInfo/index'
										})
									} else {
										var CheckOrder = {
											StoreCode: this.editingBill.StoreCode,
											BillID: this.editingBill.BillID,
											MemberCode: this.MemberCode,
											Amount: this.editingBill.Amount,
											Items: [],
											DoRecharge: this.UsedRecord ? 1 : 0,
										};
										if (this.DiscountAmount > 0) {
											CheckOrder.Items.push({
												PaymentMethodCode: '会员优惠',
												PaymentMethodName: '会员优惠',
												PaymentAmount: this.DiscountAmount,
												PaymentCode: '',
												IntegralAmount: 0
											})
										}
										if (this.IntegralAmount > 0) {
											CheckOrder.Items.push({
												PaymentMethodCode: '积分抵现',
												PaymentMethodName: '积分抵现',
												PaymentAmount: this.IntegralAmount,
												PaymentCode: '',
												IntegralAmount: this.IntegralAmount * this
													.BusinessConfig.IntegralExchange
											})
										}
										if (this.CardAmount > 0) {
											CheckOrder.Items.push({
												PaymentMethodCode: '微信卡券',
												PaymentMethodName: '微信卡券',
												PaymentAmount: this.CardAmount,
												PaymentCode: this.UsedCard.MemberCardCode,
												IntegralAmount: 0
											})
										}
										if (this.StoredAmount > 0) {
											CheckOrder.Items.push({
												PaymentMethodCode: '微信储值',
												PaymentMethodName: '微信储值',
												PaymentAmount: this.StoredAmount,
												PaymentCode: '',
												IntegralAmount: 0
											})
										}
										if (this.WeiXinAmount > 0) {
											CheckOrder.Items.push({
												PaymentMethodCode: '微信支付',
												PaymentMethodName: '微信支付',
												PaymentAmount: this.WeiXinAmount,
												PaymentCode: this.editingBill.BillID,
												IntegralAmount: 0
											})
										}
										if (this.NeedPayAmount == 0) {
											CheckOrder.PayState = 1
										} else {
											CheckOrder.PayState = 0
										}
										console.log('CheckOrder', CheckOrder, JSON.stringify(CheckOrder));
										this.PayStepNumber++;
										CreateCheckOrder(CheckOrder).then(res => {
											if (res.state != 200) {
												console.warn('CreateCheckOrder.error', res);
												this.$showToast(res.msg)
											} else {
												var CheckOrderCode = res.data; // 结帐单号
												console.log('CheckOrderCode', CheckOrderCode);
												// 无需支付
												if (this.NeedPayAmount == 0) {
													// 跳转到评价
													// this.$router.push({
													// 	name: 'comment',
													// 	query: {
													// 		BillID: this.editingBill.BillID
													// 	}
													// });
												} else {
													//判断是否需要充值
													if (this.UseStored && this.UsedRecord !=
														null) {
														//需要充值
														var Recharge = {
															MemberCodeOrStoredCode: this
																.MemberCode,
															TaskKey: '储值充值并结账：' +
																CheckOrderCode,
															RecordType: '充值',
															TradePrincipal: this.UsedRecord
																.Amount,
															TradeGift: this.UsedRecord
																.GiveAmount,
															OperName: '自主充值',
															TradeState: 0,
															StoreCode: this.editingBill
																.StoreCode,
															BillCode: this.editingBill
																.BillCode,
															SceneID: '充值并结账',
															SceneContent: '充值' + this
																.UsedRecord.Amount + '赠送' +
																this.UsedRecord.GiveAmount +
																'结余' + parseInt((this.Member
																	.StoredBalance * 100 +
																	this.UsedRecord
																	.Amount * 100 + this
																	.UsedRecord
																	.GiveAmount * 100 -
																	this.StoredAmount * 100
																) / 100),
															CheckOrderCode: CheckOrderCode,
															PayList: [{
																PayMethod: '微信',
																Amount: this.UsedRecord
																	.Amount,
																DataCode: CheckOrderCode,
																Remark: '关联账单：' + this
																	.editingBill
																	.BillCode
															}]
														}
														console.log('Recharge', Recharge);
														this.PayStepNumber++;
														CreateRecharge(Recharge).then(res => {
																if (res.state != 200) {
																	console.warn(
																		'Recharge.error',
																		res);
																} else {
																	var StoredRecordCode = res
																		.data; // 结帐单号 

																	this.GoPay('储值充值', null,
																		StoredRecordCode);
																}
															}).catch(res => {
																console.warn('Recharge.catch',
																	res);
																this.$showToast(res)
															})
															.finally(() => {
																this.PayStepNumber--;
															})
													} else {
														// 不需要充值
														this.GoPay('堂食结账', CheckOrderCode, null);
													}
												}
											}
										}).catch(res => {
											console.warn('CreateCheckOrder.catch', res);
											this.$showToast(res)
										}).finally(res => {
											this.GoPayLoading = false;
											this.PayStepNumber--;
										})
									}
								} else {
									this.$showToast("网络开小差啦，请稍后重试！" + res.msg)
								}
							}).catch(err => {
								this.$showToast("网络开小差啦，请稍后重试！")
							}).finally(res => {
								this.PayStepNumber--;
							});
						}
					} else {
						console.log('GetBill.error', res);
						this.$showToast("请求错误：" + res, )
					}
				}).catch(res => {
					console.log('GetBill.catch', res);
					this.$showToast("执行错误：" + res)
				}).finally(res => {
					this.GoPayLoading = false;
					this.$hideLoading();
				});
			},
			GoPay(SceneType, CheckOrderCode, StoredRecordCode) {
				var PayOrder = {
					BusinessCode: this.Member.BusinessCode,
					StoreCode: this.editingBill.StoreCode,
					MemberCode: this.MemberCode,
					SceneType: SceneType,
					Amount: this.NeedPayAmount,
					BillID: this.editingBill.BillID,
					CheckOrderCode: CheckOrderCode,
					StoredRecordCode: StoredRecordCode,
					PayCallBackOpenIDUrl: window.location.origin + '/check-pay'
				}
				console.log('PayOrder', PayOrder);
				this.PayStepNumber++;
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
					.finally(() => {
						this.PayStepNumber--;
					})
			},

			loadBill() {
				return new Promise((resolve, reject) => {
					var paramer = {};
					paramer.DeskID = this.DeskID;
					paramer.MemberCode = this.MemberCode;
					GetBill(paramer).then(res => {
						if (res.state == 200) {
							this.editingBill = res.data;
							resolve(res);
						} else {
							console.log('GetBill.error', res);
							this.PushErrorPage(res);
							reject(res);
						}
					}).catch(res => {
						console.log('GetBill.catch', res);
						reject(res);
					}).finally(res => {});
				});
			},
			loadMemberInfo() {
				return new Promise((resolve, reject) => {
					var paramer = {};
					paramer.MemberCodeOrOpenID = this.MemberCode;
					GetMember(paramer).then(res => {
						if (res.state == 200) {
							this.Member = res.data;
							resolve(res);
						} else {
							console.log('GetMember.error', res);
							this.PushErrorPage(res);
							reject(res);
						}
					}).catch(res => {
						console.log('GetMember.catch', res);
						reject(res);
					}).finally(res => {});
				});
			},
			loadStoredRule() {
				return new Promise((resolve, reject) => {
					var paramer = {};
					paramer.BusinessCode = this.Member.BusinessCode;
					paramer.StoreCode = this.StoreCode;
					GetStoredRuleActive(paramer).then(res => {
						if (res.state == 200) {
							if (res.StoredSwitch == 1) {
								this.StoredRecords = res.data;
							} else {
								//储值未开启，现有储值余额可用
							}
							resolve(res);
						} else {
							console.log('GetStoredRuleActive.error', res);
							this.PushErrorPage(res);
							reject(res);
						}
					}).catch(res => {
						console.log('GetStoredRuleActive.catch', res);
						reject(res);
					}).finally(res => {});
				});
			},
			loadBillCard() {
				return new Promise((resolve, reject) => {
					var paramer = {};
					paramer.MemberCode = this.MemberCode;
					paramer.BillID = this.editingBill.BillID;
					paramer.CardLimitUseHours = this.BusinessConfig.OrderConfig.CardLimitUseHours;
					// paramer.CardLimitUseHours = this.BusinessConfig.OrderConfig.CardLimitUseNumber;
					GetBillCard(paramer).then(res => {
						if (res.state == 200) {
							this.CardUseCount = res.CardUseCount;
							if (this.CardUseLimitState) {
								var TuiJian = true;
								res.data.forEach(card => {
									card.Switch = card.DiscountAmount > 0;
									if (!this.UsedCard && card.Switch) {
										card.TuiJian = TuiJian;
										if (this.CanShare || this.DiscountAmount == 0) {
											this.UsedCard = card;
										}
									}
									if (TuiJian) {
										TuiJian = false;
									}
								});
							}
							this.MemberCards = res.data;
							// if(this.MemberCards&&this.MemberCards.length>0&&this.MemberCards[0].DiscountAmount>0){
							//   this.UsedCard=this.MemberCards[0];
							// }
							resolve(res);
						} else {
							console.log('GetBillCard.error', res);
							this.PushErrorPage(res);
							reject(res);
						}
					}).catch(res => {
						console.log('GetBillCard.catch', res);
						console.log('GetBillCard.catch', res);
						reject(res);
					}).finally(res => {});
				});
			},
			ChangeCard(card) {
				if (!card) {
					if (this.UseCard) {
						this.UseCard = false;
						this.UsedCard = null;
					} else {
						this.cardvisibale = !this.cardvisibale
					}
				} else if (card.Switch) {
					this.UsedCard = this.UsedCard == this.card ? null : card.DiscountAmount != 0 ? card : this.UsedCard;
					if (!this.CanShare) {
						this.UseDiscount = false;
						this.UseStored = false;
					}
					this.UseCard = true;
					this.UsedCard = card;
				}
			},
			ChangeStored(val) {
				this.UseStored = val;
				if (this.UseStored && !this.CanShare) {
					this.UseDiscount = false;
					this.UseCard = false;
					this.UsedCard = null;
				}
			},
			ChangeDiscount() {
				this.UseDiscount = !this.UseDiscount;
				if (this.UseDiscount && !this.CanShare) {
					this.UseStored = false;
					this.UseCard = false;
					this.UsedCard = null;
				}
			},
			// 核算会员优惠金额
			// AccountDiscountAmount() {
			//     let amount = 0;
			//     this.editingBill.Items.forEach(dish => {
			//         amount += (dish.DishPrice - dish.MemberPrice) * dish.Number;
			//     });
			//     this.CanDiscountAmount = amount;
			// },
			// 使用储值切换
			useSave() {
				this.pay.save.usesave = !this.pay.save.usesave;
			},
			selectStoredRecord(record) {
				this.UsedRecord = record;
			},
			// 选择储值充值
			selectSave(index) {
				this.pay.save.selectsave = index;
			},

			PushErrorPage(res) {
				uni.navigateTo({
					url: '/pages/error/index?Msg=' + res.state + '-' + res.msg,
				})
			},
			GetPhoneCallBack(res) {
				this.ShowGetPhone = false;
				this.GoPayLoading = false;
				console.log('GetPhoneCallBack', res);
				if (res.state) {
					// 继续执行充值
					this.GoCheck();
				}
			},
		},
		watch: {
			LoadingNumber(newValue, oldValue) {
				if (newValue > 0) {
					this.$showLoading()
				} else {
					this.$hideLoading()
				}
			},
			// UseCard(newVal,oldVal){
			//   if(!this.CanShare && this.OnStored&&newVal){
			//     this.OnStored=false
			//   }
			//   this.OnCard=newVal;
			//   console.log('UsedCard',this.CanShare,this.OnCard,this.OnStored);
			// },
			// UseStored(newVal,oldVal){
			//   if(!this.CanShare && this.OnCard&&newVal){
			//     this.OnCard=false
			//   }
			//   this.OnStored=newVal;
			//   console.log('UseStored',this.CanShare,this.OnCard,this.OnStored);
			// }
		},
	}
</script>

<style scoped>
	.fadeInUp-enter-active {
		-webkit-transition: all .3s;
		-moz-transition: all .3s;
		-ms-transition: all .3s;
		-o-transition: all .3s;
		transition: all .3s;
	}

	.fadeInUp-enter,
	.fadeInUp-leave-to {
		opacity: 0;
	}

	.member-cards {
		position: fixed;
		left: 0px;
		right: 0px;
		bottom: 0px;
		background: white;
		height: 0px;
		display: none;
		z-index: 1;
	}

	.member-cards.active {
		height: 480px;
		display: block;
		border-top-left-radius: 10px;
		border-top-right-radius: 10px;
	}

	.title-box {
		height: 50px;
		line-height: 50px;
		text-align: center;
		border-bottom: 1px solid #ede;
	}

	.member-cards .clear {
		position: absolute;
		right: 10px;
		top: 0px;
		width: 50px;
		height: 50px;
		font-size: 12px;
	}

	.member-cards .list {
		overflow-y: scroll;
		position: absolute;
		bottom: 0;
		top: 50px;
		width: 100%;
	}

	.member-cards .list li {
		padding: 0 10px;
		position: relative;
		font-size: 12px;
		clear: both;
		border-bottom: solid 1px #ede;
	}

	.member-cards .list li .icon {
		position: absolute;
		left: 10px;
		top: 22px;
		background: #777;
		border-radius: 50%;
		width: 18px;
		height: 18px;
		display: inline-block;
		line-height: 18px;
		text-align: center;
		font-family: "iconfont" !important;
		color: white;
		color: #fff;
		font-size: 10px;
		text-align: center;
		opacity: 0;
	}

	.member-cards .list li .icon::before {
		content: "\e61d";
	}

	.member-cards .list li .icon.active {
		background: #ffbb05;
		opacity: 1;
	}

	.member-cards .list li .cardname {
		font-weight: bold;
		line-height: 30px;
	}

	.member-cards .list li .tuijian {
		background: rgba(86, 161, 247, 0.815);
		color: rgba(0, 47, 255, 0.932);
		padding: 0 5px;
		margin-left: 10px;
	}

	.member-cards .list li .content {
		padding: 10px 0
	}

	.member-cards .list li .content.youxiao {
		padding-left: 30px;
	}

	.member-cards .list li .discount {
		position: absolute;
		right: 10px;
		top: 22px;
	}


	.bg {
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background: black;
		opacity: 0.5;
	}

	.Box {
		border-radius: 10px;
		margin: 15px 15px 0;
		background: white;
		padding: 10px;
		line-height: 40px;
	}

	/* pay-btn-box end */
</style>
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

	@mixin transition($time) {
		-webkit-transition: all $time;
		-moz-transition: all $time;
		-ms-transition: all $time;
		-o-transition: all $time;
		transition: all $time;
	}

	.container {
		background: #f2f2f6;
		padding-bottom: 70px;
	}

	/* order-price */
	.order-price {
		height: 45px;
		line-height: 45px;
		padding: 0 10px;
		background: #fff;

		.price {
			font-size: 16px;
			color: $red;
			display: inline-block;
			float: right;
		}
	}

	/* order-price end */
	/* pay-msg */
	.pay-msg {
		padding: 0 10px;
		background: #fff;

		.pay-msg-item {
			border-bottom: 1px solid $border;
			overflow: hidden;
			display: block;

			.title {
				// height: 45px;
				line-height: 45px;
				font-size: 14px;
				float: left;
			}

			.num {
				height: 45px;
				line-height: 45px;
				float: right;
				font-size: 14px;
			}

			.yue {
				float: left;
			}
		}

		.member {
			.num {
				color: $red;
			}
		}

		.select {
			float: left;
			line-height: 18px;
			width: 18px;
			height: 18px;
			text-align: center;
			margin-top: 13px;
			font-size: 10px;
			background-color: gray;
			position: relative;

			margin-right: 5px;
			@include border-radius(50%);

			i {
				color: #fff;
				font-size: 10px;
				width: 18px;
				height: 18px;
				position: absolute;
				top: 0;
				left: 0;
			}
		}

		.active {
			background: $main;
		}

		.save {
			border-bottom: 0;

			.select-box {
				// height: 45px;
				line-height: 45px;
				float: left;
				width: 100%;


				.text {
					padding: 13px 0 15px;
					line-height: 20px;
					font-size: 14px;
					float: left;
					// width:60px;
				}

				.locktext {
					font-size: 14px;
					text-indent: 3em;
					clear: both;
					line-height: 20px;
				}

				.locktext span {
					font-size: 12px;
				}

				.active {
					background: $main;
				}
			}
		}
	}

	.errorfont {
		color: $main;
	}

	/* pay-msg end */
	/* save-box */
	.save-box {
		padding: 10px;

		.save-list {
			height: 200px;
			overflow: scroll;
			background: #f2f2f6;
			border-radius: 5px;

			li {
				width: 33.33%;
				float: left;
				padding: 5px;
			}

			.item {
				width: 100%;
				height: 65px;
				border: 1px solid #dadada;
				position: relative;
				padding-top: 15px;
				background: #fff;
				text-align: center;
				@include border-radius(5px);

				.title {
					font-size: 16px;
					line-height: 1;
					text-align: center;
				}

				.text {
					font-size: 12px;
					line-height: 1;
					text-align: center;
					margin-top: 5px;
					color: $grey;

					.num {
						color: $red;
					}
				}

				.select {
					width: 27px;
					position: absolute;
					right: -1px;
					top: -1px;
					opacity: 0;
					@include transition(.3s);

					img {
						width: 100%;
						display: block;
					}
				}
			}

			.item:first {
				padding-top: 5px;
			}

			.active {
				.item {
					border-color: $main;

					.select {
						opacity: 1;
					}
				}
			}
		}

		.data {
			margin-top: 25px;
			font-size: 14px;
			line-height: 1;
		}

		.score {
			font-size: 14px;
			line-height: 1;
			margin-top: 15px;
		}

		.give-coupon {
			margin-top: 15px;

			>.title {
				font-size: 14px;
				line-height: 1;
				margin-top: 15px;
			}

			.coupon-list {
				margin-top: 15px;

				li {
					margin-top: 10px;
				}

				.item {
					height: 110px;
					padding-right: 60px;
					position: relative;

					.msg {
						width: 100%;
						height: 110px;
						background: #fff;
						padding: 10px;
						@include border-radius(10px);
						-webkit-box-shadow: 0 0 3px 0 rgba(0, 0, 0, .1);
						-moz-box-shadow: 0 0 3px 0 rgba(0, 0, 0, .1);
						box-shadow: 0 0 3px 0 rgba(0, 0, 0, .1);

						.img {
							width: 90px;
							height: 90px;
							float: left;
							overflow: hidden;
							@include border-radius(5px);

							img {
								width: 100%;
								display: block;
							}
						}

						.text-box {
							margin-left: 100px;
							padding-top: 10px;

							.title {
								font-size: 14px;
								line-height: 1;
								margin-bottom: 20px;
							}

							.condition {
								font-size: 12px;
								color: $grey;
								line-height: 1;
							}

							.date {
								font-size: 12px;
								color: $grey;
								margin-top: 10px;
								line-height: 1;
							}
						}
					}

					.int {
						width: 60px;
						height: 100%;
						text-align: center;
						background: #fff;
						@include border-radius(10px);
						position: absolute;
						right: 0;
						top: 0;
						-webkit-box-shadow: 0 0 3px 0 rgba(0, 0, 0, .1);
						-moz-box-shadow: 0 0 3px 0 rgba(0, 0, 0, .1);
						box-shadow: 0 0 3px 0 rgba(0, 0, 0, .1);

						&:before {
							content: '';
							height: 90px;
							border-left: 1px dashed #e6e6ea;
							position: absolute;
							left: 0;
							top: 10px;
						}

						p {
							width: 60px;
							height: 110px;
							text-align: center;
							line-height: 60px;
							// -webkit-writing-mode: vertical-rl;
							-ms-writing-mode: bt-rl;
							// writing-mode: vertical-rl;
							padding-top: 25px;
							font-size: 12px;
							color: $grey;
						}
					}
				}
			}
		}
	}

	/* save-box end */
	/* pay-btn-box */
	.pay-btn-box {
		padding: 10px;
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background: #f2f2f6;

		.pay-btn {
			width: 100%;
			height: 50px;
			@include border-radius(25px);
			-webkit-box-shadow: 0 0 3px 0 rgba(0, 0, 0, .1);
			-moz-box-shadow: 0 0 3px 0 rgba(0, 0, 0, .1);
			box-shadow: 0 0 3px 0 rgba(0, 0, 0, .1);
			overflow: hidden;
			background: #fff;
			position: relative;

			.text-box {
				line-height: 50px;
				float: left;
				margin-left: 20px;

				.text {
					display: inline-block;
				}

				.num {
					font-size: 16px;
					color: $red;
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
		}
	}


	/* pay-btn-box end */
</style>
