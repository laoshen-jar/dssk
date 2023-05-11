import { apiResquest } from '@/utils/request'

//获得商家详情
export function GetBusiness(parameter) {
    return apiResquest({
        url: '/Org/Business/Get',
        method: 'post',
        data: parameter
    });
}
//获得商家配置
export function GetBusinessConfig(parameter) {
	console.log('asdfasdfsadf', parameter)
    return apiResquest({
        url: '/Org/Business/Config/Get',
        method: 'post',
        data: parameter
    });
}