import { NovaEngine } from "../nova-engine"
import { Component, Entity } from "./"

export abstract class System {
    update(step: number) {

    }

    updateFixed(fixedStep: number) {

    }

    // Helper function handles
    queryEntities(...componentTypes: string[]): Entity[] {
        return NovaEngine.world.queryEntities(...componentTypes)
    }

    getComponent<T extends Component>(entity: Entity, componentName: string): T | undefined {
        return NovaEngine.world.getComponent(entity, componentName)
    }
}