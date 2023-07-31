import { Collider, PlayerConnection, Transform } from "./components"
import { Rectangle, Vector2 } from "./engine/math"
import { NovaEngine } from "./engine/nova-engine"
import { WebSocket } from 'ws'

console.log(`Welcome to`)
console.log(` _   _  ______      __     
| \\ | |/ __ \\ \\    / /      
|  \\| | |  | \\ \\  / /  \\   
| . \` | |  | |\\ \\/ / _\\ \\  
| |\\  | |__| | \\  / ____ \\     
|_| \\_|\\____/   \\/ /    \\_\\  - Dedicated Game Server               
`)

console.log('Using Node.js version 20 (Bullseye)')

NovaEngine.start()

const wss = new WebSocket.Server({ port: 80 })

const connectedUsernames: string[] = []
const usernameTaken = (username: string) => { return connectedUsernames.includes(username) }

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message.toString())
            const username = data.username

            if (data.type == 'connect') {
                if (usernameTaken(username)) {
                    ws.send(JSON.stringify({
                        type: 'error',
                        message: `${username} is already connected.`
                    }))
                } else {
                    console.log(`PLAYER CONNECTED: ${username}`)
                    connectedUsernames.push(username)

                    const connectedPlayer = NovaEngine.world.createEntity()
                    NovaEngine.world.addComponent(connectedPlayer, new PlayerConnection(ws, username))
                    ws.send(JSON.stringify({
                        type: 'spawn_player',
                        username: username
                    }))
                }
            }
        } catch (e: any) {
            console.log(`SERVER ERROR: ${e.message}`)
            ws.send(JSON.stringify({
                type: 'error',
                message: `Could not interpret request.`,
                request: message
            }))
        }
    })

    ws.on('close', () => { // This is currently close to System logic, however based on the WebSocket events. Should this be refactored or moved?
        // Player has disconnected, destroy their entity
        const entities = NovaEngine.world.queryEntities('PlayerConnection')
        for (const entity of entities) {
            const playerConnection = NovaEngine.world.getComponent<PlayerConnection>(entity, 'PlayerConnection')!

            if (playerConnection.ws === ws) {
                console.log(`PLAYER DISCONNECTED: ${playerConnection.username}`)
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

const gameWidth = 960
const gameHeight = 540

spawnWalls(gameWidth, gameHeight)

function spawnWalls(gameWidth = 0, gameHeight = 0) {
    let wallThickness = 8 // Modify as needed


    // Create top wall
    let topWall = NovaEngine.world.createEntity()
    NovaEngine.world.addComponent(topWall, new Transform(new Vector2(0, 0)))
    NovaEngine.world.addComponent(topWall, new Collider(new Rectangle(gameWidth, wallThickness)))

    // Create bottom wall
    let bottomWall = NovaEngine.world.createEntity()
    NovaEngine.world.addComponent(bottomWall, new Transform(new Vector2(0, gameHeight - wallThickness)))
    NovaEngine.world.addComponent(bottomWall, new Collider(new Rectangle(gameWidth, wallThickness)))

    // Create left wall
    let leftWall = NovaEngine.world.createEntity()
    NovaEngine.world.addComponent(leftWall, new Transform(new Vector2(0, wallThickness)))
    NovaEngine.world.addComponent(leftWall, new Collider(new Rectangle(wallThickness, gameHeight - 2 * wallThickness)))

    // Create right wall
    let rightWall = NovaEngine.world.createEntity()
    NovaEngine.world.addComponent(rightWall, new Transform(new Vector2(gameWidth - wallThickness, wallThickness)))
    NovaEngine.world.addComponent(rightWall, new Collider(new Rectangle(wallThickness, gameHeight - 2 * wallThickness)))
}
