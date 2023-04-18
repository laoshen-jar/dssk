import { apiResquest } from '@/utils/request'

export function CreatePayOrder(parameter) { return apiResquest({ url: '/Pay/Create', method: 'post', data: parameter }); }
export function GetPayOrder(parameter) { return apiResquest({ url: '/Pay/Get', method: 'post', data: parameter }); }
export function UpdatePayOrderState(parameter) { return apiResquest({ url: '/Pay/UpdateState', method: 'post', data: parameter }); }
export function PayPut(parameter) { return apiResquest({ url: '/Pay/PayPut', method: 'post', data: parameter }); }

export function CreatePayOrderAPI(parameter) { return apiResquest({ url: '/Pay/PayOrder/Create', method: 'post', data: parameter }); }
export function QueryPayOrderAPI(parameter) { return apiResquest({ url: '/Pay/PayOrder/Query', method: 'post', data: parameter }); }
export function UpdatePayOrderStateAPI(parameter) { return apiResquest({ url: '/Pay/UpdateState', method: 'post', data: parameter }); }
export function PayPutAPI(parameter) { return apiResquest({ url: '/Pay/PayPut', method: 'post', data: parameter }); }


export function TakePayOrder(parameter) { return apiResquest({ url: '/Pay/PayOrder/Create', method: 'post', data: parameter }); }
export function GetPayState(parameter) { return apiResquest({ url: '/Pay/PayOrder/GetPayState', method: 'post', data: parameter }); }


