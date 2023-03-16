<script>
	import {
		getMemberCode
	} from './utils/login.js'
	export default {
		globalData: {

		},
		onLaunch: async function() {
			getMemberCode(this);
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
