/**
 * WebSocket 选项
 */
export interface IWSocketOption {
  heartbeatInterval?: number;
  reconnectInterval?: number;
  reconnectMaxCount?: number;
}

/**
 * 协议（只定义了type， action暂时没定义）
 */
export enum WSocketPackageType {
  heartbeat = 'heartbeat',
  pause_task = 'pause_task',
}


/**
 * 数据包格式
 */
export interface IWSocketPackage {
  type: WSocketPackageType;
  action: string;
  data?: any;
}