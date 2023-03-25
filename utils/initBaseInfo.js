export const initInfo = (vue) => {
	var StoreCode = vue.$getUrlQuery().options?.StoreCode;
	// var StoreCode = 'e3f4d329e18f4e28bf59516cd3be14d0';
	if (StoreCode) {
		vue.$setStorage("StoreCode", StoreCode);
	}

	var DeskID = vue.$getUrlQuery().options?.DeskID;
	// var DeskID = 'e77bf9ca5cdb4f78b3e20280fb1c3a66';
	if (DeskID) {
		vue.$setStorage('DeskID', DeskID);
	}
	var DeskCode = vue.$getUrlQuery().options?.DeskCode;

	var MemberCode = vue.$getUrlQuery().options?.MemberCode;
	// var MemberCode = 'ee492fce4f124c0f8461f9cd35d58e0b';
	if (MemberCode != null) {
		vue.$setStorage('MemberCode', MemberCode);
	}
	uni.showLoading({
		title: '加载中…',
		mask: true
	})
	const app = getApp();
	try {
		vue.NeedMember(vue).then(res => {
			vue.NeedBusiness(vue).then(res => {
				vue.NeedBusinessConfig(vue).then(res => {
					if (vue.$getStorage('StoreCode')) {
						vue.NeedStore({
							StoreCode: vue.$getStorage('StoreCode')
						})
					}
					app.globalData.isInit = true;
					console.log('--------------')
					console.log(DeskID);
					if (DeskID || (vue.StoreCode && DeskCode)) {
						vue.NeedDesk({
							DeskID: DeskID || '',
							StoreCode: vue.StoreCode || '',
							DeskCode: DeskCode || ''
						})
					}
				})
			})
		});
	} catch (err) {
		console.log(err)
	} finally {
		uni.hideLoading()
	}
}
