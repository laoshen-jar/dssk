export const initInfo = (vue) => {
	var StoreCode = vue.$getUrlQuery().options?.StoreCode;
	if (StoreCode) {
		vue.$setStorage("StoreCode", StoreCode);
	}

	var DeskID = vue.$getUrlQuery().options?.DeskID;
	if (DeskID)
		vue.$setStorage('DeskID', DeskID);
	var DeskCode = vue.$getUrlQuery().options?.DeskCode;

	// var MemberCode = vue.$getUrlQuery().options?.MemberCode;
	var MemberCode = 'ee492fce4f124c0f8461f9cd35d58e0b';
	if (MemberCode != null) {
		vue.$setStorage('MemberCode', MemberCode);
	}
	uni.showLoading({
		title: '加載中',
		mask: true
	})
	try {
		vue.NeedMember(vue).then(res => {
			vue.NeedBusiness(vue).then(res => {
				vue.NeedBusinessConfig(vue).then(res => {
					if (vue.$getStorage('StoreCode')) {
						vue.NeedStore({
							StoreCode: vue.$getStorage('StoreCode')
						})
					}
					if (vue.DeskID || (vue.StoreCode && DeskCode)) {
						vue.NeedDesk({
							DeskID: vue.DeskID || '',
							StoreCode: vue.StoreCode || '',
							DeskCode: DeskCode
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
