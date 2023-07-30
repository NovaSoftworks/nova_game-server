import { Rectangle } from '../'

describe('Rectangle', () => {
    // Test the constructor
    it('should create a Rectangle object with the given width and height values', () => {
        const rectangle = new Rectangle(5, 10)
        expect(rectangle.width).toBe(5)
        expect(rectangle.height).toBe(10)
    })
})