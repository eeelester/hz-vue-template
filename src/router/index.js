import Vue from 'vue'
import VueRouter from 'vue-router'
const App = () => import('../App.vue')

Vue.use(VueRouter)

// 公共路由，无权限限制
export const commonRoutes = [
    {
        path: '/'
    },
    {
        path: '/App',
        name: 'App',
        component: App
    },
]

// 需要权限限制的路由
export const asyncRoutes = []

const router = new VueRouter({
    routes: commonRoutes
})



export default router