import { NetworkMessage } from "."
import { WebSocket } from 'ws'

export class Client {
    public socket: WebSocket
    public networkId: string
    public username?: string
    public rtt?: number
    public messagesBuffer: NetworkMessage[]

    constructor(socket: WebSocket, networkId: string, username?: string) {
        this.socket = socket
        this.networkId = networkId
        this.username = username
        this.messagesBuffer = []
    }

    /** Sends a message to this client.
     *
     * @param {NetworkMessage} message - The message to send.
     */
    sendMessage(message: NetworkMessage) {
        const socket = this.socket

        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(message))
        }
    }
}
