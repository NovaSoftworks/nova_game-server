import { greet as cliGreet } from "./cli"
import { PlayerConnection } from "./components"
import { NovaEngine } from "./engine/nova-engine"
import { WebSocket } from 'ws'
import { createMap } from "./map"
import { PlayerEntityDebugSystem } from "./systems"

cliGreet()
NovaEngine.start()
NovaEngine.world.createSystem(PlayerEntityDebugSystem)
createMap()

const port = 80

const wss = new WebSocket.Server({ port: port }, () => {
})

wss.on('listening', () => {
    console.log(`${new Date().toISOString()};INFO;;;;Listening on port ${port}.`)
})

wss.on('connection', (ws) => {
    handleNewConnection(ws)
})

function handleNewConnection(connection: WebSocket) {
    connection.on('message', (message) => {
        try {
            const data = JSON.parse(message.toString())

            if (data.type == 'connect') {
                const username = data.username
                if (username === undefined) {
                    console.log(`${new Date().toISOString()};INFO;connect;failure;;Username field missing.`)
                    connection.send(JSON.stringify({
                        type: 'error',
                        message: `Cannot connect without a username.`
                    }))
                } else {
                    console.log(`${new Date().toISOString()};INFO;connect;success;${username};`)

                    const connectedPlayer = NovaEngine.world.createEntity()
                    NovaEngine.world.addComponent(connectedPlayer, new PlayerConnection(Date.now().toString(), username, connection))
                    connection.send(JSON.stringify({
                        type: 'connect_ok',
                        id: connectedPlayer.id,
                        username: username,
                        server_tick: NovaEngine.stepNumber
                    }))
                }
            }
        } catch (e: any) {
            console.log(`${new Date().toISOString()};ERROR;;;;Could not interpret request.`)
            connection.send(JSON.stringify({
                type: 'error',
                message: `Could not interpret request.`,
                request: message
            }))
        }
    })

    connection.on('close', () => { // This is currently close to System logic, however based on the WebSocket events. Should this be refactored or moved?
        // Player has disconnected, destroy their entity
        const entities = NovaEngine.world.queryEntities(PlayerConnection)
        for (const entity of entities) {
            const playerConnection = NovaEngine.world.getComponent(entity, PlayerConnection)!

            if (playerConnection.socket === connection) {

                console.log(`${new Date().toISOString()};INFO;disconnect;success;${playerConnection.username};`)

                // NovaEngine.world.destroyEntity(entity.id) // to move to a system
                break
            }
        }
    })
}