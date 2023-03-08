// 获取当前页面参数
export const getUrlQuery = () => {
	const pages = getCurrentPages();
	return pages[pages.length - 1];
}

// 加载loading
// 使用完加载loading 需要有对应的关闭loading
// 关闭loading  uni.hideLoading()
export const showLoading = (title, mask = true) => {
	uni.showLoading({
		title: title || '加载中',
		mask
	})
}

export const hideLoading = () => {
	uni.hideLoading()
}
