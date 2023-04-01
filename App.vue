<script>
	import {
		getMemberCode
	} from './utils/login.js'
	export default {
		globalData: {
			isInit: false,
		},
		onLaunch: async function() {
			console.log('onLaunch');
			getMemberCode(this);
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
</style>
