import { greet as cliGreet } from "./cli"
import { PlayerConnection } from "./components"
import { NovaEngine } from "./engine/nova-engine"
import { WebSocket } from 'ws'
import { createMap } from "./map"

cliGreet()
NovaEngine.start()
createMap()

const port = 80

const wss = new WebSocket.Server({ port: port }, () => {
})

wss.on('listening', () => {
    console.log(`${new Date().toISOString()};INFO;;;;Listening on port ${port}.`)
})

const connectedUsernames: string[] = []
const usernameTaken = (username: string) => { return connectedUsernames.includes(username) }

wss.on('connection', (connection) => {
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
                    return
                }

                if (usernameTaken(username)) {
                    console.log(`${new Date().toISOString()};INFO;connect;failure;${username};Already connected.`)
                    connection.send(JSON.stringify({
                        type: 'error',
                        message: `${username} is already connected.`
                    }))
                } else {
                    console.log(`${new Date().toISOString()};INFO;connect;success;${username};`)
                    connectedUsernames.push(username)

                    const connectedPlayer = NovaEngine.world.createEntity()
                    const id = Date.now().toString()
                    NovaEngine.world.addComponent(connectedPlayer, new PlayerConnection(id, username, connection))
                    connection.send(JSON.stringify({
                        type: 'connect_ok',
                        id: id,
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
        const entities = NovaEngine.world.queryEntities('PlayerConnection')
        for (const entity of entities) {
            const playerConnection = NovaEngine.world.getComponent<PlayerConnection>(entity, 'PlayerConnection')!

            if (playerConnection.socket === connection) {
                console.log(`${new Date().toISOString()};INFO;disconnect;success;${playerConnection.username};`)
                const index = connectedUsernames.indexOf(playerConnection.username)
                if (index > -1) {
                    connectedUsernames.splice(index, 1)
                }

                NovaEngine.world.destroyEntity(entity.id)
                break
            }
        }
    })
})

