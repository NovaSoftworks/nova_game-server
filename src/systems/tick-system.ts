import { Tick } from "../components"
import { System } from "../engine/ecs"

export class TickSystem extends System {

    create() {
        if (!this.world.getSingleton(Tick)) {
            this.world.addSingleton(new Tick())
        }
    }

    updateFixed(fixedDeltaTime: number) {
        const tick = this.world.getSingleton(Tick)
        tick?.incrementTick()
    }
}