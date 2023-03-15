import {
	nodeShow
} from '../utils/utils.js'
import {
	StaticUrl
} from '../config/config.js'
export const commonMixin = {
	computed: {

	},
	data() {
		return {
			staticUrl: StaticUrl
		}
	},
	methods: {
		Vshow(condition) {
			return nodeShow(condition);
		}
	}
}
