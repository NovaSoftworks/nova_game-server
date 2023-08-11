import { v4 as uuidv4 } from 'uuid'
import { RawData, WebSocket } from 'ws'
import { LogUtils } from '../utils'
import { NetworkMessage } from './network-message'

/** Manages network connections and messaging for the game server.
 */
export class NetworkManager {
    private sockets: Map<string, WebSocket>

    constructor() {
        this.sockets = new Map<string, WebSocket>()
    }

    /** Starts the WebSocket server on the given port.
     *
     * @param {number} port - The port on which to start the WebSocket server.
     */
    startServer(port: number): void {
        LogUtils.info('NetworkManager', 'Starting server')
        const wss = new WebSocket.Server({ port: port })

        wss.on('listening', () => {
            LogUtils.info('NetworkManager', `Listening on port ${port}`)
        })

        wss.on('error', (err) => {
            LogUtils.error('NetworkManager', err.message)
        })

        wss.on('connection', (ws) => {
            const networkId = this.generateNetworkId()

            this.sockets.set(networkId, ws)
            this.handleClientConnected(networkId, ws)

            ws.on('message', (message) => {
                this.handleMessageReceived(networkId, message)
            })

            ws.on('close', () => {
                this.handleClientDisconnected(networkId)
                this.sockets.delete(networkId)
            })

            ws.on('error', (err) => {
                LogUtils.error('NetworkManager', `Client ${networkId} raised: ${err.message}`)
            })
        })
    }

    /** Sends a message to a specific client by network ID.
     *
     * @param {string} networkId - The unique ID of the client.
     * @param {NetworkMessage} message - The message to send.
     */
    sendMessage(networkId: string, message: NetworkMessage) {
        const socket = this.sockets.get(networkId)

        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(message))
        }
    }

    /** Broadcasts a message to all connected clients.
     *
     * @param {NetworkMessage} message - The message to broadcast.
     */
    broadcastMessage(message: NetworkMessage) {
        for (const socket of this.sockets.values()) {
            if (socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify(message))
            }
        }
    }

    private generateNetworkId(): string {
        return uuidv4()
    }

    private handleClientConnected(networkId: string, ws: WebSocket) {
        LogUtils.info('NetworkManager', `Client connected: ${networkId}`)
        this.sendMessage(networkId, {
            type: 'connection_ok',
            payload: {
                network_id: networkId,
                clients: [...this.sockets.keys()]
            }
        })

        this.broadcastMessage({
            type: "client_connected",
            payload: {
                network_id: networkId
            }
        })
    }

    private handleClientDisconnected(networkId: string) {
        LogUtils.info('NetworkManager', `Client disconnected: ${networkId}`)
        this.broadcastMessage({
            type: "client_disconnected",
            payload: {
                network_id: networkId
            }
        })
    }

    private handleMessageReceived(networkId: string, message: RawData) {
        const parsedMessage: NetworkMessage = JSON.parse(message.toString())
        switch (parsedMessage.type) {
            case 'ping':
                this.sendMessage(networkId, {
                    type: 'pong',
                    payload: parsedMessage.payload
                })
                break;
            default:
                LogUtils.warn('NetworkManager', `Unhandled message type received from client ${networkId}: ${parsedMessage.type}`)
                break;
        }
    }
}
