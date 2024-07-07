import { v4 as uuidv4 } from 'uuid'
import { WebSocket, WebSocketServer } from 'ws'

import { NetworkHandler, NetworkMessage, NetworkMessageEvent, NetworkMiddleware } from './'
import { NovaEventBus } from '../events'
import { LogUtils } from '../utils'

export type ConnectionHandle = string

export class NetworkManager {
    server?: WebSocketServer
    clients: Map<ConnectionHandle, WebSocket> = new Map<ConnectionHandle, WebSocket>()
    handlers: NetworkHandler[] = []
    middlewares: NetworkMiddleware[] = []

    constructor(public eventBus: NovaEventBus) { }

    addHandler(handler: NetworkHandler) {
        this.handlers.push(handler)
    }

    addMiddleware(middleware: NetworkMiddleware) {
        this.middlewares.push(middleware)
    }

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

                const processedMessage = this.middlewares.reduce((m, mw) =>
                    mw.processIncomingMessage ? mw.processIncomingMessage(m) : m,
                    message
                )

                let handled = this.handlers.some(h => h.handleMessage(connectionHandle, processedMessage))

                if (!handled) {
                    LogUtils.debug('NetworkManager', `Unhandled message type: '${message.type}'`)
                    this.eventBus.publish(new NetworkMessageEvent(message.type, message.payload, message.error))
                }
            })

            socket.on('close', () => {
                LogUtils.info('NetworkManager', `Client disconnected: ${connectionHandle}`)
                this.clients.delete(connectionHandle)
            })
        })
    }

    sendMessage(connectionHandle: ConnectionHandle, message: NetworkMessage) {
        const socket = this.clients.get(connectionHandle)
        if (!socket) {
            LogUtils.error('NetworkManager', `Could not send message to client '${connectionHandle}': socket not found'`)
            return
        }

        if (socket.readyState != WebSocket.OPEN) {
            LogUtils.error('NetworkManager', `Could not send message to client '${connectionHandle}': socket closed `)
            return
        }

        const processedMessage = this.middlewares.reduce((m, mw) =>
            mw.processOutgoingMessage ? mw.processOutgoingMessage(m) : m,
            message
        )

        socket.send(JSON.stringify(processedMessage))
    }

    generateConnectionHandle(): ConnectionHandle {
        return uuidv4()
    }
}