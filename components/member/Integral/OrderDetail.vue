<template>
	<div class="container">
		<!-- msg -->
		<div class="msg">
			<div class="msg-cot">
				<router-link :to="{name:'showshop',params:{id:order.id}}" class="order-msg">
					<div class="img">
						<img :src="order.shop.src" :alt="order.shop.title" />
					</div>
					<div class="text-box">
						<h6 class="title">{{order.shop.title}}</h6>
						<p class="num">数量：{{order.shop.num}}</p>
						<p class="spend">{{order.shop.spend}}</p>
					</div>
					<div class="select-box">
						<p class="text">查看商品</p>
					</div>
				</router-link>
			</div>
		</div>
		<!-- msg end -->
		<div class="division"></div>
		<!-- shop-detail -->
		<div class="shop-detail">
			<h5 class="title">商品详情</h5>
			<ul class="text-list">
				<li v-for="(item,index) in order.detail" :key="index">{{item}}</li>
			</ul>
		</div>
		<!-- shop-detail end -->
		<div class="division"></div>
		<!-- pay-msg -->
		<div class="pay-msg">
			<h5 class="title">支付信息</h5>
			<p class="text">商品总价：￥{{order.paymsg.total.toFixed(2)}}</p>
			<p class="text">积分抵扣：{{order.paymsg.score}}积分<span class="discount">({{order.paymsg.discount}})</span></p>
			<p class="text">微信支付：￥{{order.paymsg.pay.toFixed(2)}}</p>
			<p class="text">订单编号：{{order.paymsg.id}}</p>
			<p class="text">交易时间：{{order.paymsg.time}}</p>
		</div>
		<!-- pay-msg end -->
		<div class="btn-box">
			<router-link to="/shop" class="btn">继续购买</router-link>
		</div>
		<!-- activicity -->
		<div class="activicity">
			<div class="title-box">
				<div class="title-cot">
					<h5 class="title">活动</h5>
				</div>
			</div>
			<div class="img">
				<img src="../../../../../static/images/activicity.jpg" alt="" />
			</div>
			<div class="support">本服务由武汉邦越提供技术支持</div>
		</div>
		<!-- activicity end -->
	</div>
</template>

<script>
	export default {
		name: 'order',
		data() {
			return {
				order:{} , // 商品详情
			}
		},
		created() {
			// 请求数据
			this.$axios.get('../../static/js/data.json')
			.then((res)=>{
				this.order = res.data.getMyselforder;
			})
			.catch(err=>console.log)
		},
		methods: {
			
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
		background: #f2f2f6;
		min-height: 100vh;
	}
	/* msg */
	.msg {
		padding: 0 10px;
		background: #fff;
		.msg-cot {
			padding: 15px 0;
		}
		.order-msg {
			width: 100%;
			height: 105px;
			padding: 8px 0 0 8px;
		    display: block;
		    @include border-radius(5px);
		    -webkit-box-shadow: 0 0 3px 0 rgba(0,0,0,.1);
		    -moz-box-shadow: 0 0 3px 0 rgba(0,0,0,.1);
		    box-shadow: 0 0 3px 0 rgba(0,0,0,.1);
		    position: relative;
		    .img {
		    	width: 89px;
		    	float: left;
		    	@include border-radius(5px);
		    	overflow: hidden;
		    	img {
		    		width: 100%;
		    		display: block;
		    	}
		    }
		    .text-box {
		    	margin-left: 100px;
		    	padding-right: 50px;
		    	padding-top: 10px;
		    	.title {
		    		white-space: nowrap;
		    		overflow: hidden;
		    		text-overflow: ellipsis;
		    		font-size: 14px;
		    	}
		    	.num {
		    		font-size: 12px;
		    		color: $grey;
		    		line-height: 1;
		    		margin-top: 10px;
		    	}
		    	.spend {
		    		color: $red;
		    		font-size: 12px;
		    		line-height: 1;
		    		margin-top: 10px;
		    	}
		    }
		    .select-box {
				width: 50px;
				height: 100%;
				text-align: center;
				background: $main;
				-webkit-border-radius: 0 5px 5px 0;
				-moz-border-radius: 0 5px 5px 0;
				border-radius: 0 5px 5px 0;
				position: absolute;
				right: 0;
				top: 0;
				.text {
					width: 50px;
					height: 100%;
					line-height: 50px;
					text-align: center;
					-webkit-writing-mode: vertical-rl;
					-ms-writing-mode: bt-rl;
					writing-mode: vertical-rl;
					font-size: 12px;
					color: #fff;
					letter-spacing: 1px;
				}
			}
		}
	}
	/* msg end */
	/* shop-detail */
	.shop-detail {
		padding: 15px 10px;
		background: #fff;
		.title {
			font-size: 14px;
			position: relative;
			padding-left: 10px;
			&:before {
				content: '';
				width: 3px;
				height: 14px;
				background: $main;
				@include border-radius(2px);
				position: absolute;
				left: 0;
				top: 50%;
				margin-top: -7px;
			}
		}
		.text-list {
			li {
				font-size: 12px;
				margin-top: 10px;
				color: $grey;
			}
		}
	}
	/* shop-detail end */
	/* pay-msg */
	.pay-msg {
		padding: 15px 10px;
		background: #fff;
		.title {
			font-size: 14px;
			position: relative;
			padding-left: 10px;
			&:before {
				content: '';
				width: 3px;
				height: 14px;
				background: $main;
				@include border-radius(2px);
				position: absolute;
				left: 0;
				top: 50%;
				margin-top: -7px;
			}
		}
		.text {
			font-size: 12px;
			line-height: 1;
			margin-top: 15px;
			color: $grey;
			.discount {
				color: $red;
			}
		}
	}
	/* pay-msg end */
	.btn-box {
		width: 100%;
		padding: 10px;
		.btn {
			width: 100%;
			height: 50px;
			line-height: 50px;
			background: $main;
			text-align: center;
			display: block;
			@include border-radius(25px);
			color: #fff;
			font-size: 14px;
		}
	}
	/* activicity */
	
	.activicity {
		height: 165px;
		padding: 15px 10px 0 15px;
		background: #f2f2f6;
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
</style>