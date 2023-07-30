import { Component, Entity, System } from "./"

export class World {
    private entities: Map<number, Entity> = new Map<number, Entity>()
    private components: Map<string, Component[]> = new Map<string, Component[]>()
    private systems: System[] = []

    private nextEntityId: number = 0

    static current = new World()

    // ENTITIES
    createEntity(): Entity {
        const entity = new Entity(this.nextEntityId++)
        this.entities.set(entity.id, entity)
        return entity
    }

    getEntity(entityId: number): Entity | undefined {
        return this.entities.get(entityId)
    }

    destroyEntity(entityId: number) {
        this.entities.delete(entityId)
    }

    getAllEntities(): Entity[] {
        return [...this.entities.values()]
    }


    // COMPONENTS
    addComponent(entity: Entity, component: Component) {
        const componentName = component.name

        if (!this.components.has(componentName)) {
            this.components.set(componentName, [])
        }

        const componentArray = this.components.get(componentName)
        if (componentArray)
            componentArray[entity.id] = component
    }

    removeComponent(entity: Entity, componentName: string) {
        const componentArray = this.components.get(componentName)
        if (componentArray)
            delete componentArray[entity.id]
    }

    getComponent<T extends Component>(entity: Entity, componentName: string): T | undefined {
        const componentArray = this.components.get(componentName)
        if (componentArray) {
            return componentArray[entity.id] as T
        }

        return undefined
    }


    // SYSTEMS
    addSystem(system: System) {
        if (!this.hasSystem(system))
            this.systems.push(system)
    }

    hasSystem(system: System): boolean {
        return this.systems.some((registeredSystem) => registeredSystem.constructor === system.constructor)
    }

    updateSystems(step: number) {
        for (const system of this.systems) {
            system.update(step)
        }
    }

    updateFixedSystems(fixedStep: number) {
        for (const system of this.systems) {
            system.updateFixed(fixedStep)
        }
    }


    // QUERYING
    queryEntities(...componentTypes: string[]): Entity[] {
        const entities = World.current.getAllEntities()

        return entities.filter(entity => {
            for (const componentType of componentTypes) {
                if (!World.current.getComponent(entity, componentType)) {
                    return false
                }
            }
            return true
        })
    }
}