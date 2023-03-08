<script>
	export default {
		onLaunch: function() {
			uni.login({
				"provider": "weixin",
				"onlyAuthorize": true, // 微信登录仅请求授权认证
				success: function(event) {
					const {
						code
					} = event
					//客户端成功获取授权临时票据（code）,向业务服务器发起登录请求。
				},
				fail: function(err) {
					console.log(err)
					// 登录授权失败  
					// err.code是错误码
				}
			})
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
