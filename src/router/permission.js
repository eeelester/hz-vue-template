import router from './index'
import store from '../store.js'

// router.beforeEach(async(to,from,next)=>{
//     const hasRoutes = store.getters.routes
//     if(hasRoutes&&hasRoutes.length>0){
//         // 角色存在
//         next()
//     }else{
//         // 先请求获取角色
//         const role =  await store.dispatch('getRole')

//         const accessRoutes = await store.dispatch('generateRoutes',role)
//         router.addRoutes(accessRoutes)
//         // getLoginUserMemu接口返回為空，無權限
//         if(accessRoutes.find(item=>item.name==='main').children.length===0){
//             next({name:'noAuth'})
//         }else{
//             let firstPageName = accessRoutes.find(item=>item.name==='main').children[0].name
//             // 如果一開始進來，重定向到第一個菜單頁
//             if(to.path==='/'){
//                next({name:firstPageName,replace:true})
//             }else{
//                next({path:to.path,query:to.query})
//             }
//         }

//     }
    
// })