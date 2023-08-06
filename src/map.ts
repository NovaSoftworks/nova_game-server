import { NovaEngine } from "./engine/nova-engine"
import { Rectangle, Vector2 } from "./engine/math"
import { Collider, Transform } from "./components"



export function createMap() {
    let wallThickness = 8 // Modify as needed
    const gameWidth = 960
    const gameHeight = 540
    console.log(`${new Date().toISOString()};INFO;;;;Map instantiated (${gameWidth}x${gameHeight}).`)

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