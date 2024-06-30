import { v4 as uuidv4 } from 'uuid'
import { WebSocket } from 'ws'

export class ConnectionUtils {
    static sendMessage(socket: WebSocket, message: NetworkMessage) {
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(message))
        }
    }

    static generateNetworkId(): string {
        return uuidv4()
    }
}

export interface NetworkMessage {
    type: string,
    payload?: any
    error?: string
}