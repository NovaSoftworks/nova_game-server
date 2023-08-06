import { TimeUtils } from '../'

// Mock the getCurrentTime method using perf_hooks
const getCurrentTimeMock = jest.spyOn(performance, 'now')

describe('Time', () => {
    // Reset the mock before each test
    beforeEach(() => {
        getCurrentTimeMock.mockReset()
        TimeUtils.previousFrameTime = 0
    })

    // Test the getCurrentTime method
    it('should return the current time', () => {
        getCurrentTimeMock
            .mockReturnValueOnce(0)
            .mockReturnValueOnce(1000)
            .mockReturnValueOnce(1500)

        expect(TimeUtils.getCurrentTime()).toBe(0)

        expect(TimeUtils.getCurrentTime()).toBe(1000)

        expect(TimeUtils.getCurrentTime()).toBe(1500)
    })

    // Test the calculateDeltaTime method
    it('should calculate the correct deltaTime', () => {
        getCurrentTimeMock
            .mockReturnValueOnce(0)
            .mockReturnValueOnce(1000)
            .mockReturnValueOnce(1500)

        TimeUtils.calculateDeltaTime()
        expect(TimeUtils.deltaTime).toBe(0)

        TimeUtils.calculateDeltaTime()
        expect(TimeUtils.deltaTime).toBe(1000)

        TimeUtils.calculateDeltaTime()
        expect(TimeUtils.deltaTime).toBe(500)
    })
})