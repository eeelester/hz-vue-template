/**
 * Created by Administrator on 2019/1/1.
 */
import axios from 'axios'
import errMsg from './errorMsg'
import qs from 'qs'
axios.interceptors.request.use(config=>{
    if(config.method==='get'){
        config.paramsSerializer = function(params){
            return qs.stringify(params,{arrayFormat: 'repeat'})
        }
    }
    return config
},error=>{
    return Promise.reject(error);
})

axios.interceptors.response.use(response => {
    // 後台現在是將錯誤碼放進response.data裡面，而不是放在statusCode那裡，所以在這里處理
    if(response&&response.data.code&&response.data.code!==200&&response.config.method!=='head'){
        let errObj = {
            msg: response.data.message,
            errStatus: response.data.code
          }
        errMsg.openMsg(errObj)
    }
    return response

}, error => {
    // 404進來
    if (error.response) {
        let errObj = {
        msg: error.message,
        errStatus: error.response.status
      }
      errMsg.openMsg(errObj)
  
      return Promise.solve()
    }else{
        window.location.href = window.$config.loginUrl
    }
    return Promise.reject(error);
})

export default axios;