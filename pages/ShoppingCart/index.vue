<template>
	<div class="container">
		<!-- order-msg -->
		<div class="order-msg Box" v-if="!AddDish">
			<div class="table order-msg-item">
				<div class="text-box">
					<p class="text" v-if="EditingOrder && EditingOrder.DeskID">
						台位：{{ EditingOrder.DeskName }}
					</p>
					<p class="text" v-else>台位：请扫码下单</p>
				</div>
				<!-- <div class="btn change-table">换台</div> -->
			</div>
			<div class="num order-msg-item">
				<div class="text-box">
					<p class="text">
						人数：{{ EditingOrder != null ? (EditingOrder.Person==0?'20+':EditingOrder.Person) : "" }}
					</p>
				</div>
				<div class="btn change-table" @click="showDinerNum">
					更改人数
				</div>
			</div>
		</div>
		<div class="order-msg Box" v-if="AddDish">
			<div class="table order-msg-item">
				<div class="text-box">
					<p class="text">
						台位：{{ EditingOrder != null ? EditingOrder.DeskName : "" }}
					</p>
				</div>
				<div class="text-box" style="float: right; padding-right: 5px;">
					<p class="text">
						人数：{{ EditingOrder != null ? EditingOrder.Person : "" }}
					</p>
				</div>
			</div>
		</div>
		<!-- order-msg end -->
		<!-- order-list -->
		<div class="order-list-box Box">
			<div class="add">
				<image class="img" :src="staticUrl + 'images/add.png'" @click="continueMenu" style="">加菜</image>
			</div>
			<div class="order-list" ref="dishs">
				<ul class="list">
					<li v-for="(dish, index) in EditingOrder != null
              ? EditingOrder.Items
              : []" :key="index">
						<div class="dishinfo">
							<h6 class="title">{{ dish.DishName }}</h6>
							<span class="memberprice" v-if="dish.MemberPrice != dish.DishPrice">￥{{ dish.MemberPrice }}
								{{ dish.Unit?'/':'' }} {{ dish.Unit }}</span>
							<span class="price del" v-if="dish.MemberPrice != dish.DishPrice">￥{{ dish.DishPrice }}
								{{ dish.Unit?'/':'' }} {{ dish.Unit }}</span>
							<span class="price"
								v-if="dish.MemberPrice == dish.DishPrice">￥{{ dish.DishPrice?dish.DishPrice:dish.MemberPrice }}
								{{ dish.Unit?'/':'' }} {{ dish.Unit }}</span>
							<div class="cartcontrol">
								<div class="jian" @click.stop.prevent="TakeCart(dish, false)">
									<iconfont class="iconfont" icon="iconjianhao" size="12px" />
								</div>
								<div class="cart-count number">{{ dish.Number }}</div>
								<div class="icon-add_circle jia" @click.stop.prevent="TakeCart(dish, true)">
									<iconfont class="iconfont" icon="iconjiajianzujianjiahao" size="12px" />
								</div>
							</div>
						</div>
						<div class="dishremark"
							v-if="dish.BaseNumber != 1 || dish.IsWeigh==1||dish.MakeMethods||dish.Flavors">
							<span v-if="dish.IsWeigh==1">[ 称重菜品 ]</span>
							<span v-if="dish.BaseNumber!=1">[{{ dish.BaseNumber }}{{dish.Unit}}起点]</span>
							<span
								v-if="dish.MakeMethods||dish.Flavors">{{dish.MakeMethods+(dish.MakeMethods&&dish.MakeMethods.length>0?'、':'')+dish.Flavors}}</span>
						</div>
					</li>
				</ul>
			</div>
		</div>

		<div class="Box" v-if="Member.BusinessCode!='c5e6baa9861e452dbd420bc16721e474'">
			<div class="flvaor">
				<div class="flvaor-cot">
					<h6 class="title">备注：</h6>
					<div class="text" v-if="EditingOrder">
						<span v-for="(item,index) in flavorlist.filter(a=>a.selected)" :key="index"
							:class="[Vshow(item.selected)]">{{item.text}}{{index+1==flavorlist.filter(a=>a.selected).length?'':'，'}}</span>
					</div>
					<div class="btn change-table" v-if="flavorlist&&flavorlist.length>0" @click="flavorPopup">快速选择</div>
				</div>
				<div style="position: relative;">
					<textarea id="remarktextarea" maxlength="20" v-model="RemarkTextarea" style="
              border-radius: 5px;
              background: #f7f7f7;
              width: 100%;
              border: none;
              height: 70px;
              font-size:12px;
              padding:10px;" placeholder="输入备注，最多20个字哦"
						@keyup="texLength('remarktextarea', 20, 'textarea_length')"></textarea>
					<div style="position: absolute;
              font-size: 12px;
              bottom: 10px;
              right: 10px;
              color: #bbbbbb;"><span id="textarea_length">0</span> / <span class="num_count">20</span></div>
				</div>
			</div>

		</div>
		<div class="confirm-order-btn-box">
			<div class="confirm-order-btn">
				<div class="text-box">
					<p class="text">合计：</p>
					<p class="num" style="color:initial;font-size: 14px;margin-right: 15px;">
						{{ EditingOrder != null ? EditingOrder.DishCount : "0" }} 份
					</p>
					<p class="num" v-if="!HiddenOrderAmount">
						￥{{ EditingOrder != null ? EditingOrder.Amount : "" }}
					</p>
				</div>
				<div class="btn " v-if="EditingOrder && EditingOrder.DeskID" @click="takePutOrder">
					确认下单
				</div>
				<div class="btn " v-if="(!EditingOrder || !EditingOrder.DeskID)" @click="takeScanAndPutOrder">
					扫码下单
				</div>
			</div>
		</div>
		<!-- orderpopup -->
		<transition name="fade">
			<div class="orderpopup" :class="[Vshow(orderpopup)]">
				<div class="popup-cot">
					<h6 class="title">提示</h6>
					<p class="text">请确认信息无误？</p>
					<div class="btn-group">
						<ul class="list clearfix">
							<li style="width:50%; float:left;">
								<div class="btn cancle" @click="orderpopup=false">取消</div>
							</li>
							<li style="width:50%;float:left;">
								<div class="btn confirm" v-if="EditingOrder && EditingOrder.DeskID"
									@click="takePutOrder">
									确认下单
								</div>
								<div class="btn confirm" v-else @click="takeScanAndPutOrder">
									扫码下单
								</div>
							</li>
						</ul>
					</div>
				</div>
				<div class="bg" @click="orderpopup=false"></div>
			</div>
		</transition>
		<!-- orderpopup end -->
		<transition name="fade">
			<div class="diner-num" :class="[Vshow(dinershow)]">
				<div class="diner-num-cot">
					<h6 class="title">请选择就餐人数</h6>
					<ul class="clearfix">
						<li v-for="(item, index) in PersonOptionCount" :class="{ active: PersonNumber === item }"
							:key="index" @click="selectDinerNum(item)">
							<div class="cot">{{ item }}</div>
						</li>
						<li v-if="PersonOptionCount==19" @click="selectDinerNum(0)"
							:class="{ active: PersonNumber === 0 }">
							<div class="cot">20+</div>
						</li>
						<li v-else>
							<div class="cot" @click="PersonOptionCount=20">更多</div>
						</li>
					</ul>
					<button type="button" class="confirm" @click="confirmDinerNum">
						确认
					</button>
				</div>
			</div>
		</transition>

		<transition name="fade">
			<div class="flavorpopup" :class="[Vshow(flavorpopup)]">
				<div class="popup-cot" v-if="flavorpopup">
					<h6 class="title">请选择口味<span v-if="BusinessConfig.OrderConfig.RemarkCanMultiple==1"> - 多选</span>
					</h6>
					<div class="flavor-list">
						<ul class="clearfix">
							<li v-for="(item, index) in flavorlist" :key="index" :class="item.selected ? 'active' : ''"
								@click="selectFlavor(index)">
								<div class="item">{{ item.text }}</div>
							</li>
						</ul>
					</div>
					<div class="btn-group">
						<ul class="list clearfix">
							<li class="allline" style="margin: 10px auto 0;width: 160px !important;">
								<div class="btn confirm" @click="flavorPopupConfirm">
									确认
								</div>
							</li>
						</ul>
					</div>
				</div>
				<div class="bg"></div>
			</div>
		</transition>

		<div class="barragesBox">
			<div class="barrageitemline" v-for="(bitem) in marqueeMsgs" :key="bitem.id" :class="[Vshow(bitem.show)]">
				<div class="barrageitem">
					<div class="head"
						:style="'background:url('+bitem.avatar+') no-repeat center;background-size: cover;'"></div>
					<div class="info">{{bitem.msg}}</div>
				</div>
			</div>
		</div>

		<!-- order-list end -->
	</div>
