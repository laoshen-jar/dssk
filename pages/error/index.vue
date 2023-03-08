<template>
	<view class="pay-result pay-warn">
		<view class="pay-result-cot">
			<view class="img">
				<image src="../../static/images/pay-result-3.png" alt="支付状态" />
			</view>
			<view class="title">请重新扫描二维码或咨询服务员！</view>
			<view class="text">{{errorText}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'invalid',
		data() {
			return {
				errorText: '404', // 错误提示
				fromPath: '', // 错误提示
			}
		},
		created() {
			if (this.$getUrlQuery().options?.msg) {
				this.errorText = this.$route.query.msg;
			}
		},

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

	@mixin transition($time) {
		-webkit-transition: all $time;
		-moz-transition: all $time;
		-ms-transition: all $time;
		-o-transition: all $time;
		transition: all $time;
	}

	/* pay-result */
	.pay-result {
		.pay-result-cot {

			.img {
				margin: 0 auto;

				image {
					width: 100%;
				}
			}

			.title {
				font-size: 16px;
				line-height: 1;
				text-align: center;
				margin-top: 25px;
			}

			.text {
				font-size: 12px;
				color: $grey;
				text-align: center;
				margin-top: 10px;

				.num {
					color: $red;
				}
			}
		}

	}
</style>
