export class Time {
    static previousFrameTime: number = Time.getCurrentTime()


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
     * Calculates the current deltaTime.
     */
    static calculateDeltaTime() {
        const currentFrameTime = Time.getCurrentTime()
        Time.deltaTime = currentFrameTime - Time.previousFrameTime
        Time.previousFrameTime = currentFrameTime
    }
}

export default Time