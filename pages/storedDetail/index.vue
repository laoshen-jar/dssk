<template>
	<div class="container">
		<!-- consume -->
		<div class="consume-box">
			<div class="consume">
				<div class="consume-cot">
					<div class="num" v-if="Member.StoredBalance!=null">￥{{Member.StoredBalance}}</div>
					<p class="num" v-else>--</p>
					<p class="text">可用金额</p>
					<!-- <p class="text" v-if="AccoutInfo&&AccoutInfo.LockAmount>0">其中 {{AccoutInfo.LockAmount}} 元 {{BusinessConfig.OrderConfig.StoredGiftDelayHours}} 小时后可用</p> -->
				</div>
				<div class="excharge" @click="handleJump" v-if="BusinessConfig.EntryConfig.StoredRetrieveEntrySwitch">
					<p class="text">找回余额</p>
					<iconfont class="iconfont" icon="iconjiantou-b-copy-l" />
				</div>
				<div class="excharge" style="top:80px" v-if="BusinessConfig.EntryConfig.StoredRechargeEntrySwitch">
					<router-link to="/member/recharge">
						<p class="text">立即充值</p>
						<iconfont class="iconfont" icon="iconjiantou-b-copy-l" />
					</router-link>
				</div>
			</div>
		</div>
		<!-- consume end -->
		<!-- consume-record -->
		<div class="consume-record" ref="wrapper">
			<!-- 上拉加载事件:bottom-method="loadBottom" -->
			<load-refresh :currentPage="StoredRecords.length" :totalPages="count" @refresh="loadBottom" ref="loadRefresh"
				v-if="StoredRecords.length>0">
				<div slot="content-list">
					<ul class="record-list">
						<li class="consume-record-item" v-for="(item,index) in StoredRecords" :key="index">
							<div class="text-box">
								<!-- <h6 class="title">{{item.StoreName?item.StoreName:"线上充值"}}</h6> -->
								<h6 class="title">{{item.StoreName?item.StoreName:item.SceneID}}<span class="label"
										v-if="item.TradeState==0">支付中</span></h6>
								<p class="time">{{dateFormart(item.CreateTime,'YYYY-MM-DD HH:mm:ss')}}</p>
							</div>
							<div class="data-box">
								<div class="data" v-if="item.RecordType=='充值'">
									<span class="change active">+ {{item.TradePrincipal}}</span>
									<span class="give" v-if="item.TradeGift>0">赠 {{item.TradeGift}}</span>
								</div>
								<div class="data" v-if="item.RecordType=='消费'">
									<span class="change xiaofei">- {{item.TradeAmount}}</span>
								</div>
								<!-- <p class="state">{{item.RecordType}}</p> -->
								<p class="state" v-if="item.TradeState!=0">余额
									{{parseInt((item.PrincipalBalance+item.GiftBalance)*100)/100}}
								</p>
							</div>
						</li>
					
					</ul>
					<p v-if="allLoaded==false" style="font-size:12px;color:#777777;text-align:center;margin-top:12px"
						@click="loadBottom">点击加载更多</p>
				</div>
			</load-refresh>
			<NoDate v-if="StoredRecords.length==0" showtext="暂无充值记录" />
		</div>
		<!-- activicity -->
		<!-- activicity end -->

		<!-- consume-record end -->
	</div>
</template>

