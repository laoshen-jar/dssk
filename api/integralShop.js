import { apiResquest } from '@/utils/request'

//商品列表
export function GetGoodsList(parameter) {
    return apiResquest({
        url: '/Integral/Goods/GetListMove',
        method: 'post',
        data: parameter
    });
}
//商品详情
export function GetGoodsInfo(parameter) {
    return apiResquest({
        url: '/Integral/Goods/Get',
        method: 'post',
        data: parameter
    });
}