import {
	apiResquest
} from '@/utils/request'


export function GetMember(parameter) {
	return apiResquest({
		url: '/Member/Get',
		method: 'post',
		data: parameter
	});
}
//会员等级列表
export function GetMemberRankList(parameter) {
	return apiResquest({
		url: '/Member/MemberRank/GetList',
		method: 'post',
		data: parameter
	});
}
//会员等级详情
export function GetMemberRankDetail(parameter) {
	return apiResquest({
		url: '/Member/MemberRank/Get',
		method: 'post',
		data: parameter
	});
}

//会员等级特权列表
export function GetPrivilegeList(parameter) {
	return apiResquest({
		url: '/Member/MemberRankPrivilege/GetList',
		method: 'post',
		data: parameter
	});
}
//会员等级特权详情
export function GetPrivilegeDetail(parameter) {
	return apiResquest({
		url: '/Member/MemberRankPrivilege/Get',
		method: 'post',
		data: parameter
	});
}
//会员储值信息
export function GetStoredInfo(parameter) {
	return apiResquest({
		url: '/Stored/Get',
		method: 'post',
		data: parameter
	});
}
//会员积分记录
export function GetIntegralRecord(parameter) {
	return apiResquest({
		url: '/Integral/Record',
		method: 'post',
		data: parameter
	});
}
export function GetByMiniOpenID(params) {
	return apiResquest({
		service: 'WeiXin',
		url: '/Mini/GetByMiniOpenID?MiniAppID' + params.MiniAppID + '&Code=' + params.Code + '&NickName=' +
			params.NickName + '&HeadImgUrl=' + params.HeadImgUrl + '&Redirect_Url=' + params.Redirect_Url + '&Debug=1',
		method: 'post',
		data: params
	});
}
export function GetEmployee(parameter) {
	return apiResquest({
		url: '/Member/Fans/GetEmployee',
		method: 'post',
		data: parameter
	});
}
export function UpdatePhone(parameter) {
	return apiResquest({
		url: '/Member/Update/Phone',
		method: 'post',
		data: parameter
	});
}
