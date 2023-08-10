import { v4 as uuidv4 } from 'uuid'
import { RawData, WebSocket } from 'ws'
import { LogUtils } from '../utils'
import { NetworkMessage } from './network-message'

/** Manages network connections and messaging for the game server.
 */
export class NetworkManager {
    private clients: Map<string, WebSocket>

    constructor() {
        this.clients = new Map<string, WebSocket>()
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

            this.clients.set(networkId, ws)
            this.handleClientConnected(networkId, ws)

            ws.on('message', (message) => {
                this.handleMessageReceived(networkId, message)
            })

            ws.on('close', () => {
                this.handleClientDisconnected(networkId)
                this.clients.delete(networkId)
            })

            ws.on('message', (message) => {
                this.handleMessageReceived(networkId, message)
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
        const client = this.clients.get(networkId)

        if (client && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message))
        }
    }

    /** Broadcasts a message to all connected clients.
     *
     * @param {NetworkMessage} message - The message to broadcast.
     */
    broadcastMessage(message: NetworkMessage) {
        for (const client of this.clients.values()) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(message))
            }
        }
    }

    private generateNetworkId(): string {
        return uuidv4()
    }

    private handleClientConnected(networkId: string, ws: WebSocket) {
        LogUtils.info('NetworkManager', `Client connected: ${networkId}`)
        this.broadcastMessage({
            type: "client_connected",
            payload: {
                networkId: networkId
            }
        })
    }

    private handleClientDisconnected(networkId: string) {
        LogUtils.info('NetworkManager', `Client disconnected: ${networkId}`)
        this.broadcastMessage({
            type: "client_disconnected",
            payload: {
                networkId: networkId
            }
        })
    }

    private handleMessageReceived(networkId: string, message: RawData) {
        LogUtils.info('NetworkManager', `Incoming message from client ${networkId}`)
        LogUtils.debug('NetworkManager', `Incoming message from client ${networkId}: ${message.toString()}`)
    }
}