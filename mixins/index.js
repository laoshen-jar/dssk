import {
	nodeShow
} from '../utils/utils.js'
import config from '../config/config.js'
import {
	mapActions
} from 'vuex'
export const commonMixin = {
	computed: {

	},
	data() {
		return {
			staticUrl: config.StaticUrl,
		}
	},
	methods: {
		...mapActions(["NeedStore", "NeedMember", "NeedDesk", "NeedBusiness", "NeedBusinessConfig"]),
		Vshow(condition) {
			return nodeShow(condition);
		},
	}
}
