<template>
	<view>
		<span @click="test">点我</span>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			test() {
				uni.redirectTo({
					url: '/pages/webview/index?url=123'
				})
			}
		}
	}
</script>

<style>

</style>
