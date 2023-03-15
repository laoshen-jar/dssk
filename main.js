import App from './App'
import store from './store/index.js'
import {
	apiResquest
} from './utils/request.js'
import {
	getUrlQuery,
	showLoading,
	hideLoading,
	showToast,
} from './utils/utils.js'
import {
	setStorage,
	getStorage,
	removeStorage
} from './store/mp-storage';

// #ifndef VUE3

import Vue from 'vue'

import iconfont from './components/zgwit-iconfont/iconfont.vue'
Vue.config.productionTip = false
Vue.prototype.$api = apiResquest
Vue.prototype.$getUrlQuery = getUrlQuery
Vue.prototype.$setStorage = setStorage
Vue.prototype.$getStorage = getStorage
Vue.prototype.$removeStorage = removeStorage
Vue.prototype.$showLoading = showLoading
Vue.prototype.$hideLoading = hideLoading
Vue.prototype.$showToast = showToast

App.mpType = 'app'

Vue.component('iconfont', iconfont);

import './components/zgwit-iconfont/iconfont.css'
import './static/css/reset.css';
import './static/css/global.css';

try {
	function isPromise(obj) {
		return (
			!!obj &&
			(typeof obj === "object" || typeof obj === "function") &&
			typeof obj.then === "function"
		);
	}

	// 统一 vue2 API Promise 化返回格式与 vue3 保持一致
	uni.addInterceptor({
		returnValue(res) {
			if (!isPromise(res)) {
				return res;
			}
			return new Promise((resolve, reject) => {
				res.then((res) => {
					if (res[0]) {
						reject(res[0]);
					} else {
						resolve(res[1]);
					}
				});
			});
		},
	});
} catch (error) {}

const app = new Vue({
	...App,
	store
})
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
export function createApp() {
	const app = createSSRApp(App)
	return {
		app
	}
}
// #endif
