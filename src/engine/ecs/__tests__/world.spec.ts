import { Component, Entity, System, World } from '../'

describe('World Entity Management', () => {
    let world: World

    beforeEach(() => {
        world = new World()
    })

    it('should create an entity with a unique ID', () => {
        const entity1 = world.createEntity()
        const entity2 = world.createEntity()

        expect(entity1.id).toBeDefined()
        expect(entity2.id).toBeDefined()
        expect(entity1.id).not.toBe(entity2.id)
    })

    it('should destroy an entity by its ID and remove its components', () => {
        const entity = world.createEntity()
        world.destroyEntity(entity.id)

        const retrievedEntity = world.getEntity(entity.id)
        expect(retrievedEntity).toBeUndefined()
    })

    it('should call destroyComponents when destroying an entity', () => {
        const spy = jest.spyOn(world, 'destroyComponents')
        const entity = world.createEntity()

        world.destroyEntity(entity.id)

        expect(spy).toHaveBeenCalledWith(entity.id)
        spy.mockRestore()
    })

    it('should retrieve an entity by its ID', () => {
        const entity = world.createEntity()
        const retrievedEntity = world.getEntity(entity.id)

        expect(retrievedEntity).toBeDefined()
        expect(retrievedEntity).toBe(entity)
    })

    it('should retrieve all created entities', () => {
        const entity1 = world.createEntity()
        const entity2 = world.createEntity()

        const allEntities = world.getAllEntities()
        expect(allEntities.length).toBe(2)
        expect(allEntities).toContain(entity1)
        expect(allEntities).toContain(entity2)
    })
})

describe('World Component Management', () => {
    let world: World
    let entity: Entity
    class MockComponent extends Component { }

    beforeEach(() => {
        world = new World()
        entity = world.createEntity()
    })

    it('should add a component to an entity and retrieve it', () => {
        const component = new MockComponent()
        world.addComponent(entity, component)

        const retrievedComponent = world.getComponent(entity, MockComponent)
        expect(retrievedComponent).toBeDefined()
        expect(retrievedComponent).toBe(component)
    })

    it('should destroy a component from an entity', () => {
        const component = new MockComponent()
        world.addComponent(entity, component)

        world.destroyComponent(entity, MockComponent)

        const retrievedComponent = world.getComponent(entity, MockComponent)
        expect(retrievedComponent).toBeUndefined()
    })

    it('should remove all components of an entity', () => {
        const component = new MockComponent()
        world.addComponent(entity, component)

        world.destroyComponents(entity.id)

        const retrievedComponent = world.getComponent(entity, MockComponent)
        expect(retrievedComponent).toBeUndefined()
    })
})

describe('World System Management', () => {
    let world: World
    class MockSystem extends System { }

    beforeEach(() => {
        world = new World()
    })

    it('should create and add a system', () => {
        const system = world.createSystem(MockSystem)

        expect(system).toBeInstanceOf(MockSystem)
        expect(world.hasSystem(system)).toBe(true)
    })

    it('should add and then destroy a system', () => {
        const system = new MockSystem(world)
        world.addSystem(system)

        expect(world.hasSystem(system)).toBe(true)

        world.destroySystem(MockSystem)

        expect(world.hasSystem(system)).toBe(false)
    })

    it('should call update on all systems when updateSystems is called', () => {
        const system = world.createSystem(MockSystem)
        const spy = jest.spyOn(system, 'update')

        const step = 1.0
        world.updateSystems(step)

        expect(spy).toHaveBeenCalledWith(step)

        spy.mockRestore()
    })

    it('should call updateFixed on the system when updateFixedSystems is called', () => {
        const system = world.createSystem(MockSystem)
        const spy = jest.spyOn(system, 'updateFixed')

        const fixedStep = 1.0
        world.updateFixedSystems(fixedStep)

        expect(spy).toHaveBeenCalledWith(fixedStep)

        spy.mockRestore()
    })

    it('should not add a system more than once', () => {
        const system = new MockSystem(world)
        world.addSystem(system)
        world.addSystem(system) // trying to add it again

        expect(world.hasSystem(system)).toBe(true)

        // Use the Reflect API to access the private 'systems' field
        const systems = Reflect.get(world, 'systems') as System[]
        const instancesOfMockSystem = systems.filter(sys => sys instanceof MockSystem)

        expect(instancesOfMockSystem.length).toBe(1)
    })
})

describe('World Querying', () => {
    let world: World

    class PositionComponent extends Component { }
    class VelocityComponent extends Component { }

    beforeEach(() => {
        world = new World()
    })

    it('should return entities with specified components', () => {
        const entity1 = world.createEntity()
        world.addComponent(entity1, new PositionComponent())
        world.addComponent(entity1, new VelocityComponent())

        const entity2 = world.createEntity()
        world.addComponent(entity2, new PositionComponent())

        const entitiesWithPosition = world.queryEntities(PositionComponent)
        expect(entitiesWithPosition).toContain(entity1)
        expect(entitiesWithPosition).toContain(entity2)

        const entitiesWithBoth = world.queryEntities(PositionComponent, VelocityComponent)
        expect(entitiesWithBoth).toContain(entity1)
        expect(entitiesWithBoth).not.toContain(entity2)
    })
})