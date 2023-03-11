<template>
	<div class="container">
		<div class="pay-result">
			<div class="pay-result-cot">
				<div class="img">
					<img src="../../../../../static/images/pay-result-1.png" alt="支付状态" />
				</div>
				<h6 class="title">支付成功</h6>
				<p class="text">{{num}}秒后跳转至订单详情，您可以点此<span class="link" @click="lookorder">查看卡券</span></p>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'pay_result',
		data() {
			return {
				num: 5,
				id:this.$route.params.id,
				countdown:null,
			}
		},
		created() {
			let _this = this;
			_this.countdown = setInterval(function(){
				_this.num--;
				if(_this.num == 0){
					_this.lookorder();
				}
			},1000)
		},
		methods:{
			lookorder(){
				console.log(this.id)
				this.$router.push({
					name:'CardList'
				});
				clearInterval(this.countdown);
			}
		},
		beforeDestroy(){
	        clearInterval(this.countdown)
	    }
	}
</script>

<style lang="scss" scoped>
	$main: #ffbb05;
	$red: #ff423e;
	$border: #e6e6ea;
	$grey: #777;
	@mixin border-radius($size) {
		-webkit-border-radius: $size;
		-moz-border-radius: $size;
		border-radius: $size;
	}
	@mixin transition($time){
		-webkit-transition: all $time;
		-moz-transition: all $time;
		-ms-transition: all $time;
		-o-transition: all $time;
		transition: all $time;
	}
	/* pay-result */
	.pay-result {
		.pay-result-cot {
			width: 100%;
			position: absolute;
			top: 50%;
			left: 0;
			margin-top: -150px;
			padding: 0 20px;
			.img {
				width: 160px;
				margin: 0 auto;
				img {
					width: 100;
				}
			}
			.title {
				font-size: 16px;
				line-height: 1;
				text-align: center;
				margin-top: 25px;
				color: #09bb07;
			}
			.text {
				font-size: 12px;
				color: $grey;
				text-align: center;
				margin-top: 10px;
				.link {
					color: $red;
				}
			}
		}
	}
	/* pay-result end */
</style>