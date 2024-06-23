import { greet as cliGreet } from "./cli"
import { NovaEngine } from "./engine/nova-engine"
import { createMap } from "./map"
import { LogLevel, LogUtils } from "./engine/utils"

// CONFIGURATION
LogUtils.level = LogLevel.DEBUG
const serverPort = 8080

// MAIN
cliGreet()
NovaEngine.start()
createMap()

NovaEngine.world.networkManager.startServer(serverPort)