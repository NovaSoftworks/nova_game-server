import { v4 as uuidv4 } from 'uuid'
import { WebSocket, WebSocketServer } from 'ws'

import { NetworkMessage, NetworkMessageEvent } from './'
import { NovaEventBus } from '../events'
import { LogUtils } from '../utils'

type ConnectionHandle = string

export class NetworkManager {
    server?: WebSocketServer
    clients: Map<ConnectionHandle, WebSocket> = new Map<ConnectionHandle, WebSocket>()

    constructor(public eventBus: NovaEventBus) { }

    startServer(port: number) {

        LogUtils.info('NetworkManager', 'Starting server')
        const server = new WebSocket.Server({ port: port })
        this.server = server

        server.on('listening', () => {
            LogUtils.info('NetworkManager', `Listening on port ${port}`)
        })

        server.on('error', (err) => {
            LogUtils.error('NetworkManager', err.message)
        })

        server.on('connection', (socket) => {
            const connectionHandle = this.generateConnectionHandle()
            LogUtils.info('NetworkManager', `Client connected: ${connectionHandle}`)
            this.clients.set(connectionHandle, socket)

            socket.on('message', (data) => {
                const message: NetworkMessage = JSON.parse(data.toString())

                LogUtils.debug('NetworkManager', `Unhandled message type: '${message.type}'`)
                this.eventBus.publish(new NetworkMessageEvent(message.type, message.payload, message.error))
            })

            socket.on('close', () => {
                LogUtils.info('NetworkManager', `Client disconnected: ${connectionHandle}`)
                this.clients.delete(connectionHandle)
            })
        })
    }

    sendMessage(connectionHandle: string, message: NetworkMessage) {
        const socket = this.clients.get(connectionHandle)

        if (socket) {
            if (socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify(message))
            } else {
                LogUtils.error('NetworkManager', 'Can not send a network message with an unopened socket')
            }
        } else {
            LogUtils.error('NetworkManager', 'Can not send a network message without a socket')
        }
    }

    generateConnectionHandle(): string {
        return uuidv4()
    }
}