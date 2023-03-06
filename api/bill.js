import { apiResquest } from '@/utils/request'

//消费记录
export function GetBillList(parameter) {
    return apiResquest({
        url: '/Member/Bill/GetList',
        method: 'post',
        data: parameter
    });
}
//消费详情
export function GetBillDetail(parameter) {
    return apiResquest({
        url: '/Operation/BillInfo',
        method: 'post',
        data: parameter
    });
}
//加载账单评价规则
export function GetCommentRules(parameter) {
    return apiResquest({
        url: '/Comment/BillComment/Get',
        method: 'post',
        data: parameter
    });
}
//保存账单评价
export function SubmitComment(parameter) {
    return apiResquest({
        url: '/Comment/BillComment/Create',
        method: 'post',
        data: parameter
    });
}
//加载账单评价记录
export function GetBillComment(parameter) {
    return apiResquest({
        url: '/Comment/BillComment/GetBillComment',
        method: 'post',
        data: parameter
    });
}