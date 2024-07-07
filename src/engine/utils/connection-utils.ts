import { WebSocket } from 'ws'
import { NetworkManager, NetworkMessage } from '../networking'
import { LogUtils } from './log-utils'

export class ConnectionUtils {
    private static networkManager: NetworkManager

    static initialize(networkManager: NetworkManager) {
        ConnectionUtils.networkManager = networkManager
    }

    static sendMessage(connectionHandle: string, message: NetworkMessage) {
        if (this.networkManager) {
            this.networkManager.sendMessage(connectionHandle, message)
        } else {
            LogUtils.error('ConnectionUtils', 'You must initialize ConnectionUtils with a NetworkManager to send messages.')
        }
    }
}

