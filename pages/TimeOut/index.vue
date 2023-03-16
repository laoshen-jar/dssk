<template>
	<div class="bodybox">
		<div class="title">{{MemberName}}，欢迎光临！</div>
		<image class="pic" :src="staticUrl + 'images/timeout.png'"></image>
		<div class="msg">台位信息已失效</div>
		<div class="describe">您需要重新扫码台位二维码</div>
		<navigator class="closebtn" url="" target="miniProgram" open-type="exit">关闭</navigator>
		<navigator open-type="reLaunch" url="../dishMenu/index.vue">随便看看</navigator>
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
	} from "vuex";
	export default {
		data() {
			return {
				StoreCode: ''
			}
		},
		mixins: [commonMixin],
		computed: {
			...mapGetters(["Member"]),
			MemberName() {
				return this.Member.MemberName ? this.Member.MemberName : this.Member.NickName
			},
		},
		onShow() {
			this.StoreCode = this.$getUrlQuery().options.StoreCode;
			this.$removeStorage("DeskID")
			this.$store.commit('set_Desk', null);
		},
	}
</script>

<style scoped>
	body {
		background-color: #f7f7f7;
	}

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

	.msg {
		font-size: 18px;
		line-height: 30px;
		;
	}

	.describe {
		font-size: 14px;
		color: #707070;
		line-height: 30px;
		;
	}

	.pic {
		width: 350px;
		height: 150px;
		background-size: 50%;
	}

	.tomore {
		font-size: 14px;
		color: #707070;
	}

	.closebtn {
		background: #eb5429;
		width: 260px;
		line-height: 40px;
		margin: 30px auto;
		text-align: center;
		font-size: 14px;
		color: white;
		border-radius: 20px;
	}

	.order-list-box .title-box {
		height: 45px;
		line-height: 45px;
		text-align: center;
		font-size: 16px;
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
