import Vue from 'vue'
export default {
  openMsg: function (errObj) {
    if (errObj && errObj.errStatus) {
      switch (errObj.errStatus) {
        case 302:
        case 303:
            window.location.href = window.$config.loginUrl
          break
        case 504:
            Vue.prototype.$notify({
                title: '請求失敗!',
                message: '網關錯誤，請聯繫管理員處理',
                type: 'error'
            })
          break
        case 404:
            Vue.prototype.$notify({
                title: '請求失敗!',
                message: '網絡異常，請嘗試刷新頁面',
                type: 'error'
            })
          break
        default:
            Vue.prototype.$notify({
                title: '請求失敗!',
                message: errObj.msg,
                type: 'error'
            })
      }
      throw errObj
    } else {
        Vue.prototype.$notify({
            title: '請求失敗!',
            message: '系統出錯，請聯繫管理員處理',
            type: 'error'
        })
      throw errObj
    }
  }
}
