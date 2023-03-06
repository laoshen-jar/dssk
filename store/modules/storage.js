//数据存储中心，用于存放全局数据缓存

import Vue from 'vue'
import { GetStoreList } from './../../api/store'

const active = {
    state: {
        AllStore: [], // 所有门店
        BusinessConfig: {}, // 商家配置 
        StoreConfig: {}, //门店配置

        PersonOptions: [], //创建订单人数配置项
        FlavorOptions: [], //创建订单口味配置项

        EditingOrder: null,
        EditingBill: null,
    },

    mutations: {
        set_AllStore: (state, value) => {
            state.AllStore = value;
            Vue.ls.set('AllStore', value, 60 * 60 * 1000);
        },
        set_BusinessConfig: (state, value) => {
            state.BusinessConfig = value;
            Vue.ls.set('BusinessConfig', value, 60 * 60 * 1000);
        },
        set_StoreConfig: (state, value) => {
            state.StoreConfig = value;
            Vue.ls.set('StoreConfig', value, 60 * 60 * 1000);
        },

        set_PersonOptions: (state, value) => {
            state.PersonOptions = value;
            Vue.ls.set('PersonOptions', value, 60 * 60 * 1000);
        },
        set_FlavorOptions: (state, value) => {
            state.FlavorOptions = value;
            Vue.ls.set('FlavorOptions', value, 60 * 60 * 1000);
        },

        set_EditingOrder: (state, value) => {
            state.EditingOrder = value;
            Vue.ls.set('EditingOrder', value, 60 * 60 * 1000);
        },
        set_EditingBill: (state, value) => {
            state.EditingBill = value;
            Vue.ls.set('EditingBill', value, 60 * 60 * 1000);
        },
    },

    actions: {
        InitAllStore({ commit }, BusinessCode) {
            return new Promise((resolve, reject) => {
                var parameter = {};
                parameter.BusinessCode = BusinessCode;
                GetStoreList(parameter).then(res => {
                    console.log("GetStoreList.res", res);
                    if (res.state == 200) { commit('set_AllStore', res.data);
                        resolve(res); } else { reject(new GetStoreList(res)); }
                }).catch(error => { console.log("GetMember.catch", error);
                    reject(error); });
            });
        },
        InitBusinessConfig({ commit }, BusinessCode) { commit('set_BusinessConfig', {}); },
        InitStoreConfig({ commit }, StoreCode) { commit('set_StoreConfig', {}); },

        InitPersonOptions({ commit }, StoreCode) { commit('set_PersonOptions', {}); },
        InitFlavorOptions({ commit }, StoreCode) { commit('set_FlavorOptions', {}); },

        InitEditingOrder({ commit }, MemberCode, StoreCode, DeskID) { commit('set_EditingOrder', {}); },
        InitEditingBill({ commit }, MemberCode, StoreCode, DeskID) { commit('set_EditingBill', {}); },
    }
}

export default active