<template>
	<view>
		<web-view :src="webviewUrl" @message="getMessage"></web-view>
	</view>
</template>

<script>
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
				console.log(res)
				if (res.state === 200 && res.data.JumpUrl) {
					this.webviewUrl = res.data.JumpUrl;
				}
				if(res.state === 200 && res.data.MemberCode) {
					if(option.url) {
						this.$setStorage('MemberCode', res.data.MemberCode);
						// uni.redirectTo({
						// 	url: option.url
						// })
						uni.redirectTo({
							url: '/pages/index/index'
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
			getMessage(e) {
				console.log(e);
				this.$setStorage('testmemberCode', e.detail);
			}
		}
	}
</script>

<style scoped>

</style>