<script>
	import {
		GetStoredRecord
	} from "@/api/stored"
	import NoDate from "@/components/NoDate.vue"
	import loadRefresh from '@/components/load-refresh/load-refresh.vue';
	import {
		mapActions,
		mapGetters
	} from "vuex"
	import moment from "moment"
	export default {
		name: 'consume',
		components: {
			NoDate,
			loadRefresh
		},
		data() {
			return {
				LoadingNumber: 0,
				consume: {
					"currentmoney": 10000,
					"globalexcharge": 520,
					"globalconsume": 320,
				}, // 积分对象
				StoredRecords: [], //当前会员储值记录
				AccoutInfo: {}, //会员储值账户信息
				allLoaded: false, // 是否全部加载
				isAutoFill: false, // 自动上拉加载一次
				wrapperHeight: 0, // 滚动区域高度
				count: null,
				pageNo: 1,
			}
		},
		computed: {
			...mapGetters(["MemberCode", "StoreCode", "DeskID", "Member", "BusinessConfig"])
		},
		created() {
			this.LoadingNumber++;
			// 请求数据
			var params = {}
			params.MemberCodeOrStoredCode = this.MemberCode
			params.StartTime = "2018-01-01 00:00:00"
			params.EndTime = moment().format('YYYY-MM-DD HH:mm:ss')
			params.pageNo = this.pageNo
			params.pageSize = 10;
			params.TradeOK = 1;
			params.sortOrder = "descend";
			params.NoSummary = 1;
			GetStoredRecord(params).then(res => {
				if (res.state == 200) {
					this.StoredRecords = res.data || [];
					this.count = res.count;
					if (this.StoredRecords.length == this.count) {
						this.allLoaded = true; // 数据已全部获取完毕
					}
				} else {
					this.$showToast("会员储值记录加载失败！")
				}
			}).finally(res => {
				this.LoadingNumber--
			});
			// this.LoadingNumber++;
			// GetStoredInfo({StoredCodeOrMemberCode:this.MemberCode,LockHours:this.BusinessConfig.OrderConfig.StoredGiftDelayHours}).then(res => {
			//     if (res.state == 200) {
			//         this.AccoutInfo = res.data
			//     } else {
			//         Toast({
			//             message: "会员储值账户信息加载失败！",
			//             position: "middle",
			//             duration: 2000
			//         });

			//     }
			// }).finally(res=>{this.LoadingNumber--})
		},
		methods: {
			//绑定实体卡跳转
			handleJump() {
				this.$router.push({
					name: 'BindStep1',
					query: {
						MemberCode: this.MemberCode
					}
				})
			},
			//封装函数：
			dateFormart(time, formart) {
				return moment(time).format(formart);
			},
			// 触底加载
			loadBottom() {
				if (this.StoredRecords.length < this.count) {
					var parameter = {};
					var pageCount = Math.ceil(this.count / 6);
					parameter.MemberCodeOrStoredCode = this.MemberCode
					parameter.StartTime = "2018-01-01 00:00:00"
					parameter.EndTime = moment().format('YYYY-MM-DD HH:mm:ss')
					if (this.pageNo < pageCount) {
						this.pageNo = this.pageNo + 1;
					}
					parameter.pageNo = this.pageNo;
					parameter.pageSize = 10;
					parameter.TradeOK = 1;
					parameter.sortOrder = "descend";
					parameter.NoSummary = 1;
					GetStoredRecord(parameter)
						.then(res => {
							console.log("加载更多", res.data);
							res.data.forEach(item => {
								this.StoredRecords.push(item);
							});
							if (this.StoredRecords.length >= this.count) {
								this.allLoaded = true; // 数据已全部获取完毕
							}
							console.log("res", res);
							console.log("parameter", parameter);
							this.$refs.loadRefresh.completed()
						})
						.catch(err => {
							this.$refs.loadRefresh.completed();
							console.log(err)
						});
				}
			},
		},
		watch: {
			LoadingNumber(newValue, oldValue) {
				if (newValue != 0 && oldValue == 0) {
					this.$showLoading();
				} else if (newValue == 0 && oldValue != 0) {
					uni.hideLoading()
				}
			},
		},
	}
</script>

<style lang="scss" scoped>
	$main: #ffbb05;
	$red: #ff423e;
	$border: #e6e6ea;
	$grey: #777;
	$glod:#b6986a;
	$green: #09bb07;

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

	.label {
		height: 20px;
		width: 100%;
		background-color: #409EFF;
		color: #fff;
		padding: 2px 5px;
		margin-left: 5px;
		border-radius: 3px;
		font-size: 10px;
	}

	/* consume-box */
	.consume-box {
		height: 110px;
		background: -webkit-linear-gradient(#f2980b, #ffbb05);
		/* Safari 5.1 - 6.0 */
		background: -o-linear-gradient(#f2980b, #ffbb05);
		/* Opera 11.1 - 12.0 */
		background: -moz-linear-gradient(#f2980b, #ffbb05);
		/* Firefox 3.6 - 15 */
		background: linear-gradient(#f2980b, #ffbb05);
		/* 标准的语法 */
		position: relative;

		.consume {
			height: 85px;
			padding-top: 25px;
			text-align: center;

			.consume-cot {
				.num {
					font-size: 20px;
					color: #fff;
				}

				.text {
					font-size: 12px;
					color: #fff;
					margin-top: 5px;
				}
			}

			.excharge {
				position: absolute;
				right: 10px;
				top: 15px;
				color: #fff;
				font-size: 12px;

				.text {
					display: inline-block;
				}

				i {
					font-size: 10px;
				}
			}
		}

		.global-box {
			width: 100%;
			height: 30px;

			.item {
				width: 50%;
				height: 100%;
				line-height: 29px;
				text-align: center;
				float: left;
				font-size: 12px;
				color: #fff;
				border-top: 1px solid #f9bf54;

				&:first-child {
					border-right: 1px solid #f9bf54;
				}
			}
		}
	}

	/* consume-box end */
	/* consume-record */
	.consume-record {
		padding: 10px;
		overflow: scroll;

		.consume-record-item {
			background: #fff;
			@include border-radius(5px);
			height: 65px;
			padding: 15px 15px 0;
			margin-top: 10px;

			&:nth-child(1) {
				margin-top: 0;
			}

			.text-box {
				float: left;

				.title {
					font-size: 14px;
					line-height: 1;
				}

				.time {
					font-size: 12px;
					line-height: 1;
					margin-top: 10px;
				}
			}

			.data-box {
				float: right;
				text-align: right;

				.data {
					height: 14px;

					.change,
					.give {
						font-size: 14px;
						line-height: 1;
						color: $green;
						margin-left: 5px;
					}

					.xiaofei {
						color: $red;
					}
				}

				.state {
					font-size: 12px;
					line-height: 1;
					margin-top: 10px;
				}
			}
		}
	}

	/* consume-record end */
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
