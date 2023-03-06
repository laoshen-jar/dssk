import { apiResquest } from '@/utils/request'

export function GetStoredInfo(parameter) { return apiResquest({ url: '/Stored/Get', method: 'post', data: parameter }); }
export function GetStoredRuleActive(parameter) { return apiResquest({ url: '/Stored/Rule/Gradient/GetListActive', method: 'post', data: parameter }); }
export function CreateRecharge(parameter) { return apiResquest({ url: '/Stored/Recharge', method: 'post', data: parameter }); }
export function RechargeOK(parameter) { return apiResquest({ url: '/Stored/Recharge/OK', method: 'post', data: parameter }); }

export function GetStoredRecord(parameter) { return apiResquest({ url: '/Stored/GetRecord', method: 'post', data: parameter }); }
export function GetAccoutInfo(parameter) { return apiResquest({ url: '/Stored/Get', method: 'post', data: parameter }); }