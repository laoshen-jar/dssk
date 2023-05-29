import {
	apiResquest
} from '@/utils/request'

export function GetDesk(parameter) {
	return apiResquest({
		url: '/BaseInfo/Desk/Get/',
		method: 'post',
		data: parameter
	})
}
export function GetQrCodeImg(parameter) {
	return apiResquest({
		url: '/WeiXin/MakeQrCode',
		method: 'post',
		data: parameter
	});
}
