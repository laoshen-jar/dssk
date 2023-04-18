<template>
	<div class="container">
		<div class="thanks">感谢您光临本店 请对本次用餐进行评价</div>
		<div class="division"></div>
		<!-- paymsg -->
		<div class="paymsg">
			<!-- <h5 class="title">消费信息</h5> -->
			<div class="paymsg-list">
				<ul class="msg-list">
					<li class="msg-item">
						<p class="text">账单编号</p>
						<p class="cot">{{BillInfo.BillCode}}</p>
					</li>
					<li class="msg-item">
						<p class="text">用餐门店</p>
						<p class="cot">{{BillInfo.StoreName}}</p>
					</li>
				</ul>
			</div>
		</div>
		<!-- paymsg end -->
		<div class="division" v-if="mealstarlist&&mealstarlist.length>0"></div>
		<!-- meal-comment -->
		<div class="meal-comment" v-if="mealstarlist&&mealstarlist.length>0">
			<!-- <h5 class="title">综合评价</h5> -->
			<div class="star-box">
				<div class="star-item" v-for="(item,index) in mealstarlist" :key="index">
					<p class="text">{{item.Title}}：</p>
					<div class="content">
						<div class="star-list">
							<iconfont class="iconfont" icon="iconwujiaoxingquanxing"
								:class="{'active':item.ScoreNumber > 0}" data-index="0" @click="meal(index,1)" />
							<iconfont class="iconfont" icon="iconwujiaoxingquanxing"
								:class="{'active':item.ScoreNumber > 1}" data-index="1" @click="meal(index,2)" />
							<iconfont class="iconfont" icon="iconwujiaoxingquanxing"
								:class="{'active':item.ScoreNumber > 2}" data-index="2" @click="meal(index,3)" />
							<iconfont class="iconfont" icon="iconwujiaoxingquanxing"
								:class="{'active':item.ScoreNumber > 3}" data-index="3" @click="meal(index,4)" />
							<iconfont class="iconfont" icon="iconwujiaoxingquanxing"
								:class="{'active':item.ScoreNumber > 4}" data-index="4" @click="meal(index,5)" />
						</div>
						<div class="state">（{{item.ScoreNumber|CommentFilter}}）</div>
					</div>
				</div>
			</div>
		</div>
		<!-- food-comment end -->
		<div class="division"></div>
		<!-- comment-cot -->
		<div class="comment-cot">
			<!-- <h5 class="title">菜品评价</h5> -->
			<div class="cot-box">
				<div class="thanks">我们非常在意您的评价</div>
				<textarea name="cot" placeholder="您的评价有助于我们提供更好的服务" v-model="Info" maxlength="200"></textarea>
				<div class="textarealen">{{Info.length}}/200</div>
				<div class="ShowCommentInfoItemsBox">
					<div v-for="(item,index) in ShowCommentInfoItems" :key="index" :class="{selected:item.selected}"
						@click="item.selected=!item.selected">{{item.info}}</div>
				</div>
			</div>
		</div>
		<!-- meal-comment end -->
		<div class="division" v-if="foodstarlist&&foodstarlist.length>0"></div>
		<!-- food-comment -->
		<div class="food-comment" v-if="foodstarlist&&foodstarlist.length>0">
			<!-- <h5 class="title">菜品评价</h5> -->
			<div class="foodcommentbox">
				<div class="fooditem" v-for="(item,index) in foodstarlist" :key="index">
					<p class="text">{{item.DishName}}</p>
					<div class="content">
						<div class="good" :class="{'active':item.Value == 'Good'}" @click="good(index)">
							<iconfont class="iconfont" icon="icongood_active" />
							<!-- <p class="text">赞</p> -->
						</div>
						<div class="bad" :class="{'active':item.Value =='Bad'}" @click="bad(index)">
							<iconfont class="iconfont" icon="icongood_active-copy" />
							<!-- <p class="text">踩</p> -->
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="division"></div>
		<div class="division"></div>
		<div class="division"></div>
		<div class="division"></div>
		<div class="division"></div>
		<div class="division"></div>
		<div class="division"></div>
		<div class="division"></div>
		<div class="division"></div>
		<div class="division"></div>
		<div class="division"></div>
		<div class="division"></div>
		<div class="division"></div>
		<div class="division"></div>
		<div class="division"></div>
		<div class="division"></div>
		<div class="division"></div>
		<div class="division"></div>
		<div class="division"></div>

		<div class="submit-box">
			<div class="submit" v-if="!Putting" @click="submit">提交评价</div>
			<div class="submit" v-if="Putting">提交中……</div>
		</div>
		<!-- comment-cot end -->
	</div>
