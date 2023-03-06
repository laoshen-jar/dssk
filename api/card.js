import { apiResquest } from '@/utils/request'

export function GetBillCard(parameter) {
    return apiResquest({
        url: '/Card/MemberCard/GetBillCard',
        method: 'post',
        data: parameter
    })
}
//获取会员卡券列表
export function GetCardList(parameter) {
    return apiResquest({
        url: '/Card/MemberCard/GetList',
        method: 'post',
        data: parameter
    })
}
//获取会员卡券详情
export function GetCardInfo(parameter) {
    return apiResquest({
        url: '/Card/MemberCard/Get',
        method: 'post',
        data: parameter
    })
}
//获取卡券适用门店
export function GetAvailablestores(parameter) {
    return apiResquest({
        url: '/Card/Get/Apply/Store',
        method: 'post',
        data: parameter
    })
}
//获取卡券详情
export function GetCard(parameter) {
    return apiResquest({
        url: '/Card/Get',
        method: 'post',
        data: parameter
    })
}
//获取卡券详情（领取卡券专用）
export function GetReceiveCard(parameter) {
    return apiResquest({
        url: '/Card/GetReceiveCard',
        method: 'post',
        data: parameter
    })
}

//领取卡券（领取卡券专用）
export function SendCard(parameter) {
    return apiResquest({
        url: '/Card/Send',
        method: 'post',
        data: parameter
    })
}

//卡券限领判断
export function GetLimitState(parameter) {
    return apiResquest({
        url: '/Card/GetLimitState',
        method: 'post',
        data: parameter
    })
}