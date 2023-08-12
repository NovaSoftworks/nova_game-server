import { NetworkManager } from "../networking"
import { LogUtils } from "../utils"
import { Component, Entity, System } from "./"

export class World {
    private entities: Map<number, Entity> = new Map<number, Entity>()
    private components: Map<Function, Component[]> = new Map<Function, Component[]>()
    private singletons: Map<Function, Component> = new Map<Function, Component>()
    private systems: System[] = []

    private nextEntityId: number = 0

    networkManager: NetworkManager = new NetworkManager()

    // ENTITIES
    createEntity(): Entity {
        const entity = new Entity(this.nextEntityId++)
        this.entities.set(entity.id, entity)
        return entity
    }

    destroyEntity(entityId: number) {
        this.entities.delete(entityId)
        this.destroyComponents(entityId)
    }

    getEntity(entityId: number): Entity | undefined {
        return this.entities.get(entityId)
    }

    getAllEntities(): Entity[] {
        return [...this.entities.values()]
    }


    // COMPONENTS
    addComponent(entity: Entity, component: Component) {
        const componentConstructor = component.constructor

        if (!this.components.has(componentConstructor)) {
            this.components.set(componentConstructor, [])
        }

        const componentArray = this.components.get(componentConstructor)!
        componentArray[entity.id] = component
    }

    destroyComponent(entity: Entity, componentConstructor: new (...args: any[]) => Component) {
        const componentArray = this.components.get(componentConstructor)
        if (componentArray) {
            delete componentArray[entity.id]
        }
    }

    destroyComponents(entityId: number) {
        for (const componentArray of this.components.values()) {
            delete componentArray[entityId]
        }
    }

    getComponent<T extends Component>(entity: Entity, componentConstructor: new (...args: any[]) => T): T | undefined {
        const componentArray = this.components.get(componentConstructor)
        return componentArray ? componentArray[entity.id] as T : undefined
    }

    // SINGLETONS
    addSingleton(component: Component) {
        const componentConstructor = component.constructor

        if (!this.singletons.has(componentConstructor)) {
            this.singletons.set(componentConstructor, component)
        } else {
            LogUtils.error('World', `Attempting to add a second ${componentConstructor.name} to the same world instance`)
        }
    }

    getSingleton<T extends Component>(componentConstructor: new (...args: any[]) => T): T | undefined {
        return this.singletons.get(componentConstructor) as T
    }

    destroySingleton(componentConstructor: new (...args: any[]) => Component) {
        this.singletons.delete(componentConstructor)
    }


    // SYSTEMS
    createSystem<T extends System>(systemType: new (world: World) => T): T {
        const system = new systemType(this)
        this.addSystem(system)
        system.create()
        return system
    }

    addSystem(system: System) {
        if (!this.hasSystem(system))
            this.systems.push(system)
    }

    destroySystem<T extends System>(systemType: new (world: World) => T): void {
        const systemIndex = this.systems.findIndex(system => system instanceof systemType)

        if (systemIndex !== -1) {
            this.systems[systemIndex].destroy()
            this.systems.splice(systemIndex, 1)
        }
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
    queryEntities(...componentConstructors: (new (...args: any[]) => Component)[]): Entity[] {
        const entities = this.getAllEntities();

        return entities.filter(entity => {
            for (const componentConstructor of componentConstructors) {
                if (!this.getComponent(entity, componentConstructor)) {
                    return false
                }
            }
            return true
        })
    }
}