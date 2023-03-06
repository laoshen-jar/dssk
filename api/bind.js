import { apiResquest } from '@/utils/request'

//查询导入会员
export function GetImportMember(parameter) {
    return apiResquest({
        url: '/Member/Import/Get/',
        method: 'post',
        data: parameter
    })
}
//绑定导入会员
export function BindMember(parameter) {
    return apiResquest({
        url: '/Member/Import/Bind/',
        method: 'post',
        data: parameter
    })
}
//查询绑定信息
export function GetBindInfo(parameter) {
    return apiResquest({
        url: '/Member/Import/GetBind/',
        method: 'post',
        data: parameter
    })
}
//解除绑定会员
export function RemoveBind(parameter) {
    return apiResquest({
        url: '/Member/Import/RelieveBind/',
        method: 'post',
        data: parameter
    })
}
//会员储值充值
export function AddStored(parameter) {
    return apiResquest({
        url: '/Stored/Recharge/',
        method: 'post',
        data: parameter
    })
}
//会员积分充值
export function AddIntegral(parameter) {
    return apiResquest({
        url: '/Integral/Add',
        method: 'post',
        data: parameter
    })
}