</template>

<script>
	import Vue from "vue";
	import {
		GetCommentRules,
		SubmitComment
	} from "@/api/bill";
	import {
		mapActions,
		mapGetters
	} from "vuex";
	import moment from "moment";
	export default {
		name: "comment",
		filters: {
			CommentFilter: function(value) {
				switch (value) {
					case 1:
						return '极差';
						break
					case 2:
						return '差';
						break
					case 3:
						return '一般';
						break
					case 4:
					default:
						return '不错';
						break
					case 5:
						return '很棒';
						break
				}
			}
		},
		data() {
			return {
				BillID: "", //账单ID
				BillInfo: {}, //账单详情
				msglist: [], // 消费信息
				mealstarlist: [], // 用餐评价
				foodstarlist: [], // 菜品评价
				Info: "", // 评论内容
				Putting: false,

				CommentInfoItems: [{
						Title: "菜品",
						InfoItems: [{
								Number: 1,
								Items: [{
									selected: false,
									info: '太辣了'
								}, {
									selected: false,
									info: '没烤熟'
								}, {
									selected: false,
									info: '烤的太老了'
								}, {
									selected: false,
									info: '菜里面有异物'
								}, {
									selected: false,
									info: '菜样太少'
								}]
							},
							{
								Number: 2,
								Items: [{
									selected: false,
									info: '太辣了'
								}, {
									selected: false,
									info: '没烤熟'
								}, {
									selected: false,
									info: '烤的太老了'
								}, {
									selected: false,
									info: '菜里面有异物'
								}, {
									selected: false,
									info: '菜样太少'
								}, ]
							},
							{
								Number: 3,
								Items: [{
									selected: false,
									info: '偏辣'
								}, {
									selected: false,
									info: '烤的有点老'
								}, {
									selected: false,
									info: '有点夹生'
								}, {
									selected: false,
									info: '口味有待提升'
								}, {
									selected: false,
									info: '菜样太少'
								}]
							},
							{
								Number: 4,
								Items: [{
									selected: false,
									info: '口味一般'
								}, {
									selected: false,
									info: '有点辣'
								}, {
									selected: false,
									info: '有点淡'
								}, {
									selected: false,
									info: '还是挺棒的'
								}, {
									selected: false,
									info: '口味还有上升空间'
								}, ]
							},
							{
								Number: 5,
								Items: [{
									selected: false,
									info: '辣度正好'
								}, {
									selected: false,
									info: '口感香嫩'
								}, {
									selected: false,
									info: '这是我吃过最好吃的烧烤了'
								}, {
									selected: false,
									info: '下次还来'
								}, ]
							},
						],
					},
					{
						Title: "口味",
						InfoItems: [{
								Number: 1,
								Items: [{
									selected: false,
									info: '太辣了'
								}, {
									selected: false,
									info: '没烤熟'
								}, {
									selected: false,
									info: '烤的太老了'
								}, {
									selected: false,
									info: '菜里面有异物'
								}, {
									selected: false,
									info: '菜样太少'
								}, ]
							},
							{
								Number: 2,
								Items: [{
									selected: false,
									info: '太辣了'
								}, {
									selected: false,
									info: '没烤熟'
								}, {
									selected: false,
									info: '烤的太老了'
								}, {
									selected: false,
									info: '菜里面有异物'
								}, {
									selected: false,
									info: '菜样太少'
								}, ]
							},
							{
								Number: 3,
								Items: [{
									selected: false,
									info: '偏辣'
								}, {
									selected: false,
									info: '烤的有点老'
								}, {
									selected: false,
									info: '有点夹生'
								}, {
									selected: false,
									info: '口味有待提升'
								}, {
									selected: false,
									info: '菜样太少'
								}]
							},
							{
								Number: 4,
								Items: [{
									selected: false,
									info: '口味一般'
								}, {
									selected: false,
									info: '有点辣'
								}, {
									selected: false,
									info: '有点淡'
								}, {
									selected: false,
									info: '还是挺棒的'
								}, {
									selected: false,
									info: '口味还有上升空间'
								}, ]
							},
							{
								Number: 5,
								Items: [{
									selected: false,
									info: '辣度正好'
								}, {
									selected: false,
									info: '口感香嫩'
								}, {
									selected: false,
									info: '这是我吃过最好吃的烧烤了'
								}, {
									selected: false,
									info: '下次还来'
								}, ]
							},
						],
					},
					{
						Title: "环境",
						InfoItems: [{
								Number: 1,
								Items: [{
									selected: false,
									info: '卫生条件太差了'
								}, {
									selected: false,
									info: '设备老旧影响就餐体验'
								}, ]
							},
							{
								Number: 2,
								Items: [{
									selected: false,
									info: '卫生条件有点差'
								}, {
									selected: false,
									info: '餐具有异物'
								}, {
									selected: false,
									info: '设备老旧影响就餐体验'
								}, {
									selected: false,
									info: '桌椅打扫的不干净'
								}, ]
							},
							{
								Number: 3,
								Items: [{
									selected: false,
									info: '卫生条件一般'
								}, {
									selected: false,
									info: '设备老旧影响就餐体验'
								}, ]
							},
							{
								Number: 4,
								Items: [{
									selected: false,
									info: '卫生条件挺好'
								}, {
									selected: false,
									info: '环境挺好'
								}, ]
							},
							{
								Number: 5,
								Items: [{
									selected: false,
									info: '环境很棒'
								}, {
									selected: false,
									info: '餐具桌椅很干净'
								}, ]
							},
						],
					},
					{
						Title: "服务",
						InfoItems: [{
								Number: 1,
								Items: [{
									selected: false,
									info: '服务员太少'
								}, {
									selected: false,
									info: '上菜太慢'
								}, {
									selected: false,
									info: '服务态度差'
								}, {
									selected: false,
									info: '下次不来了'
								}, ]
							},
							{
								Number: 2,
								Items: [{
									selected: false,
									info: '服务员太少'
								}, {
									selected: false,
									info: '上菜太慢'
								}, ]
							},
							{
								Number: 3,
								Items: [{
									selected: false,
									info: '服务员太少'
								}, {
									selected: false,
									info: '上菜太慢'
								}, {
									selected: false,
									info: '服务员态度不够积极'
								}, ]
							},
							{
								Number: 4,
								Items: [{
									selected: false,
									info: '上菜速度快点就好了'
								}, {
									selected: false,
									info: '上菜太慢'
								}, {
									selected: false,
									info: '服务员太少'
								}, ]
							},
							{
								Number: 5,
								Items: [{
									selected: false,
									info: '服务员很积极友善'
								}, {
									selected: false,
									info: '上菜快'
								}, {
									selected: false,
									info: '总之太棒了'
								}, ]
							},
						],
					},
				],
			};
		},
		computed: {
			...mapGetters(["MemberCode", "StoreCode", "DeskID", "Member"]),
			ShowCommentInfoItems() {
				// 大圣烧烤
				if (this.Member.BusinessCode == "c5e6baa9861e452dbd420bc16721e474") {
					return [];
				}
				var ShowItems = [];
				this.mealstarlist.forEach(item => {
					var infoitem = this.CommentInfoItems.find(a => a.Title == item.Title);
					if (infoitem) {
						var iItem = infoitem.InfoItems.find(a => a.Number == item.ScoreNumber);
						if (iItem) {
							ShowItems = ShowItems.concat(iItem.Items);
						}
					}
				});
				return ShowItems;
			},
			CommentInfoItemsSelectedInfo() {
				var Info = "";
				this.ShowCommentInfoItems.forEach(item => {
					if (item.selected) {
						if (Info.length > 0) {
							Info = Info + "，";
						}
						Info = Info + item.info;
					}
				});
				return Info;
			},
		},
		onLoad(option) {
			this.$showLoading()
			this.BillID = option.BillID;
			GetCommentRules({
				BillID: this.BillID,
				MemberCode: this.MemberCode
			}).then(res => {
				if (res.state == 200) {
					if (res.data == "已存在评价记录") {
						// this.$router.push({name: "BillDetail",query: {BillID: this.BillID}});
						uni.reLaunch({
							url: `/pages/billDetail/index?BillID=${this.BillID}`
						})
					} else {
						this.BillInfo = res.data;
						res.data.ComItems.forEach(item => {
							item.ScoreNumber = item.DefaultScore;
						});
						this.mealstarlist = JSON.parse(JSON.stringify(res.data.ComItems));
						res.data.ComDishs.forEach(item => {
							item.Value = null;
						});
						this.foodstarlist = JSON.parse(JSON.stringify(res.data.ComDishs));
					}
				}
			}).finally(res => {
				this.$hideLoading()
			});
		},

		methods: {
			//时间转化函数
			dateFormart(time, formart) {
				return moment(time).format(formart);
			},
			// 用餐评价
			meal(index, num) {
				this.mealstarlist[index].ScoreNumber = num;
			},
			submit() {
				this.$showLoading();
				var parameter = {};
				parameter.ComItems = [];
				this.mealstarlist.forEach(item => {
					parameter.ComItems.push({
						CommentItemCode: item.CommentItemCode,
						Title: item.Title,
						ScoreNumber: item.ScoreNumber
					});
				});
				parameter.ComDishs = [];
				this.foodstarlist.forEach(dish => {
					if (dish.Value != null) {
						parameter.ComDishs.push({
							DishID: dish.DishID,
							DishName: dish.DishName,
							Value: dish.Value
						});
					}
				});
				parameter.BillID = this.BillID;
				parameter.MemberCode = this.MemberCode;
				parameter.Info = this.Info;
				if (this.CommentInfoItemsSelectedInfo) {
					if (parameter.Info.length > 0) {
						parameter.Info = parameter.Info + "，";
					}
					parameter.Info = parameter.Info + this.CommentInfoItemsSelectedInfo;
				}
				SubmitComment(parameter).then(res => {
					console.log("res", res);
					if (res.state == 200) {
						this.$showToast("提交成功，感谢您的评价！");
						setTimeout(() => {
							// this.$router.push({
							// 	name: "BillDetail",
							// 	query: {
							// 		BillID: w.BillID,
							// 		CanotBack: true
							// 	}
							// });
							uni.reLaunch({
								url: `/pages/billDetail/index?BillID=${this.BillID}`
							})
						}, 1000);
					} else {
						this.$showToast("提交失败，请稍后重试！");
					}
				}).finally(res => {
					this.$hideLoading();
				});
			},
			good(index) {
				this.foodstarlist[index].Value = "Good";
			},
			bad(index) {
				this.foodstarlist[index].Value = "Bad";
			}
		}
	};
