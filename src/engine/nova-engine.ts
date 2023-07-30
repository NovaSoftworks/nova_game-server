import { Time } from "./core";
import { World } from "./ecs";

export class NovaEngine {
    static world = World.current

    static start() {
        setImmediate(NovaEngine.update)
    }

    private static accumulatedTime = 0
    static fixedTimeStep: number = 16 // ms
    static stepNumber: number = 0

    private static update() {
        Time.calculateDeltaTime()
        let dt = Time.deltaTime

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