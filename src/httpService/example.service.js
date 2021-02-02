import HttpCommonService from './common/HttpCommonApi'
export default{
    test(){
        return HttpCommonService.post('hehehehe')
    }
}