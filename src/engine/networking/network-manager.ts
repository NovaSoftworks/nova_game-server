import { v4 as uuidv4 } from 'uuid'
import { RawData, WebSocket } from 'ws'
import { LogUtils } from '../utils'
import { Client, NetworkMessage } from '.'

/** Manages network connections and messaging for the game server.
 */
export class NetworkManager {
    private clients: Map<string, Client>

    constructor() {
        this.clients = new Map<string, Client>()
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

            this.clients.set(networkId, new Client(ws, networkId))
            this.handleClientConnected(networkId, ws)

            ws.on('message', (message) => {
                this.handleMessageReceived(networkId, message)
            })

            ws.on('close', () => {
                this.handleClientDisconnected(networkId)
                this.clients.delete(networkId)
            })

            ws.on('error', (err) => {
                LogUtils.error('NetworkManager', `Client ${networkId} raised: ${err.message}`)
            })
        })
    }

    /** Broadcasts a message to all connected clients.
     *
     * @param {NetworkMessage} message - The message to broadcast.
     */
    broadcastMessage(message: NetworkMessage) {
        for (const client of this.clients.values()) {
            client.sendMessage(message)
        }
    }

    private generateNetworkId(): string {
        return uuidv4()
    }

    private clientExists(networkId: string): boolean {
        return this.clients.has(networkId)
    }

    private handleClientConnected(networkId: string, ws: WebSocket) {
        LogUtils.info('NetworkManager', `Client connected: ${networkId}`)
        if (this.clientExists(networkId)) {
            const client = this.clients.get(networkId)!
            client.sendMessage({
                type: 'connection_ok',
                payload: {
                    network_id: networkId,
                    clients: [...this.clients.keys()]
                }
            })

            this.broadcastMessage({
                type: "client_connected",
                payload: {
                    network_id: networkId
                }
            })
        }
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
        if (this.clientExists(networkId)) {
            const parsedMessage: NetworkMessage = JSON.parse(message.toString())
            const client = this.clients.get(networkId)!

            switch (parsedMessage.type) {
                case 'ping':
                    client.sendMessage({
                        type: 'pong',
                        payload: parsedMessage.payload
                    })
                    LogUtils.debug('NetworkManager', `ping received from client ${networkId}`)
                    break
                case 'pong':
                    client.rtt = Date.now() - parsedMessage.payload['timestamp']
                    LogUtils.debug('NetworkManager', `pong received from client ${networkId}`)
                    break
                default:
                    LogUtils.warn('NetworkManager', `Unhandled message type received from client ${networkId}: ${parsedMessage.type}`)
                    break
            }
        }
    }
}
