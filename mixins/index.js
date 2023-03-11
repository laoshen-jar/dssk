import {
	nodeShow
} from '../utils/utils.js'

export const commonMixin = {
	computed: {

	},
	methods: {
		Vshow(condition) {
			return nodeShow(condition);
		}
	}
}
