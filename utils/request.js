import config from './config.js'

export const apiResquest = (prams) => {
	let headerData = {
		'content-type': 'application/json'
	}
	return new Promise((resolve, reject) => {
		let url = config.BaseUrl + prams.url; //请求的网络地址和局地的api地址组合
		prams.loading && uni.showLoading({
			title: '加载中',
			mask: true
		})
		return uni.request({
			url: url,
			data: prams.data,
			timeout: config.Timeout,
			method: prams.method,
			header: headerData,
			success: (res) => {
				prams.loading && uni.hideLoading()
				//这里是成功的返回码，大家根据自己的实际情况调整
				// if (res.data.code !== '00000') {
				// 	uni.showToast({
				// 		title: '获取数据失败:' + res.data.msg,
				// 		duration: 1000,
				// 		icon: "none"
				// 	})
				// 	return;
				// }
				if (res.data.state === 200) {
					resolve(res.data)
				} else {
					// 错误返回
					resolve()
				}
			},
			fail: (err) => {
				reject(err);
				console.log(err)
			},
			complete: () => {
				console.log('请求完成')
				prams.loading && uni.hideLoading()
			}
		});
	})
}
