import Vue from 'vue';
import moment from 'moment';

const getters = {
	MemberCode: state => {
		return Vue.ls.get('MemberCode');
	},
	BusinessCode: state => {
		return Vue.ls.get('BusinessCode');
	},
	StoreCode: state => {
		return Vue.ls.get('StoreCode');
	},
	DeskID: state => {
		return Vue.ls.get('DeskID');
	},
	Person: state => {
		return Vue.ls.get('Person');
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
