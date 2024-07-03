import { parse } from "uuid"
import { Connection, ConnectionStatus, NetworkIdentity } from "../components"
import { Entity, System } from "../engine/ecs"
import { ConnectionUtils, LogUtils, NetworkMessage } from "../engine/utils"

import { WebSocket, RawData } from 'ws'

export class ConnectionSystem extends System {

    create() {
        const port = 8080

        LogUtils.info('NetworkManager', 'Starting server')
        const wss = new WebSocket.Server({ port: port })

        wss.on('listening', () => {
            LogUtils.info('NetworkManager', `Listening on port ${port}`)
        })

        wss.on('error', (err) => {
            LogUtils.error('NetworkManager', err.message)
        })

        wss.on('connection', (ws) => {
            LogUtils.info('NetworkManager', `Client connected.`)
            const entity = this.world.createEntity()
            const connection = new Connection(ws)
            connection.status = ConnectionStatus.Connected
            this.world.addComponent(entity, connection)

            ws.on('message', (data) => {
                const parsedMessage: NetworkMessage = JSON.parse(data.toString())
                connection.bufferMessage(parsedMessage)
            })

            ws.on('close', () => {
                connection.status = ConnectionStatus.Disconnected
                LogUtils.info('NetworkManager', `Client disconnected.`)
            })
        })
    }

    updateFixed(fixedDeltaTime: number) {
        const connectedEntities = this.world.queryEntities(Connection)

        for (const e of connectedEntities) {
            const connection = this.world.getComponent(e, Connection)!
            this.answerPings(connection)
            this.authenticate(connection, connectedEntities)
        }
    }

    authenticate(connection: Connection, connectedEntities: Entity[]) {
        const authenticationMessages = connection.getMessages('authentication')
        if (authenticationMessages.length < 1) return
        const username = authenticationMessages[0].payload.username
        LogUtils.info('NetworkSystem', `Authentication request received for '${username}'`)

        if (username.length == 0) {
            ConnectionUtils.sendMessage(connection.socket, {
                type: 'authentication_error',
                payload: {
                    message: `Username can not be empty.`
                }
            })
            return
        }

        if (username.length < 3 || username.length > 16) {
            ConnectionUtils.sendMessage(connection.socket, {
                type: 'authentication_error',
                payload: {
                    message: `Username must be between 3 and 16 characters.`
                }
            })
            return
        }

        for (const e of connectedEntities) {
            const c = this.world.getComponent(e, Connection)!
            if (c.username == username) {
                ConnectionUtils.sendMessage(connection.socket, {
                    type: 'authentication_error',
                    payload: {
                        message: `Username '${username}' is already used.`
                    }
                })
                return
            }
        }

        connection.username = username
        ConnectionUtils.sendMessage(connection.socket, {
            type: 'authentication_ok',
            payload: {
                username: username
            }
        })
    }

    private answerPings(connection: Connection) {
        const pings = connection.getMessages('ping')
        if (pings.length < 1) return
        if (pings.length > 1)
            LogUtils.warn('NetworkSystem', 'More than one unanswered pings found: ' + pings.length)

        ConnectionUtils.sendMessage(connection.socket, {
            type: 'pong',
            payload: {
                original_timestamp: pings[0].payload.timestamp
            }
        })
    }
}