</template>

<style scoped>
	.barragesBox {
		position: fixed;
		left: 60px;
		bottom: 70px;
		max-height: 160px;
		min-height: 100px;
		background-color: #00000020;
	}

	/* .barragesBox{border: 1px solid red;} */
	.barragesBox .barrageitemline {
		margin-bottom: 5px;
		animation: barragelineanimation 5s;
		height: 26px;
	}

	.barragesBox .barrageitem {
		border-radius: 13px;
		background-color: #000000dd;
		padding-right: 12px;
		height: 26px;
		display: inline-block;
		vertical-align: -webkit-baseline-middle;
		position: relative;
		animation: barrageanimation 5s;
	}

	.barragesBox .barrageitem .info {
		display: inline-block;
		margin-left: 28px;
		color: #fff;
		font-size: 12px;
		line-height: 26px;
		height: 26px;
	}

	.barragesBox .barrageitem .head {
		display: inline-block;
		vertical-align: bottom;
		border-radius: 50%;
		background: url(http://thirdwx.qlogo.cn/mmopen/CLl4mibwkPX4vc4JoBbicJib0xicG95gD408FVLcL4BOzZruRyrGgk8ujHgEXUhw4aJrwoerOJCgMbWEy4YkCR2vloBsvZev1IhP/132) no-repeat center;
		background-size: contain;
		width: 20px;
		height: 20px;
		position: absolute;
		left: 3px;
		top: 3px;
	}

	@keyframes barragelineanimation {
		0% {
			opacity: 0;
			margin-top: -31px;
			margin-left: 0px;
		}

		5%,
		50% {
			opacity: 1;
			margin-top: 0px;
			margin-left: 0px;
		}

		60%,
		65% {
			opacity: 0;
		}

		75%,
		100% {
			opacity: 0;
			margin-top: -31px;
		}
	}

	@keyframes barrageanimation {

		0%,
		50% {
			opacity: 1;
			margin-top: 0px;
			margin-left: 0px;
		}

		60%,
		100% {
			opacity: 0;
			margin-top: 0px;
			margin-left: -50px;
		}
	}
</style>
<script>
	import Vue from "vue";
	import {
		commonMixin
	} from '../../mixins/index.js'
	import {
		mapActions,
		mapGetters
	} from "vuex";
	import {
		GetEditingOrder,
		GetBill,
		GeteTidings,
		AddDish,
		BackDish,
		ChangePeopleNumber,
		ChangeRemark,
		UnLockOrder,
		PutOrder
	} from "@/api/tsorder";
	export default {
		name: "Confirm_order",
		mixins: [commonMixin],
		data() {
			return {
				EditingOrder: {},
				AddDish: false, // 加菜模式标记 
				RemarkTextarea: "",


				Tidings: [], // 订单消息

				// order: {}, // 订单对象
				orderpopup: false,
				PersonOptionCount: 11,
				dinerNumList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], // 就餐人数数组
				PersonNumber: 0, // 就餐人数结果
				dinershow: false, // 是否显示选择用餐人数
				flavorlist: [], // 口味列表
				flavorpopup: false, // 是否显示口味弹窗
				flavor: "", // 备注

				ListeningObj: null,
				marqueeMsgs: []
			};
		},
		computed: {
			...mapGetters(["MemberCode", "StoreCode", "DeskID", "Member", "BusinessConfig"]),
			HiddenOrderAmount() {
				if (this.BusinessConfig && this.BusinessConfig.OrderConfig && this.BusinessConfig.OrderConfig
					.HiddenOrderAmount) {
					return true;
				}
				return false;
			},
			OrderRemark() {
				var remark = "";
				for (let i = 0; i < this.flavorlist.length; i++) {
					if (this.flavorlist[i].selected) {
						remark = remark == "" ? this.flavorlist[i].text : remark + "，" + this.flavorlist[i].text;
					}
				}
				return remark + (remark.length > 0 && this.RemarkTextarea.length > 0 ? "，" : "") + this.RemarkTextarea;
			},
		},
		onShow() {
			try {
				this.$route.query, this.$route.params
				this.EditingOrder = JSON.parse(this.$getUrlQuery().options?.EditingOrder);
			} catch (e) {
				//TODO handle the exception
				this.EditingOrder = null;
			}
			console.log('getEditingOrder');
			console.log(this.EditingOrder);
			this.AddDish = this.$getUrlQuery().options.AddDish;
			if (this.EditingOrder == null) {
				console.log("缺少参数", "this.EditingOrder==null");
				uni.navigateTo({
					url: `/pages/dishMenu/index?AddDish=${this.AddDish}`
				})
				return;
			}
			this.PersonNumber = this.EditingOrder.Person;
			if (this.PersonNumber > 11 || this.PersonNumber == 0) {
				this.PersonOptionCount = 19;
			}
			if (this.BusinessConfig.OrderConfig.RemarkItems && (!this.flavorlist || this.flavorlist.length == 0)) {
				this.flavorlist = [];
				this.BusinessConfig.OrderConfig.RemarkItems.forEach((item, index) => {
					this.flavorlist.push({
						text: item,
						selected: index == 0
					});
				});
			};
			if (this.EditingOrder && this.EditingOrder.Remark != "" && this.EditingOrder.Remark != null) {
				let remark = this.EditingOrder.Remark + '';
				if (remark) {
					this.flavorlist.forEach(item => {
						item.selected = remark.indexOf("[" + item.text + "]") >= 0;
						if (item.selected) {
							remark = remark.replace("[" + item.text + "]" + '，', '').replace("[" + item.text + "]",
								'')
						}
					});
					this.RemarkTextarea = remark;
				}
			}

			this.$nextTick(() => {
				this.loadTidings();
				if (this.ListeningObj) {
					// clearInterval(this.ListeningObj);
				}
				// this.ListeningObj=setInterval(this.loadTidings, 500);
				this.total();
			});

		},
		beforeDestroy() {
			// clearInterval(this.ListeningObj);
		},
		methods: {
			// 加减菜品
			TakeCart(dish, IsAdd, number = 0, commit = true) {
				// console.log('TakeCart',IsAdd,number,commit,dish);
				var TakeNumber = 0;
				if (IsAdd) {
					if (number != 0) {
						TakeNumber = number;
					} else {
						if (dish.Number == 0) {
							TakeNumber = dish.BaseNumber;
						} else {
							TakeNumber = dish.AppendNumber;
						}
					}
				} else {
					if (number != 0) {
						TakeNumber = 0 - number;
					} else {
						if (dish.Number >= 0) {
							if (dish.Number - dish.AppendNumber < dish.BaseNumber) {
								TakeNumber = 0 - dish.Number;
							} else {
								TakeNumber = 0 - dish.AppendNumber;
							}
						}
					}
				}
				dish.Number = dish.Number + TakeNumber;

				// 购物车数据计算
				this.total();

				if (commit && TakeNumber != 0) {
					this.$nextTick(() => {
						// 同步到服务器
						var parameter = {};
						parameter.OrderCode = this.EditingOrder.OrderCode;
						parameter.MemberCode = this.MemberCode;
						parameter.DishID = dish.DishID;
						parameter.DishTypeID = dish.DishTypeID;
						parameter.MakeMethods = dish.MakeMethods;
						parameter.Flavors = dish.Flavors;
						parameter.ToNumber = dish.Number;
						if (IsAdd) {
							parameter.AddNumber = TakeNumber;
							AddDish(parameter)
								.then(res => {
									if (res.state == 200) {
										// console.log('AddDish.ok',res);
									} else {
										console.log("AddDish.error----------", res);
									}
								})
								.catch(res => {
									console.log("AddDish.catch", res);
								});
						} else {
							parameter.BackNumber = 0 - TakeNumber;
							BackDish(parameter)
								.then(res => {
									if (res.state == 200) {
										console.log("BackDish.ok", res);
									} else {
										console.log("BackDish.error----------", res);
									}
								})
								.catch(res => {
									console.log("BackDish.catch", res);
								});
						}
					});
				}
			},
			// 合计
			total() {
				let count = 0,
					amount = 0;
				this.EditingOrder.Items.forEach(item => {
					count += item.Number * 100;
					amount += item.Number * item.MemberPrice * 100;
				});
				this.EditingOrder.DishCount = parseInt(count) / 100;
				this.EditingOrder.Amount = parseInt(amount) / 100;
			},
			// 下单确认
			orderPopup() {
				// this.orderpopup = true;
				this.takePutOrder();
			},
			// 用餐人数弹窗
			showDinerNum(index) {
				this.dinershow = true;
			},
			// 选择用餐人数
			selectDinerNum(value) {
				this.PersonNumber = value;
			},
			// 确认用餐人数
			confirmDinerNum() {
				// 传值给后台
				var parameter = {};
				parameter.OrderCode = this.EditingOrder.OrderCode;
				parameter.Person = Number(this.PersonNumber);
				ChangePeopleNumber(parameter)
					.then(res => {
						if (res.state == 200) {
							this.EditingOrder.Person = Number(this.PersonNumber);
							Vue.ls.set('Person', Number(this.PersonNumber), 60 * 60 * 1000);
						} else {
							console.log("ChangePeopleNumber.errpr", res);
						}
					})
					.catch(res => {
						console.log("ChangePeopleNumber.catch", res);
					});
				this.dinershow = false;
			},
			flavorPopup() {
				// 没有口味选项时跳过
				if (!this.flavorlist || this.flavorlist.length == 0) {
					this.flavorPopupOut();
					return;
				} else {
					this.flavorpopup = true;
				}
			},
			// 选择口味
			selectFlavor(index) {
				if (this.BusinessConfig.OrderConfig.RemarkCanMultiple == 0) {
					this.flavorlist.forEach((item, index2) => {
						console.log((item, index2));
						if (index == index2) {
							this.flavorlist[index].selected = !this.flavorlist[index].selected;
						} else {
							item.selected = false;
						}
					});
				} else {
					this.flavorlist[index].selected = !this.flavorlist[index].selected;
				}
			},
			// 确认选择口味
			flavorPopupConfirm() {
				let selected = 0;
				var remark = "";
				for (let i = 0; i < this.flavorlist.length; i++) {
					if (this.flavorlist[i].selected) {
						selected++;
						remark =
							remark == "" ?
							this.flavorlist[i].text :
							remark + "，" + this.flavorlist[i].text;
						console.log(remark, this.flavorlist[i].text);
					}
				}
				if (selected == 0) {
					this.$showToast('请选择口味偏好!')
				} else {
					// 提交订单数据
					var parameter = {};
					parameter.OrderCode = this.EditingOrder.OrderCode;
					parameter.Remark = remark + (remark.length > 0 && this.RemarkTextarea.length > 0 ? "，" : "") + this
						.RemarkTextarea;
					ChangeRemark(parameter)
						.then(res => {
							if (res.state == 200) {
								this.EditingOrder.Remark = remark;
								console.log("ChangeRemark.ok");
							} else {
								console.log("ChangeRemark.errpr", res);
							}
						})
						.catch(res => {
							console.log("ChangeRemark.catch", res);
						})
						.finally(res => {
							this.flavorpopup = false;
						});
				}
			},

			// 加载多人点餐信息
			loadTidings() {
				var b = this;
				var parameter = {};
				parameter.OrderCode = this.EditingOrder.OrderCode;
				parameter.MemberCode = this.MemberCode;
				GeteTidings(parameter)
					.then(res => {
						if (res.state == 200) {
							res.data.forEach(item => {
								var has = this.Tidings.filter(
									a => a.OrderTidingCode == item.OrderTidingCode
								);
								var dishs = null;
								if (has.length == 0) {
									this.Tidings.push(item);
									if (item.DishID == "Put") {
										console.log("Sub", item);
										uni.navigateTo({
											url: `/pages/PutOk/index?OrderCode=${this.EditingOrder.OrderCode}&EditingOrder=${JSON.stringify(this.EditingOrder)}`
										})
									} else {
										var dishs = this.EditingOrder.Items.filter(a => a.DishID == item
											.DishID);
										if (dishs.length > 0) {
											b.TakeCart(
												dishs[0],
												item.TakeNumber > 0,
												Math.abs(item.TakeNumber),
												false
											);
										} else {
											var OItem = JSON.parse(item.DataJson);
											this.EditingOrder.Items.push(OItem)
										}
									}
								}
								// 执行动画
								if (has.length == 0) {
									var msg = {
										id: this.marqueeMsgs.length,
										show: true,
										msg: item.Content,
										avatar: item.TakeMemberPicture
									};
									this.marqueeMsgs.unshift(msg);
									setTimeout(() => {
										msg.show = false;
									}, 5 * 1000);
								}
							});
						} else {
							console.log("获取多人点餐信息", res);
						}
					})
					.catch(res => {
						console.log("获取多人点餐信息", res);
					});
			},

			// 继续加菜
			continueMenu() {
				uni.navigateTo({
					url: `/pages/dishMenu/index?AddDish=${this.AddDish}&EditingOrder=${this.EditingOrder}`
				})
			},
			// 更新并解锁订单
			UnLockOrder() {
				return new Promise((resolve, reject) => {
					// if(this.RemarkTextarea.length>0){
					//   if(this.EditingOrder.Remark.length>0){
					//     this.EditingOrder.Remark=this.EditingOrder.Remark+"，";
					//   }
					//   this.EditingOrder.Remark=this.EditingOrder.Remark+this.RemarkTextarea;
					// }
					this.EditingOrder.Remark = this.OrderRemark;
					var parameter = {};
					parameter.Order = this.EditingOrder;
					parameter.SubMemberCode = this.MemberCode;
					UnLockOrder(parameter)
						.then(res => {
							if (res.state == 200) {} else {
								console.error("LockOrder.error----------", res);
							}
							resolve(res);
						})
						.catch(res => {
							console.error("LockOrder.catch", res);
							reject(res);
						});
				});
			},
			// 扫码下单
			takeScanAndPutOrder() {
				this.$showToast('请退出页面，并使用微信扫描台码重新进入，以确认您的台位!');
			},
			// 提交订单
			takePutOrder() {
				if (this.EditingOrder.DishCount == 0) {
					this.$showToast('您还没有选择菜品，不可以下单呦！😀');
					return;
				}
				this.$showLoading();
				this.EditingOrder.Remark = this.OrderRemark;
				var parameter = {};
				parameter.BusinessCode = this.Member.BusinessCode;
				parameter.StoreCode = this.EditingOrder.StoreCode;
				parameter.Order = this.EditingOrder;
				parameter.SubMemberCode = this.MemberCode;
				PutOrder(parameter)
					.then(res => {
						this.$hideLoading();
						if (res.state == 200) {
							uni.reLaunch({
								url: `/pages/PutOk/index?OrderCode=${this.EditingOrder.OrderCode}&EditingOrder=${JSON.stringify(this.EditingOrder)}`
							})
						} else {
							console.error("PutOrder.error----------", res);
						}
					})
					.catch(res => {
						console.error("PutOrder.catch", res);
						this.$hideLoading();
						reject(res);
					});
			},
			PushErrorPage(res) {
				uni.navigateTo({
					url: `/pages/error/index?Msg=${res.state + "-" + res.msg}`
				})
			},
			texLength(obj, maxlength, id) {
				console.log(obj, maxlength, id);
				if (this.RemarkTextarea.length > maxlength) {
					this.$showToast(`字数在${maxlength}字以内`)
				}
			}
		}
	};
