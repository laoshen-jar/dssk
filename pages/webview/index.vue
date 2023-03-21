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
				if (res) {
					this.webviewUrl = res;
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
