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
		title: title || '加载中…',
		mask
	})
}

export const hideLoading = () => {
	uni.hideLoading()
}

// 小程序不支持position, 只能居中显示
export const showToast = (title = '', icon = 'none', duration = 2000) => {
	uni.showToast({
		title,
		icon,
		duration
	})
}

// 小程序不支持v-show
export const nodeShow = (condition) => {
	return !condition ? 'v-show-hidden' : ''
}
