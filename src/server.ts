import { greet as cliGreet } from "./cli"
import { NovaEngine } from "./engine/nova-engine"
import { createMap } from "./map"
import { LogLevel, LogUtils } from "./engine/utils"
import { ConnectionCleanupSystem, ConnectionSystem, TickSystem } from "./game/systems"
import { NovaEventBus } from "./engine/events"
import { NetworkManager, AuthenticationManager } from "./engine/networking"

// CONFIGURATION
LogUtils.level = LogLevel.DEBUG

// MAIN
cliGreet()
const eventBus = new NovaEventBus()
const networkManager = new NetworkManager(eventBus)
const authenticationManager = new AuthenticationManager(networkManager)

networkManager.startServer(8080)

// NovaEngine.start()
// createMap()
// NovaEngine.world.createSystem(TickSystem)
// NovaEngine.world.createSystem(ConnectionSystem)
// NovaEngine.world.createSystem(ConnectionCleanupSystem)