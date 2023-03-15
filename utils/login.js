import {
	GetByMiniOpenID
} from '../api/member.js'

export const loginToGetMember = () => {
	const appId = getApp().globalData.AppId;
	const secret = getApp().globalData.AppSecret;
	uni.login({
		"provider": "weixin",
		"onlyAuthorize": true,
		success: function(res1) {
			console.log('login1');
			console.log(res1);
			const {
				code
			} = res1;
			// 利用code向微信请求获取openid
			uni.request({
				//这里填你自己的appid 和 wxspSecret 
				url: "https://api.weixin.qq.com/sns/jscode2session?appid=" + appId +
					"&secret=" + secret + "&js_code=" + code +
					"&grant_type=authorization_code",
				method: "POST",
				success(res2) {
					console.log('------------------')
					console.log(res2)
					// 获取用户信息
					uni.getUserInfo({
						"provider": "weixin",
						success: function(res3) {
							console.log('login3');
							console.log(res3);
							const {
								userInfo
							} = res3;
							//客户端成功获取授权临时票据（code）,向业务服务器发起登录请求。
							GetByMiniOpenID({
								MiniAppID: appId,
								MiniOpenID: res2.data.openid,
								NickName: userInfo.nickName,
								HeadImgUrl: userInfo.avatarUrl
							}).then(res4 => {
								console.log(res4);
								// 设置
								uni.setStorageSync('webviewUrl', res4.data);
								// 如果有membercode 
								// uni.reLaunch({
								// 	url: '/pages/index/index'
								// })
								// 如果是url
								// const url = encodeURIComponent(res4.data.url)
								// uni.reLaunch({
								// 	url: '/pages/webview/index?url=' + url
								// })
							}).catch(err => {
								console.log('登录接口出现错误');
								console.log(err);
							})
						},
						fail: function(err) {
							console.log(err)
							// 登录授权失败  
							// err.code是错误码
						}
					})
				},
				fail(data) {}
			})
		},
		fail: function(err) {
			console.log(err)
			// 登录授权失败  
			// err.code是错误码
		}
	})
}
