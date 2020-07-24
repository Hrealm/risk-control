import Vue from 'vue';
import Router from 'vue-router';
const routerPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error=> error)
}

Vue.use(Router);

export default new Router({
    mode: 'hash',
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/',
            component: () => import('../components/common/Home.vue'),
            meta: { title: '自述文件' },
            children: [
                {
                    path: '/dashboard',
                    component: () => import('../components/page/Dashboard.vue'),
                    meta: { title: '首页' }
                },
                {
                    path: '/CustomerSource',
                    component: () => import('../components/page/CustomerSourceMonitoring.vue'),
                    meta: { title: '客服货源监控' }
                },
                {
                    path: '/DispatchSource',
                    component: () => import('../components/page/DispatchSourceMonitoring.vue'),
                    meta: { title: '调度货源监控' }
                },
                {
                    path: '/OrderMonitoring',
                    component: () => import('../components/page/OrderMonitoring.vue'),
                    meta: { title: '订单监控' }
                },
                {
                    path: '/WaybillMonitoring',
                    component: () => import('../components/page/WaybillMonitoring.vue'),
                    meta: { title: '运单监控' }
                },
                {
                    path: '/BreachProcessing',
                    component: () => import('../components/page/BreachProcessing.vue'),
                    meta: { title: '异常处理' }
                },
                {
                    path: '/404',
                    component: () => import('../components/page/404.vue'),
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: () => import('../components/page/403.vue'),
                    meta: { title: '403' }
                },
            ]
        },
        {
            path: '/login',
            component: () => import('../components/login/Login.vue'),
            meta: { title: '登录' }
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
});