</script>

<style lang="scss" scoped>
	$main: #ea454c;
	$red: #ff423e;
	$border: #e6e6ea;
	$grey: #777;

	.barrageBox {
		z-index: 999;
		position: fixed;
		width: 100%;
	}

	.barrageBox .barrageitem {
		width: 200%;
		margin-left: -100%;
	}

	.barrageBox .barrage {
		padding: 3px 20px 3px 3px;
		margin-top: 3px;
		line-height: 30px;
		font-weight: 400;
		font-size: 14px;
		z-index: 999;
		border-radius: 18px;
		background-color: rgba(234, 69, 76, 0.425);
		display: inline-block;
		width: fit-content;
	}

	.barrageBox .barrage .head {
		width: 30px;
		height: 30px;
		border-radius: 15px;
		vertical-align: bottom;
		margin-right: 5px;
	}

	@mixin border-radius($size) {
		-webkit-border-radius: $size;
		-moz-border-radius: $size;
		border-radius: $size;
	}

	.container {
		padding-bottom: 70px;
	}

	.Box {
		border-radius: 10px;
		margin: 15px 15px 0;
		background: white;
		padding: 10px;
		line-height: 40px;
	}

	/* order-msg */
	.order-msg {
		.order-msg-item {
			clear: both;
			height: 45px;
			line-height: 45px;
			padding: 0 10px;

			&:last-child {
				border-bottom: 0;
			}

			.text-box {
				.img {
					height: 45px;
					line-height: 45px;
					float: left;

					img {
						width: 14px;
						height: 14px;
						display: inline-block;
					}
				}

				.text {
					font-size: 14px;
					line-height: 45px;
					float: left;
					// margin-left: 5px;
				}
			}

			.btn {
				width: 85px;
				height: 28px;
				line-height: 28px;
				font-size: 14px;
				background: $main;
				@include border-radius(13px);
				float: right;
				margin-top: 8px;
				text-align: center;
			}
		}
	}

	/* order-msg end */
	/* order-list-box */
	.order-list-box {
		.add {
			width: 100%;
			height: 15px;
			position: relative;
			margin-bottom: -10px;

			.img {
				width: 60px;
				height: 67.5px;
				position: absolute;
				bottom: 5px;
				left: 50%;
				margin-left: -30px;
				animation: addbtn 1.25s infinite;
				color: white;
				text-align: center;
				padding-top: 12px;

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

		.order-list {
			.list {
				padding: 0 10px;

				li {
					// height: 50px;
					overflow: hidden;
					position: relative;
				}

				.title {
					width: 120px;
					height: 50px;
					line-height: 50px;
					float: left;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					font-size: 14px;
				}

				.memberprice {
					color: #ff423e;
					margin-right: 10px;
					min-width: 30px;
					line-height: 50px;
					font-size: 14px;
				}

				.price {
					color: initial;
					line-height: 50px;
					font-size: 14px;
				}

				.price.del {
					text-decoration: line-through;
					color: #777;
				}

				.cartcontrol {
					height: 50px;
					position: absolute;
					right: 0;
					top: 0;
					padding-top: 13px;

					.cart-count {
						height: 20px;
						line-height: 20px;
						text-align: center;
						font-size: 14px;
						color: $grey;
						margin: 0 10px;
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
			}
		}
	}

	.btn {
		color: white;
	}

	.flvaor {
		width: 100%;
		padding: 0 10px;
		position: relative;

		.flvaor-cot {
			height: 40px;
		}

		.title {
			font-size: 14px;
			line-height: 40px;
			float: left;
		}

		.text {
			height: 40px;
			line-height: 40px;
			// margin-left: 70px;
			display: block;
			font-size: 14px;
		}

		.btn.change-table {
			position: absolute;
			right: 10px;
			top: 6px;
			width: 85px;
			height: 28px;
			line-height: 28px;
			font-size: 14px;
			background: #ea454c;
			border-radius: 13px;
			text-align: center;
		}
	}

	/* order-list-box end */
	/* confirm-order-btn-box */
	.confirm-order-btn-box {
		padding: 10px;
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;

		.confirm-order-btn {
			width: 100%;
			height: 50px;
			background: #fff;
			@include border-radius(25px);
			-webkit-box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.1);
			-moz-box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.1);
			box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.1);
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
				position: absolute;
				right: 0;
				bottom: 0;
			}
		}
	}

	/* confirm-order-btn-box end */
	/* orderpopup */
	.orderpopup {
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 99;
		-webkit-transition: all 0.3s;
		-moz-transition: all 0.3s;
		-ms-transition: all 0.3s;
		-o-transition: all 0.3s;
		transition: all 0.3s;

		.popup-cot {
			width: 300px;
			position: absolute;
			top: 50%;
			left: 50%;
			margin-left: -150px;
			background: #fff;
			@include border-radius(10px);
			margin-top: -65px;
			padding: 20px 15px;

			.title {
				font-size: 14px;
				font-weight: 700;
				line-height: 1;
				text-align: center;
			}

			.text {
				padding: 15px 0;
				text-align: center;
				font-size: 14px;
				line-height: 24px;
				color: $grey;
			}

			.btn-group {
				width: 100%;

				li.allline {
					width: 50%;
					float: left;
				}

				li {
					width: 100%;
				}

				.btn {
					width: 120px;
					height: 40px;
					line-height: 40px;
					text-align: center;
					font-size: 14px;
					@include border-radius(20px);
					font-size: 14px;
					margin: 0 auto;
				}

				.cancle {
					background: #d8d8d8;
				}

				.confirm {
					background: $main;
					font-size: 14px;
				}
			}
		}

		.bg {
			width: 100%;
			height: 100%;
			background: rgba(0, 0, 0, 0.3);
		}
	}

	/* orderpopup end */
	/* diner-num */
	.diner-num {
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background: rgba(0, 0, 0, 0.5);
		z-index: 99;
		transition: all 0.3s linear;

		.diner-num-cot {
			width: 300px;
			padding: 25px 20px;
			background: #fff;
			position: absolute;
			top: 50%;
			left: 50%;
			margin-left: -150px;
			margin-top: -60%;
			@include border-radius(10px);

			.title {
				font-size: 14px;
				line-height: 1;
				text-align: center;
				margin-bottom: 10px;
			}

			li {
				width: 25%;
				margin: 15px 0;
				float: left;
			}

			.cot {
				width: 35px;
				height: 35px;
				line-height: 34px;
				text-align: center;
				border: 1px solid #d8d8d8;
				font-size: 14px;
				margin: 0 auto;
				@include border-radius(50%);
			}

			.active {
				.cot {
					border-color: $main;
					background: $main;
					color: white;
				}
			}

			.confirm {
				width: 160px;
				height: 40px;
				line-height: 40px;
				text-align: center;
				background: $main;
				// color: #fff;
				margin: 10px auto 0;
				display: block;
				border: none;
				padding: 0;
				font-size: 14px;
				@include border-radius(20px);
				color: white;
			}
		}
	}

	/* diner-num end */
	/* flavorpopup */
	.flavorpopup {
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 99;
		-webkit-transition: all 0.3s;
		-moz-transition: all 0.3s;
		-ms-transition: all 0.3s;
		-o-transition: all 0.3s;
		transition: all 0.3s;

		.popup-cot {
			width: 300px;
			position: absolute;
			top: 50%;
			left: 50%;
			margin-left: -150px;
			background: #fff;
			@include border-radius(10px);
			margin-top: -65px;
			padding: 20px 15px;

			.title {
				font-size: 14px;
				font-weight: 700;
				line-height: 1;
				text-align: center;
			}

			.text {
				padding: 15px 0;
				text-align: center;
				font-size: 14px;
				line-height: 24px;
				color: $grey;
			}

			.btn-group {
				width: 100%;

				li {
					width: 50% !important;
				}

				.btn {
					width: 120px;
					height: 40px;
					line-height: 40px;
					text-align: center;
					font-size: 14px;
					@include border-radius(20px);
					font-size: 14px;
					margin: 0 auto;
				}

				.cancle {
					background: #d8d8d8;
				}

				.confirm {
					background: $main;
					font-size: 14px;
				}
			}
		}

		.flavor-list {
			padding: 15px 0;

			li {
				height: 30px;
				line-height: 29px;
				padding: 0 20px;
				float: left;
				margin: 10px 5px 5px 0;
				font-size: 14px;
				border: 1px solid $border;
				min-width: 85px;
				text-align: center;
				@include border-radius(15px);
			}

			.active {
				background: $main;
				border-color: $main;
				color: white;
			}
		}

		.bg {
			width: 100%;
			height: 100%;
			background: rgba(0, 0, 0, 0.3);
		}
	}

	.flavorpopup {
		.popup-cot {
			margin-top: -110px;
		}
	}

	/* flavorpopup end */
	.fade-enter,
	.fade-leave-to {
		opacity: 0;
	}

	.blue {
		border-radius: 100px;
		background: #e6ff75;
		color: #fff;
	}

	.green {
		border-radius: 100px;
		background: rgba(117, 255, 205, 0.4);
		color: #fff;
	}

	.red {
		border-radius: 100px;
		background: #e68fba;
		color: #fff;
	}

	.yellow {
		border-radius: 100px;
		background: #dfc795;
		color: #fff;
	}

	.baberrage-stage {
		position: absolute;
		width: 100%;
		height: 105px !important;
		overflow: hidden;
		top: 0;
		margin-top: 100px;
	}

	.baberrage-item {
		margin-top: 5px;
		padding: 3px 15px 3px 35px !important;
	}

	.baberrage-item .baberrage-avatar {
		position: absolute;
		width: 30px;
		height: 30px;
		left: 6px !important;
		top: 3px !important;
		border-radius: 50px;
		overflow: hidden;
	}

	.headimg {
		width: 40px;
		height: 40px;
		border-radius: 10px;
		vertical-align: bottom;
	}

	.jia {
		width: 26px;
		height: 26px;
		// width: 24px;
		// height: 24px;
		// padding-top: 7px;
		text-align: center;
		background: #ea454c;
		border: 1px solid #ea454c;
		color: #333;
		border-radius: 50%;
		float: left;
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.jian {
		width: 26px;
		height: 26px;
		// width: 24px;
		// height: 24px;
		// padding-top: 7px;
		text-align: center;
		background: white;
		color: #333;
		border-radius: 50%;
		float: left;
		color: #777;
		border: 1px solid #777;
		background: none;
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.jia .iconfont,
	.jian .iconfont {
		font-size: 12px;
		line-height: 26px;
		font-weight: 300;
		width: 26px;
		height: 26px;
		// width: 24px;
		// height: 24px;
	}

	.jia .iconfont {
		color: white;
	}

	// .jian,
	// .jia {
	//   width: 24px !important;
	//   height: 24px !important;
	//   padding-top: 8px !important;
	//   text-align: center;
	//   background: #ea454c;
	//   color: #333;
	//   border-radius: 50%;
	//   float: left;
	// }
	// .jian {
	//   color: #777;
	//   background: none;
	//   border: 1px solid #777;
	// }
	// .jian i,
	// .jia i {
	//   font-size: 10px !important;
	// }
	.number {
		line-height: 24px !important;
	}

	.order-list.lock {
		top: 100px;
	}

	// .order-list {
	//   position: fixed;
	//   top: 145px;
	//   bottom: 100px;
	//   left: 0;
	//   right: 0px;
	//   overflow: scroll;
	// }
</style>
