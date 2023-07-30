import { Vector2 } from '../'

describe('Vector2', () => {
    // Test the constructor
    it('should create a Vector2 object with the given x and y values', () => {
        const vector = new Vector2(2, 3)
        expect(vector.x).toBe(2)
        expect(vector.y).toBe(3)
    })

    // Test the static zero method
    it('should create a Vector2 object with x and y values as 0', () => {
        const zeroVector = Vector2.zero()
        expect(zeroVector.x).toBe(0)
        expect(zeroVector.y).toBe(0)
    })

    // Test the add method
    it('should return a new Vector2 object with the sum of x and y values', () => {
        const vector1 = new Vector2(2, 3)
        const vector2 = new Vector2(1, 1)
        const addedVector = vector1.add(vector2)
        expect(addedVector.x).toBe(3) // 2 + 1
        expect(addedVector.y).toBe(4) // 3 + 1
    })

    // Test the subtract method
    it('should return a new Vector2 object with the difference of x and y values', () => {
        const vector1 = new Vector2(2, 3)
        const vector2 = new Vector2(1, 1)
        const subtractedVector = vector1.subtract(vector2)
        expect(subtractedVector.x).toBe(1) // 2 - 1
        expect(subtractedVector.y).toBe(2) // 3 - 1
    })

    // Test the multiply method
    it('should return a new Vector2 object with multiplied x and y values', () => {
        const vector = new Vector2(2, 3)
        const multipliedVector = vector.multiply(2)
        expect(multipliedVector.x).toBe(4)
        expect(multipliedVector.y).toBe(6)
    })

    // Test the magnitude method
    it('should return the correct magnitude of the vector', () => {
        const vector = new Vector2(3, 4)
        const magnitude = vector.magnitude()
        expect(magnitude).toBe(5) // Magnitude of (3, 4) is 5 (Pythagorean theorem)
    })

    // Test the normalize method
    it('should return a new Vector2 object with the same direction and magnitude of 1', () => {
        const vector = new Vector2(3, 4)
        const normalizedVector = vector.normalize()
        expect(normalizedVector.magnitude()).toBeCloseTo(1, 5) // Close to 1 with a precision of 5 decimal places
    })

    // Test normalize method when vector has a magnitude of 0
    it('should return a zero vector if the vector has a magnitude of 0', () => {
        const zeroVector = new Vector2(0, 0)
        const normalizedVector = zeroVector.normalize()
        expect(normalizedVector.x).toBe(0)
        expect(normalizedVector.y).toBe(0)
    })
})