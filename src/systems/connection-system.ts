import { Connection, NetworkIdentity } from "../components"
import { System } from "../engine/ecs"
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
            this.world.addComponent(entity, new Connection(ws))

            const connection = this.world.getComponent(entity, Connection)!

            ws.on('message', (data) => {
                const parsedMessage: NetworkMessage = JSON.parse(data.toString())
                connection.bufferMessage(parsedMessage)
            })

            ws.on('close', () => {
                LogUtils.info('NetworkManager', `Client disconnected.`)
            })
        })
    }

    updateFixed(fixedDeltaTime: number) {
        const connectedEntities = this.world.queryEntities(Connection)

        for (const e of connectedEntities) {
            const connection = this.world.getComponent(e, Connection)!
            this.answerPings(connection)
        }
    }

    private answerPings(connection: Connection) {
        const pings = connection.getMessages('ping')
        if (pings.length < 1)
            return
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