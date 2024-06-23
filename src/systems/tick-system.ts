import { Tick } from "../components/tick"
import { System } from "../engine/ecs"

export class TickSystem extends System {

    create() {
        if (!this.world.getSingleton(Tick)) {
            const tick = new Tick()
            this.world.addSingleton(tick)
        }
    }

    updateFixed(fixedDeltaTime: number) {
        const tick = this.world.getSingleton(Tick)
        tick?.incrementTick()
    }
}