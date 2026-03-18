
import { IWSocketOption, IWSocketPackage, WSocketPackageType } from "./types";



export class WSocket {
    private url: string = null;
    private ws: WebSocket = null;
    private option: IWSocketOption = {
        heartbeatInterval: 3000,
        reconnectInterval: 5000,
        reconnectMaxCount: 3,
    };

    private heartbeatTimer: NodeJS.Timeout = null;
    private reconnectTimer: NodeJS.Timeout = null;
    private reconnectCount: number = 0;
    private isAlive: boolean = false;
    private isManualClose: boolean = false;
    public netDelay: number = 0;
    public messageHandler: (pack: IWSocketPackage) => void = null;

    constructor(url: string, option?: IWSocketOption) {
        this.url = url
        this.option = { ...this.option, ...option };
    }
    /*检查连接状态*/
    public get isConnected(): boolean {
        return this.ws?.readyState === WebSocket.OPEN;
    }

    public connect() {
        const existStates: number[] = [WebSocket.OPEN, WebSocket.CONNECTING];
        if (existStates.includes(this.ws?.readyState)) return;
        this.isManualClose = false;
        this.ws = new WebSocket(this.url)
        this.ws.onopen = this.onOpen.bind(this);
        this.ws.onclose = this.onClose.bind(this);
        this.ws.onerror = this.onError.bind(this);
        this.ws.onmessage = this.onMessage.bind(this);
    }

    /** 主动关闭连接 */
    public close() {
        this.isManualClose = true;
        this.stopHeartbeat();
        this.stopReconnect();
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }

    private onOpen() {
        console.log(`websocket 连接成功`);
        this.isAlive = true;
        this.reconnectCount = 0;
        this.stopReconnect();
        this.startHeartbeat();
    }

    private onClose() {
        console.log(`websocket 连接关闭`);
        this.stopHeartbeat();
        this.tryReconnect();
    }

    private onError(e: Event) {
        console.error(`websocket 连接错误`, e);
    }

    private onMessage(event: MessageEvent) {
        // console.log(`websocket 收到消息`);
        let pack: IWSocketPackage
        try {
            pack = JSON.parse(event.data);
        } catch (error) {
            console.error(`websocket 处理消息出错`, error);
        }
        if (pack.type === WSocketPackageType.heartbeat && pack.action === `pong`) {
            this.isAlive = true;
            this.netDelay = Date.now() - Number(pack.data.timeStamp);
            // console.log(`心跳回包，还活着, 网络延迟: ${this.netDelay}ms`)
        } else {
            this.messageHandler?.(pack);
        }
    }

    /** 发送消息 */
    public send(pack: IWSocketPackage) {
        let str = JSON.stringify(pack);
        this.ws?.send(str);
    }

    /**启动心跳 */
    private startHeartbeat() {
        this.heartbeatTimer = setInterval(() => {
            if (this.ws?.readyState !== WebSocket.OPEN) return;
            if (this.isAlive) {
                this.isAlive = false;
                this.send({
                    type: WSocketPackageType.heartbeat,
                    action: `ping`,
                    data: { timeStamp: Date.now().toString() },
                })
                // console.log(`心跳包发送成功`);
            } else {
                console.log(`心跳检测失败，连接已断开，尝试重连`);
                this.stopHeartbeat();
                this.ws?.close();
            }
        }, this.option.heartbeatInterval)
    }

    private stopHeartbeat() {
        if (!this.heartbeatTimer) return;
        clearInterval(this.heartbeatTimer);
        this.heartbeatTimer = null;
    }

    /** 尝试重连 */
    private tryReconnect() {
        if (this.isManualClose) return;
        if (this.reconnectCount >= this.option.reconnectMaxCount) {
            console.warn(`重连次数已达上限 (${this.option.reconnectMaxCount})，停止自动重连`);
            return;
        }
        this.reconnectCount++;
        console.log(`${this.option.reconnectInterval}ms 后进行第 ${this.reconnectCount} 次自动重连`);
        this.reconnectTimer = setTimeout(() => {
            this.connect();
        }, this.option.reconnectInterval);
    }

    /** 停止重连 */
    private stopReconnect() {
        if (!this.reconnectTimer) return;
        clearTimeout(this.reconnectTimer);
        this.reconnectTimer = null;
    }
}