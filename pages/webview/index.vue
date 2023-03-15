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
			if (option.url) {
				this.webviewUrl = decodeURIComponent(option.url);
			}
		},
		methods: {
			getMessage(e) {
				console.log(e);
				this.$setStorage('testmemberCode', e.detail);
			}
		}
	}
</script>

<style>

</style>
