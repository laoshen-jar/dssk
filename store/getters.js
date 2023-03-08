import Vue from 'vue';
import moment from 'moment';
import {
	getStorage
} from './mp-storage.js'

const getters = {
	MemberCode: state => {
		return getStorage('MemberCode');
	},
	BusinessCode: state => {
		return getStorage('BusinessCode');
	},
	StoreCode: state => {
		return getStorage('StoreCode');
	},
	DeskID: state => {
		return getStorage('DeskID');
	},
	Person: state => {
		return getStorage('Person');
	},
	Member: state => {
		return state.active.member == null ? {} : state.active.member
	},
	Business: state => state.active.business,
	BusinessConfig: state => state.active.businessconfig,
	Store: state => state.active.store,
	Desk: state => state.active.desk,
	OpenService: state => state.active.OpenService,
	MediaService: state => state.active.MediaService,
	WeiXinService: state => state.active.WeiXinService,
	Branch: state => state.active.Branch,
	ActivityStartTime: state => state.active.ActivityStartTime,
	ActivityEndTime: state => state.active.ActivityEndTime,

	OnActivity: state => moment() > moment(state.active.ActivityStartTime) && moment(new Date()) < moment(state
		.active.ActivityEndTime),
}

export default getters
