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
			console.log('option', option);
			app.globalData.getInfo = (res) => {
				console.log('获取用户信息.res',res);
				const redirectUrl = option.Url ? option.Url : '/pages/storeList/index';
				if (res.state === 200 && res.data.JumpUrl) {
					console.log('执行公众号和小程序用户关联')
					console.log('webviewUrl', res.data.JumpUrl + "&JumpUrl=" + redirectUrl);
					this.webviewUrl = res.data.JumpUrl + "&JumpUrl=" + redirectUrl || '';
				}
				console.log('已完成公众号和小程序用户关联，直接进入应用')
				if (res.state === 200 && res.data.MemberCode) {
					uni.hideLoading();
					console.log('redirectUrl', redirectUrl);
					if (redirectUrl) {
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
				uni.hideLoading();
				this.$setStorage('MemberCode', e.detail.data[0].MemberCode);
				initInfo(this);
			}
		}
	}
</script>

<style scoped>

</style>