// 封装websocket，加入心跳检测，防止前后端websocket无端关闭但另一方不知道
class HeartbeatWebSocket{
    constructor(url,func){
        this.websocket = null
        // 超时重连时间
        this.timeout = 2*60*1000
        this.serverTimeoutObj =  null

        this.init(url,func)
    }
    init(url,handleOnMessage){
        // 判断是否有websocket
        if(window.WebSocket){
            if(!this.websocket){
                this.websocket = new WebSocket(url)
            }
        }else{
            console.log('not support websocket')
            return 
        }
        
        // 连接成功后，开始心跳检测
        this.websocket.onopen = (e)=>{
            this.reset().start()
            console.log('heartbeatWebsocket connected succesfully')
        }
        this.websocket.onerror = ()=>{
            console.log('heartbeatWebsocket onerror')
            this.init(url,handleOnMessage)
        }
        this.websocket.onmessage = (e)=>{
            // 收到任何消息，都代表连接还正常，重置心跳检测
            this.reset().start()
            if(e.data!=='pong'){
                handleOnMessage(e.data)
            }
        }
        this.websocket.onclose = ()=>{
            console.log('heartbeatWebsocket onclose')
            clearInterval(this.serverTimeoutObj)
        }

    }
    reset(){
        clearInterval(this.serverTimeoutObj)
        return this
    }
    start(){
        this.serverTimeoutObj = setInterval(()=>{
            // 已连接，正在通信
            if(this.websocket.readyState === 1){
                this.websocket.send('ping')
            }else{
                console.log('heartbeatWebsocket停止，状态码为：'+this.websocket.readyState)
                this.websocket.close()
                // 如果连接失败，则一直重连
                this.init(url,handleOnMessage)
            }
        },this.timeout)
    }

}

export default HeartbeatWebSocket;