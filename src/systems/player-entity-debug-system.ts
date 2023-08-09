import { PlayerConnection } from "../components";
import { System } from "../engine/ecs";

export class PlayerEntityDebugSystem extends System {
    addedTime = 0

    updateFixed(step: number): void {
        this.addedTime += step

        if (this.addedTime >= 5) {
            this.addedTime -= 5

            const entities = this.world.queryEntities(PlayerConnection)

            for (const entity of entities) {
                const connectionComponent = this.world.getComponent(entity, PlayerConnection)!

                console.log(`${new Date().toISOString()};INFO;;;;Player status: id=${entity.id}, username=${connectionComponent.username}`)
            }

            if (entities.length === 0) {
                console.log(`${new Date().toISOString()};INFO;;;;No network entities in the world.`)
            }
        }
    }
}