export class TimeUtils {
    static previousFrameTime: number = TimeUtils.getCurrentTime()


    /**
     * The interval in milliseconds between the last frame and the current frame.
     */
    static deltaTime: number = 0 // ms

    /**
     * Gets the current time using `performance.now()`.
     * @returns {number} The current time in milliseconds.
     */
    static getCurrentTime() {
        return performance.now()
    }

    /**
     * Calculates the current deltaTimeUtils.
     */
    static calculateDeltaTime() {
        const currentFrameTime = TimeUtils.getCurrentTime()
        TimeUtils.deltaTime = currentFrameTime - TimeUtils.previousFrameTime
        TimeUtils.previousFrameTime = currentFrameTime
    }
}
