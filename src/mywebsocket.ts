import * as ws from 'ws';

const clients: any = {}
let clinetNum = 0

const server: any = new ws.Server({
    // host: "127.0.0.1",
    port: 6080,
    clientTracking: true,
    verifyClient: socketVerify //可选，验证连接函数
})

function socketVerify(info: any) {
    const origin = info.origin.match(/^(:?.+\:\/\/)([^\/]+)/);
    if (origin.length >= 3 && origin[2].includes('jd.com')) {
        return true; //如果是来自jd.com的连接，就接受
    }
    return false; //否则拒绝
}

//广播
server.broadcast = function broadcast(msg: string) {
    for(let key in clients) {
        clients[key].send(msg)
    }
    // server.clients.forEach(function each(client: any) {
    //     vscode.window.showInformationMessage(`clients信息: ${client}`);
    //     client.send(msg);
    // })
}

function websocket_add_listener(client: any) {
    client.on('close', function() {
        delete clients[client.name]
        // console.log('client close')
    })
    client.on('error', function(err: string) {
        delete clients[client.name]
        // console.log('error', err)
    })
    client.on('message', function(data: any) {
        // clients[client.name] = client
        // console.log('接收到消息:', data)
        client.send(JSON.stringify({
            "websocket_type": "heartbeat"
        }))
    })
}

// connection 事件, 有客户端接入进来;
function on_server_client_comming(client: any) {
    client.name = ++clinetNum
    clients[clinetNum] = client
    // console.log("客户端接进来了");
    websocket_add_listener(client);
}


server.on('connection', on_server_client_comming)

server.on('error', () => {
    // console.log('websocket服务端出错')
})

export default server