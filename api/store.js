import { apiResquest } from '@/utils/request'

//获取列表
export function GetStoreList(parameter) {
    return apiResquest({
        url: '/Org/Store/GetList',
        method: 'post',
        data: parameter
    });
}
//门店详情
export function GetStore(parameter) {
    return apiResquest({
        url: '/Org/Store/Get',
        method: 'post',
        data: parameter
    });
}
//门店组列表
export function GetAreaList(parameter) {
    return apiResquest({
        url: '/Org/Store/Area/GetList',
        method: 'post',
        data: parameter
    });
}