// 同步緩存本地async为true, 默认false
export const setStorage = (key, value, async = false) => {
	if (!async) {
		uni.setStorageSync(key, value);
	} else {
		uni.setStorage({
			key,
			data: value
		})
	}
}

export const getStorage = (key, async = false) => {
	if (!async) {
		return uni.getStorageSync(key) || null;
	} else {
		return new Promise((resolve, reject) => {
			uni.getStorage({
				key,
				success(res) {
					resolve(res.data)
				},
				fail() {
					reject(null)
				}
			})
		})
	}
}

export const removeStorage = (key, async = false) => {
	if (!async) {
		uni.removeStorageSync(key);
	} else {
		uni.removeStorage({
			key,
			success(res) {
				resolve(res.data)
			},
			fail(res) {
				console.log('删除缓存失败', res)
			}
		})
	}
}
