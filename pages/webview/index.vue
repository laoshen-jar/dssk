<template>
	<view>
		<web-view :src="webviewUrl" @message="getMessage"></web-view>
	</view>
</template>

<script>
	import {
		initInfo
	} from '../../utils/initBaseInfo.js';
	import {
		mapActions,
	} from 'vuex';
	export default {
		data() {
			return {
				webviewUrl: ''
			}
		},
		onLoad(option) {
			const app = getApp();
			app.globalData.getInfo = (res) => {
				console.log('获取信息');
				console.log(res);
				const redirectUrl = option.url ? option.url : '/pages/index/index';
				if (res.state === 200 && res.data.JumpUrl) {
					this.webviewUrl = res.data.JumpUrl + "&JumpUrl=" + redirectUrl;
				}
				if (res.state === 200 && res.data.MemberCode) {
					if (option.url) {
						this.$setStorage('MemberCode', res.data.MemberCode);
						initInfo(this);
						uni.redirectTo({
							url: redirectUrl
						})
					}
					// this.$setStorage('MemberCode', res.data.MemberCode);
					// // uni.redirectTo({
					// // 	url: option.url
					// // })
					// uni.redirectTo({
					// 	url: '/pages/index/index'
					// })
				}
			}
		},
		onShow() {
			
		},
		methods: {
			...mapActions(['InitMember', 'NeedMember', 'NeedBusinessConfig', 'NeedBusiness', 'NeedStore', 'NeedDesk']),
			getMessage(e) {
				console.log(e.detail);
				this.$setStorage('MemberCode', e.detail.data[0].MemberCode);
				initInfo(this);
			}
		}
	}
</script>

<style scoped>

</style>
