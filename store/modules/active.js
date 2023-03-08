import Vue from 'vue'
import {
	GetBusiness,
	GetBusinessConfig
} from './../../api/business'
import {
	GetStore
} from './../../api/store'
import {
	GetMember
} from './../../api/member'
import {
	GetDesk
} from './../../api/baseinfo'
import {
	setStorage,
	getStorage
} from '../mp-storage';
import DSSKData from './DSSKData.json'
import store from '@/store'

const active = {
	state: {
		member: {},
		business: null,
		store: null,
		desk: null,
		businessconfig: null,
		// MediaService: "http://www.dsskvip.com/api/",
		// WeiXinService: "http://weixin.dsskvip.com",

		// OpenService: document.domain.indexOf('localhost') >= 0 || document.domain.indexOf('192.168') >= 0 ?
		// 	"http://open.yubustep.cn/" : window.location.protocol + "//" + window.location.host +
		// 	'/', //'http://open.yubustep.cn/'//window.location.protocol+"//"+window.location.host+'/api/'
		// // OpenService: 'http://fengchen180.imwork.net:35646/',
		// MediaService: document.domain.indexOf('localhost') >= 0 || document.domain.indexOf('192.168') >= 0 ?
		// 	"http://open.yubustep.cn/" : "http://open." + document.domain.split('.').slice(-2).join(
		// 	'.'), //"http://open.yubustep.cn/",
		// WeiXinService: document.domain.indexOf('localhost') >= 0 || document.domain.indexOf('192.168') >= 0 ?
		// 	"http://weixin.yubustep.cn/" : "http://weixin." + document.domain.split('.').slice(-2).join(
		// 	'.'), //"http://weixin.yubustep.cn"
		// Branch: document.domain.indexOf('localhost') >= 0 || document.domain.indexOf('192.168') >= 0 ? "DSSK" :
		// 	document.domain.indexOf('dsskvip.com') >= 0 ? "DSSK" : document.domain.indexOf('192.168.31.240') >= 0 ?
		// 	"DSSK" : "Base", // 分支,Base,DSSK

		ActivityStartTime: '2023-01-14 00:00',
		ActivityEndTime: '2023-01-15 18:00',
	},

	mutations: {
		set_Member: (state, value) => {
			state.member = value
		},
		set_Business: (state, value) => {
			state.business = value
		},
		set_Store: (state, value) => {
			state.store = value
		},
		set_Desk: (state, value) => {
			state.desk = value
		},
		set_BusinessConfig: (state, value) => {
			state.businessconfig = value
		},
	},
	actions: {
		PushErrorPage({
			commit
		}, me, res, msg = '') {},
		// 需要加载会员对象，页面Created时执行，放在头部，在then中执行后续内容，确保对象获取完成
		NeedMember({
			commit
		}, me) {
			return new Promise((resolve, reject) => {
				// if (!store.getters.Member || store.getters.Member.MemberCode != store.getters.MemberCode) {
				if (true) {
					// if (!store.getters.MemberCode) {
					if (!true) {
						reject({
							state: 505,
							msg: "页面访问超时，请退出重新进入"
						});
					} else {
						console.log("getMember");
						GetMember({
								MemberCodeOrOpenID: store.getters.MemberCode
							})
							.then(res => {
								console.log(res)
								if (res.state == 200) {
									setStorage('BusinessCode', res.data.BusinessCode);
									commit('set_Member', res.data);
									resolve(res);
								} else {
									console.error("NeedMember.error", res);
									reject(res);
								}
							}).catch(error => {
								console.error("NeedMember.catch", error);
								reject(error);
							});
					}
				} else {
					resolve({
						state: 200,
						msg: '会员已加载',
						data: store.getters.Member
					})
				}
			})
		},
		RefreshMember({
			commit
		}, me) {
			return new Promise((resolve, reject) => {
				if (!store.getters.MemberCode) {
					reject({
						state: 505,
						msg: "页面访问超时，请退出重新进入"
					});
				} else {
					GetMember({
							MemberCodeOrOpenID: store.getters.MemberCode
						})
						.then(res => {
							if (res.state == 200) {
								setStorage('BusinessCode', res.data.BusinessCode);
								commit('set_Member', res.data);
								resolve(res);
							} else {
								console.error("NeedMember.error", res);
								reject(res);
							}
						}).catch(error => {
							console.error("NeedMember.catch", error);
							reject(error);
						});
				}
			})
		},
		// 需要加载商家对象，页面Created时执行，放在头部，在then中执行后续内容，确保对象获取完成
		NeedBusiness({
			commit
		}, me) {
			return new Promise((resolve, reject) => {
				console.log('NeedBusiness', store.getters.OnActivity, store.getters.Branch == 'DSSK')
				// console.log('NeedBusiness',new Date().getTime(),store.getters.ActivityStartTime)
				if (store.getters.OnActivity && store.getters.Branch == 'DSSK' && store.getters
					.BusinessCode == 'c5e6baa9861e452dbd420bc16721e474') {
					commit('set_Business', DSSKData.Business);
					resolve({
						state: 200,
						data: DSSKData.Business
					});
				} else if (!store.getters.Business) {
					GetBusiness({
						BusinessCode: store.getters.BusinessCode
					}).then(res => {
						// console.log('GetBusiness',JSON.stringify(res.data));
						if (res.state == 200) {
							commit('set_Business', res.data);
							resolve(res)
						} else {
							reject(res);
						}
					}).catch(error => {
						reject(error)
					})
				} else {
					resolve({
						state: 200,
						msg: '商家已加载',
						data: store.getters.Business
					})
				}
			})
		},
		// 需要加载商家配置对象，页面Created时执行，放在头部，在then中执行后续内容，确保对象获取完成
		NeedBusinessConfig({
			commit
		}, me) {
			return new Promise((resolve, reject) => {
				if (store.getters.OnActivity && store.getters.Branch == 'DSSK' && store.getters
					.BusinessCode == 'c5e6baa9861e452dbd420bc16721e474') {
					commit('set_BusinessConfig', DSSKData.BusinessConfig);
					resolve({
						state: 200,
						data: DSSKData.BusinessConfig
					});
				} else if (!store.getters.BusinessConfig || store.getters.BusinessConfig.BusinessCode != !
					store.getters.BusinessCode) {
					GetBusinessConfig({
							BusinessCode: store.getters.BusinessCode
						})
						.then(res => {
							// console.log('GetBusinessConfig',JSON.stringify(res.data));
							if (res.state == 200) {
								res.data.MpMenuConfig = JSON.parse(res.data.MpMenuConfigJson);
								res.data.TemplateMsgConfig = JSON.parse(res.data.TemplateMsgConfigJson);
								res.data.AdsenseConfig = JSON.parse(res.data.AdsenseConfigJson);
								res.data.MemberConfig = JSON.parse(res.data.MemberConfigJson);
								commit('set_BusinessConfig', res.data);
								resolve(res);
							} else {
								reject(res);
							}
						})
						.catch(error => {
							reject(error)
						})
				} else {
					resolve({
						state: 200,
						data: store.getters.BusinessConfig,
						msg: '商家配置已加载'
					})
				}
			})
		},
		// 需要加载门店对象，页面Created时执行，放在头部，在then中执行后续内容，确保对象获取完成
		NeedStore({
			commit
		}, me) {
			return new Promise((resolve, reject) => {
				var StoreCode = getStorage("StoreCode");
				console.log('NeedStore', store.getters.Store, store.getters.StoreCode, StoreCode);
				if (!store.getters.Store || store.getters.Store.StoreCode != StoreCode) {
					GetStore({
						StoreCode: StoreCode
					}).then(res => {
						if (res.state == 200) {
							commit('set_Store', res.data);
							resolve(res);
						} else {
							reject(res);
						}
					}).catch(error => {
						reject(error)
					})
				} else {
					resolve({
						state: 200,
						msg: '门店已加载',
						data: store.getters.Store
					})
				}
			})
		},
		// 需要加载台位对象，页面Created时执行，放在头部，在then中执行后续内容，确保对象获取完成
		NeedDesk({
			commit
		}, me) {
			return new Promise((resolve, reject) => {
				if (!store.getters.Desk || store.getters.Desk.DeskID != store.getters.DeskID) {
					GetDesk({
						DeskID: store.getters.DeskID,
						StoreCode: store.getters.StoreCode,
						DeskCode: me.DeskCode
					}).then(res => {
						if (res.state == 200) {
							if (res.data && res.data.State == 1) {
								commit('set_Desk', res.data);
							}
							resolve(res);
						} else {
							reject(res);
						}
					}).catch(error => {
						reject(error);
					});
				} else {
					resolve({
						state: 200,
						msg: '台位已加载',
						data: store.getters.Desk
					})
				}
			})
		},
	}
}

export default active
