import Vue from 'vue'
import vuex from 'vuex'
import createPersistedState from "vuex-persistedstate";
Vue.use(vuex);
export default new vuex.Store({
    state: {
        loginData: {},
        dispatchTimeout: 0,
        customTimeout: 0,
        orderTimeout: 0,
        waybillTimeout: 0
    },
    mutations: {
        setLoginData(state, n){
            state.loginData = n
        },
        setDispatchMonitoring(state, n){
            state.dispatchTimeout = n
        },
        setCustomMonitoring(state, n){
            state.customTimeout = n
        },
        setOrderMonitoring(state, n){
            state.orderTimeout = n
        },
        setWaybillMonitoring(state, n){
            state.waybillTimeout = n
        }
    },
    plugins: [createPersistedState()]
})
