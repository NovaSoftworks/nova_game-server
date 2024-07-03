import { greet as cliGreet } from "./cli"
import { NovaEngine } from "./engine/nova-engine"
import { createMap } from "./map"
import { LogLevel, LogUtils } from "./engine/utils"
import { ConnectionCleanupSystem, ConnectionSystem, TickSystem } from "./systems"

// CONFIGURATION
LogUtils.level = LogLevel.DEBUG

// MAIN
cliGreet()
NovaEngine.start()
createMap()
NovaEngine.world.createSystem(TickSystem)
NovaEngine.world.createSystem(ConnectionSystem)
NovaEngine.world.createSystem(ConnectionCleanupSystem)