import { apiResquest } from '@/utils/request'

//商品列表
export function GetGoodsList(parameter) {
    return apiResquest({
        url: '/Integral/Goods/GetList',
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
//提交商品订单
export function SubGoodOrder(parameter) {
    return apiResquest({
        url: '/Integral/GoodsOrder/Create',
        method: 'post',
        data: parameter
    });
}
//兑换记录列表
export function GoodsOrderList(parameter) {
    return apiResquest({
        url: '/Integral/GoodsOrder/GetList',
        method: 'post',
        data: parameter
    });
}