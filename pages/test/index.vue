<template>
	<view>
		<span @click="test">点我</span>
		<p>
			{{b}}
		</p>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				a: '',
				b: ''
			}
		},
		methods: {
			test() {
				uni.scanCode({
					onlyFromCamera: true,
					success (res) {
						console.log('条码类型：' + res.scanType);
						console.log('条码内容：' + res.result);
						console.log(res);
					}
				});
			}
		}
	}
</script>

<style>

</style>
