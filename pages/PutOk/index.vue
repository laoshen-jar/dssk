<template>
	<div>
		<div class="bodybox">
			<div class="title">先吃饭，后结账</div>
			<div class="describe">~ 美味即将上桌，请稍等片刻 ~</div>
			<image class="pic" :src="staticUrl + 'images/wmwbtc.png'"></image>
			<navigator class="closebtn" url="" target="miniProgram" open-type="exit">关闭</navigator>
			<navigator url="/pages/orderInfo/index" class="tomore">更多消费信息 >></navigator>
			<div class="order-list-box" v-if="EditingOrder">
				<div class="title-box">本次点菜清单【待上菜】</div>
				<ul class="product-list">
					<li v-for="(item,index) in EditingOrder.Items" :key="index" :class="[Vshow(item.Number!=0)]">
						<span class="rownumber">{{index+1}}</span>
						<span class="dishname">{{item.DishName}}</span>
						<!-- <span class="price">¥ {{item.MemberPrice}}</span> -->
						<span class="number"> {{ item.Number }} {{ item.Unit }}</span>
					</li>
				</ul>
			</div>
		</div>
		<!-- <SubscribeContrel/>
    <SubscribeContrel v-if="Member.subscribe!=1"></SubscribeContrel> -->
	</div>
</template>

<script>
	import {
		commonMixin
	} from '../../mixins/index.js'
	import {
		mapActions,
		mapGetters
	} from "vuex";
	// import SubscribeContrel from '@/components/SubscribeContrel.vue';
	export default {
		// components: {
		// 	SubscribeContrel,
		// },
		mixins: [commonMixin],
		computed: {
			...mapGetters(["Business", "Member"]),
		},
		data() {
			return {
				OrderCode: '',
				EditingOrder: null,
			}
		},
		onLoad() {
			const eventChannel = this.getOpenerEventChannel();
			eventChannel.on('payOrder', data => {
				this.EditingOrder = data || null;
			})
		},
		onShow() {
			this.OrderCode = this.$getUrlQuery().options.OrderCode;
		},
		methods: {
			ExitPage() {
				WeixinJSBridge.call('closeWindow');
			},
		},
	}
</script>

<style scoped>
	.bodybox {
		width: 350px;
		text-align: center;
		position: absolute;
		top: 60px;
		bottom: 20px;
		left: 50%;
		margin-left: -175px;
	}

	.title {
		font-size: 22px;
		font-weight: bold;
		line-height: 50px;
	}

	.describe {
		font-size: 14px;
		color: #707070;
		line-height: 50px;
		;
	}

	.pic {
		width: 350px;
		height: 150px;
		background-size: 80%;
	}

	.tomore {
		font-size: 14px;
		color: #707070;
	}

	.closebtn {
		background: #ea454c;
		width: 260px;
		line-height: 40px;
		margin: 20px auto;
		text-align: center;
		font-size: 14px;
		color: white;
		border-radius: 20px;
	}

	.order-list-box .title-box {
		height: 45px;
		line-height: 45px;
		text-align: center;
		font-size: 14px;
		margin-top: 20px;
		color: #ffbb05;
		border-bottom: 1px solid #e6e6ea;
	}

	.order-list-box .product-list {
		padding: 0 20px;
		;
	}

	.order-list-box .product-list li {
		clear: both;
		height: 40px;
		line-height: 40px;
		font-size: 14px;
	}

	.order-list-box .product-list li .rownumber {
		width: 40px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		font-size: 14px;
		text-align: left;
		float: left;
	}

	.order-list-box .product-list li .dishname {
		width: 140px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		font-size: 14px;
		text-align: left;
		float: left;
	}

	.order-list-box .product-list li .price {
		color: initial;
		font-size: 14px;
	}

	.order-list-box .product-list li .number {
		float: right;
		font-size: 14px;
	}
</style>
