import { NovaEngine } from '../nova-engine'

describe('NovaEngine', () => {
    // Test the toString method
    it('should return the correct string representation of the object', () => {
        const novaEngine = new NovaEngine()
        expect(novaEngine.toString()).toBe('NovaEngine')
    })
})