import { Time } from '../'

// Mock the getCurrentTime method using perf_hooks
const getCurrentTimeMock = jest.spyOn(performance, 'now')

describe('Time', () => {
    // Reset the mock before each test
    beforeEach(() => {
        getCurrentTimeMock.mockReset()
        Time.previousFrameTime = 0
    })

    // Test the getCurrentTime method
    it('should return the current time', () => {
        getCurrentTimeMock
            .mockReturnValueOnce(0)
            .mockReturnValueOnce(1000)
            .mockReturnValueOnce(1500)

        expect(Time.getCurrentTime()).toBe(0)

        expect(Time.getCurrentTime()).toBe(1000)

        expect(Time.getCurrentTime()).toBe(1500)
    })

    // Test the calculateDeltaTime method
    it('should calculate the correct deltaTime', () => {
        getCurrentTimeMock
            .mockReturnValueOnce(0)
            .mockReturnValueOnce(1000)
            .mockReturnValueOnce(1500)

        Time.calculateDeltaTime()
        expect(Time.deltaTime).toBe(0)

        Time.calculateDeltaTime()
        expect(Time.deltaTime).toBe(1000)

        Time.calculateDeltaTime()
        expect(Time.deltaTime).toBe(500)
    })
})