</script>

<style lang="scss" scoped>
	$main: #ea454c;
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



	.thanks {
		font-weight: bold;
		height: 45px;
		line-height: 45px;
		text-align: center;
		font-size: 14px;
	}

	/* paymsg */

	.paymsg {
		padding: 10px 15px;
		font-size: 14px;

		.title {
			font-size: 14px;
			line-height: 1;
		}

		.msg-list {
			li {
				clear: both;
				height: 30px;

				p {
					line-height: 30px;

				}
			}

			.text {
				float: left;
				color: #555;
			}

			.cot {
				float: right;
				text-align: right;
				// color: $grey;
			}
		}
	}

	/* paymsg end */
	/* meal-comment */

	.meal-comment {
		padding: 10px 15px;

		.title {
			font-size: 14px;
			line-height: 1;
		}

		.star-item {
			height: 50px;
			// margin-top: 15px;
			clear: both;

			>.text {
				float: left;
				font-size: 14px;
				font-weight: bold;
				color: #555;
				width: 80px;
				text-align: right;
				margin-right: 5px;
				line-height: 40px;
			}

			.content {
				float: left;
				;

				.star-list {
					float: left;
					;
					line-height: 40px;

					i {
						display: inline-block;
						text-align: right;
						color: #e6e6ea;
						font-size: 20px;
						margin: 0 5px;
					}

					.active {
						color: $main;
					}
				}

				.state {
					float: left;
					;
					font-size: 14px;
					font-weight: bold;
					color: #555;
					text-align: center;
					line-height: 40px;
				}
			}
		}
	}

	.food-comment {
		padding: 10px 15px;

		.fooditem {
			padding: 0px 15px;
			line-height: 44px;
			height: 44px;
			clear: both;

			.text {
				font-size: 14px;
				color: #555;
				font-weight: bold;
				float: left;
			}

			.content {
				float: right;

				.good,
				.bad {
					float: left;
					margin-left: 40px;

					.iconfont {
						display: inline-block;
						font-size: 20px;
						color: #e6e6ea;
						vertical-align: bottom;
					}

					.text {
						display: inline-block;
						// color: #888;
						margin-right: 5px;
					}
				}

				.good.active {
					.iconfont {
						color: $main;
					}

					.text {
						color: #333;
					}
				}

				.bad.active {
					.iconfont {
						color: #8b9fb8;
					}

					.text {
						color: #333;
					}
				}
			}
		}
	}

	/* meal-comment end */
	/* mcomment-cot */

	.comment-cot {
		padding: 15px;

		.title {
			font-size: 14px;
			line-height: 1;
		}

		textarea {
			width: 100%;
			height: 90px;
			display: block;
			border: 1px solid #e6e6ea;
			@include border-radius(5px);
			padding: 10px;
			font-size: 14px;
			color: $grey;
			background: #fff;
			box-sizing: border-box;
			//margin-top: 15px;
		}

	}

	.cot-box {
		position: relative
	}

	.cot-box .textarealen {
		position: absolute;
		right: 5px;
		bottom: 5px;
		font-size: 14px;
	}

	.submit-box {
		padding: 10px 15px;
		// background: #f2f2f6;
		position: fixed;
		bottom: 3px;
		width: 100%;
		box-sizing: border-box;

		.submit {
			width: 100%;
			height: 50px;
			line-height: 50px;
			background: $main;
			text-align: center;
			@include border-radius(25px);
			border: none;
			font-size: 14px;
			color: white;
			box-sizing: border-box;
		}
	}

	.ShowCommentInfoItemsBox {
		padding: 10px 0;
	}

	.ShowCommentInfoItemsBox div {
		display: inline-block;
		border: 1px solid #e6e6ea;
		border-radius: 13px;
		padding: 3px 10px;
		margin: 0 10px 10px 0;
		font-size: 12px;
	}

	.ShowCommentInfoItemsBox div.selected {
		border: 1px solid #ea454c;
		color: #ea454c
	}

	/* comment-cot end */
</style>
