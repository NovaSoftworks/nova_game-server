import { Connection, ConnectionStatus } from "../components"
import { System } from "../../engine/ecs"

export class ConnectionCleanupSystem extends System {

    updateFixed(fixedDeltaTime: number) {
        const connectedEntities = this.world.queryEntities(Connection)

        for (const e of connectedEntities) {
            const connection = this.world.getComponent(e, Connection)!
            if (connection.status === ConnectionStatus.Disconnected) {
                this.world.destroyEntity(e.id)
            }
        }
    }
}