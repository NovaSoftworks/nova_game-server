import { LogUtils, TimeUtils } from "./utils"
import { World } from "./ecs"

export class NovaEngine {
    static world = new World()

    static start() {
        LogUtils.info('Engine', 'Starting game loop')
        setImmediate(NovaEngine.update) // Note: setImmediate triggers thousands of calls to update() per second. 
        // This is okay for prototyping, but will have to be refactored with something more accurate than setInterval.
    }

    private static accumulatedTime = 0
    static fixedTimeStep: number = 10 // ms
    static stepNumber: number = 0

    private static update() {
        TimeUtils.calculateDeltaTime()
        let dt = TimeUtils.deltaTime

        NovaEngine.accumulatedTime += dt

        while (NovaEngine.accumulatedTime >= NovaEngine.fixedTimeStep) { // comparing ms with ms
            NovaEngine.world.updateFixedSystems(NovaEngine.fixedTimeStep / 1000)
            NovaEngine.accumulatedTime -= NovaEngine.fixedTimeStep
            NovaEngine.stepNumber++
        }
        NovaEngine.world.updateSystems(dt / 1000)

        setImmediate(NovaEngine.update)
    }
}
