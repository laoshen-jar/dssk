import {
	nodeShow
} from '../utils/utils.js'
import config from '../config/config.js'
export const commonMixin = {
	computed: {

	},
	data() {
		return {
			staticUrl: config.StaticUrl
		}
	},
	methods: {
		Vshow(condition) {
			return nodeShow(condition);
		},
	}
}
