<template>
	<div>
		<div class="subscribe">
			<div class="miniinfo">关注公众号</div>
			<div class="content">
				<div class="logo" :style="'background-image: url('+Business.LogoUrl+') ;'"></div>
				<div class="info">
					<div class="title">{{Business.BusinessName}}</div>
					<div class="remark">积分、储值优惠等更多活动信息</div>
				</div>
				<!-- <div class="btn" @click="GotoGuanZhu">关注</div> -->
				<!-- <div class="btn" @click="ShowSubscribePage=true">关注</div>  -->
			</div>
		</div>
		<SubscribePage v-if="ShowSubscribePage" @OnClose="ShowSubscribePage=false"></SubscribePage>
	</div>
</template>

<script>
	import {
		mapActions,
		mapGetters
	} from "vuex";
	import SubscribePage from './SubscribePage.vue';
	export default {
		components: {
			SubscribePage,
		},
		computed: {
			...mapGetters(["Business"]),
		},
		data() {
			return {
				ShowSubscribePage: false
			}
		},
		methods: {
			GotoGuanZhu() {
				window.location.href =
					"https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzU2MTcxOTgzMA==#wechat_redirect";
			}
		},
	}
</script>

<style scoped>
	.subscribe {
		position: absolute;
		bottom: 10px;
		left: 10px;
		right: 10px;
		height: 100px;
		border: 1px solid #e3e3e3;
		padding: 5px 10px;
		background-color: #fffdff;
		border-radius: 3px;
	}

	.subscribe .miniinfo {
		color: #ccc;
		font-size: 10px;
		font-weight: bold;
	}

	.subscribe .content {
		position: relative;
		padding: 10px 0;
	}

	.subscribe .content .logo {
		width: 50px;
		height: 50px;
		border-radius: 25px;
		background-size: cover;
	}

	.subscribe .content .info {
		position: absolute;
		left: 60px;
		top: 10px;
		right: 100px;
		color: #333;
		font-size: 12px;
	}

	.subscribe .content .info .title {
		font-size: 16px;
		font-weight: bold;
		color: #000;
		line-height: 30px;
	}

	.subscribe .content .btn {
		position: absolute;
		right: 10px;
		top: 50%;
		margin-top: -15px;
		width: 64px;
		text-align: center;
		line-height: 26px;
		border: 1px solid #1aad19;
		border-radius: 3px;
		font-size: 16px;
		color: #1aad19;
	}
</style>
