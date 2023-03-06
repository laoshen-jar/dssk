import { apiResquest } from '@/utils/request'

export function CreateOrder(parameter) { return apiResquest({ url: '/TsOrder/CreateOrder', method: 'post', data: parameter }); }
export function GetBill(parameter) { return apiResquest({ url: '/TsOrder/GetBill', method: 'post', data: parameter }); }
export function GetOrder(parameter) { return apiResquest({ url: '/TsOrder/Get', method: 'post', data: parameter }); }
export function GetEditingOrder(parameter) { return apiResquest({ url: '/TsOrder/GetEditing', method: 'post', data: parameter }); }
export function GetWaitingOrder(parameter) { return apiResquest({ url: '/TsOrder/GetWaiting', method: 'post', data: parameter }); }
export function GetOrderState(parameter) { return apiResquest({ url: '/TsOrder/GetOrderState', method: 'post', data: parameter }); }
export function LoadDishMenu(parameter) { return apiResquest({ url: '/TsOrder/GetDish', method: 'post', data: parameter }); }
export function AddDish(parameter) { return apiResquest({ url: '/TsOrder/AddDish', method: 'post', data: parameter }); }
export function BackDish(parameter) { return apiResquest({ url: '/TsOrder/BackDish', method: 'post', data: parameter }); }
export function ChangeDesk(parameter) { return apiResquest({ url: '/TsOrder/Change/Desk', method: 'post', data: parameter }); }
export function ChangePeopleNumber(parameter) { return apiResquest({ url: '/TsOrder/Change/PeopleNumber', method: 'post', data: parameter }); }
export function ChangeRemark(parameter) { return apiResquest({ url: '/TsOrder/Change/Remark', method: 'post', data: parameter }); }
export function LockOrder(parameter) { return apiResquest({ url: '/TsOrder/Change/Lock', method: 'post', data: parameter }); }
export function UnLockOrder(parameter) { return apiResquest({ url: '/TsOrder/Change/UnLock', method: 'post', data: parameter }); }
export function PutOrder(parameter) { return apiResquest({ url: '/TsOrder/Put', method: 'post', data: parameter }); }
export function GeteTidings(parameter) { return apiResquest({ url: '/TsOrder/GeteTidings', method: 'post', data: parameter }); }
export function ClearDish(parameter) { return apiResquest({ url: '/TsOrder/ClearDish', method: 'post', data: parameter }); }


export function CreateCheckOrder(parameter) { return apiResquest({ url: '/TsOrder/CheckOrder/Create', method: 'post', data: parameter }); }
export function CheckEffective(parameter) { return apiResquest({ url: '/TsOrder/CheckEffective', method: 'post', data: parameter }); }
export function BillCheckEffective(parameter) { return apiResquest({ url: '/TsOrder/BillCheckEffective', method: 'post', data: parameter }); }