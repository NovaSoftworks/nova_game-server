import { System, World } from '../'

describe('System', () => {
    // Test the constructor
    let world: World
    class MockSystem extends System { }

    beforeEach(() => {
        world = new World()
    })

    it('should create a System object with the given world', () => {
        const system = new MockSystem(world)
        expect(system.world).toBe(world)
    })

    it('should have lifecycle methods defined', () => {
        const system = new MockSystem(world)
        expect(system.create).toBeDefined()
        expect(system.destroy).toBeDefined()
    })

    it('should have update methods defined', () => {
        const system = new MockSystem(world)
        expect(system.update).toBeDefined()
        expect(system.updateFixed).toBeDefined()
    })
})