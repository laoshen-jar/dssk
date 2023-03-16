import {
	GetByMiniOpenID
} from '../api/member.js'

export const loginToGetMember = () => {
	const appId = 'wx0d3bf44f8e588998';
	const secret = 'a46188369431b104214c8a325db0f00e';
	return new Promise((resolve, reject) => {
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
								resolve({
									MiniAppID: appId,
									MiniOpenID: res2.data.openid,
									NickName: userInfo.nickName,
									HeadImgUrl: userInfo.avatarUrl
								})
							},
							fail: function(err) {
								// 登录授权失败
								console.log('wx获取用户信息失败');
								console.log(err)
								reject(null);
							}
						})
					},
					fail(data) {
						console.log('wx获取openid失败');
						console.log(data)
						reject(null);
					}
				})
			},
			fail: function(err) {
				// 登录授权失败
				// err.code是错误码
				console.log('wx获取code错误')
				console.log(err)
				reject(null)
			}
		})
	})
}

export const getMemberCode = async (app) => {
	const params = await loginToGetMember();
	if (params) {
		GetByMiniOpenID(params).then(res => {
			console.log(res);
			if (app.globalData.getInfo) {
				app.globalData.getInfo('asdfkjlasjdlfkjasdf');
			}

			// 扫码多带一个url参数,告诉H5下一步跳那个页面, 小程序将member信息存入

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
	} else {
		uni.showModal({
			content: '登录失败，请重试',
			showCancel: false,
			success(res) {
				if (res.confirm) {
					getMemberCode();
				}
			}
		})
	}
}
