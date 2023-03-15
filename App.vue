<script>
	export default {
		globalData: {
			AppId: 'wx0d3bf44f8e588998',
			AppSecret: 'a46188369431b104214c8a325db0f00e'
		},
		onLaunch: function() {


		},
		onShow: function() {
			console.log('App Show')
			console.log(this.$getUrlQuery())
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
</style>
