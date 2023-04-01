import {
	GetByMiniOpenID
} from '../api/member.js'
import { showToast } from './utils.js';

export const loginToGetMember = () => {
	return new Promise((resolve, reject) => {
		uni.login({
			"provider": "weixin",
			"onlyAuthorize": true,
			success: function(res1) {
				const {
					code
				} = res1;
				// 利用code向微信请求获取openid
				const accountInfo = uni.getAccountInfoSync();
				const appId = accountInfo.miniProgram.appId;
				console.log(appId)
				uni.getUserInfo({
					"provider": "weixin",
					success: function(res3) {
						const {
							userInfo
						} = res3;
						//客户端成功获取授权临时票据（code）,向业务服务器发起登录请求。
						resolve({
							MiniAppID: appId,
							// MiniOpenID: "oNk4L41C7oAnKzApjUyVDjOsPbaQ",
							Code: code,
							NickName: userInfo.nickName,
							HeadImgUrl: userInfo.avatarUrl,
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
	uni.showLoading({
		title: '加载中…',
	})
	const params = await loginToGetMember();
	if (params) {
		GetByMiniOpenID(params).then(res => {
			if (app.globalData.getInfo) {
				app.globalData.getInfo(res);
			}
		}).catch(err => {
			console.log('登录接口出现错误');
			uni.hideLoading();
			uni.showModal({
				content: '登录失败，请重试',
				showCancel: false,
				success(res) {
					if (res.confirm) {
						getMemberCode();
					}
				}
			})
			console.log(err);
		})
	} else {
		uni.hideLoading();
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
