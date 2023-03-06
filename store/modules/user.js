import Vue from 'vue'
import store from '@/store'
import { GetMember } from './../../api/member'
import { GetBusiness } from './../../api/business'
import { GetStore } from './../../api/store'
import { GetDesk } from './../../api/baseinfo'

const user = {
    state: {
        token: '',
        roles: [],
        info: {},
        business: {},
        store: {},
        desk: {},
        order: {}
    },

    mutations: {
        SET_TOKEN: (state, token) => {
            state.token = token
        },
        SET_ROLES: (state, roles) => {
            state.roles = roles
        },
        SET_INFO: (state, info) => {
            state.info = info
        },
        Set_Business: (state, value) => {
            state.business = value
        },
        Set_Store: (state, value) => {
            state.store = value
        },
        Set_Desk: (state, value) => {
            state.desk = value
        },
        Set_Order: (state, value) => {
            state.order = value
        }
    },
    actions: {
        LoadUser({ commit }, openidOrMemberCode) {
            return new Promise((resolve, reject) => {
                var parameter = {};
                parameter.MemberCodeOrOpenID = openidOrMemberCode;
                GetMember(parameter).then(res => {
                    if (res.state == 200) {
                        console.log("GetMember.res", res);
                        const result = res.data;
                        commit('SET_INFO', result)
                        parameter = {};
                        parameter.BusinessCode = result.BusinessCode;
                        GetBusiness(parameter).then(res => {
                            if (res.state == 200) {
                                console.log("GetMember.res", res);
                                commit('Set_Business', res.data)
                            } else {
                                reject(new Error(res));
                            }
                        }).catch(error => {
                            reject(error)
                        })
                    } else {
                        reject(new Error(res));
                    }
                    resolve(res)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        SetStore({ commit }, storecode) {
            return new Promise((resolve, reject) => {
                var parameter = {};
                parameter.StoreCode = storecode;
                GetStore(parameter).then(res => {
                    if (res.state == 200) {
                        console.log("GetStore.res", res);
                        commit('Set_Store', res.data)
                    } else {
                        reject(new Error(res));
                    }
                    resolve(res)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        SetDesk({ commit }, deskid) {
            return new Promise((resolve, reject) => {
                var parameter = {};
                parameter.DeskID = deskid;
                GetDesk(parameter).then(res => {
                    if (res.state == 200) {
                        console.log("GetDesk.res", res);
                        commit('Set_Desk', res.data)
                    } else {
                        reject(new Error(res));
                    }
                    resolve(res)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        SetOrder({ commit }, order) {
            commit('Set_Order', order);
        },

    }
}

export default user