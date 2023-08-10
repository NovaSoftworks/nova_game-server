/** Enum representing the logging levels.
 * Higher numeric values indicate lower priority messages.
 */
export enum LogLevel {
    DEBUG = 1,
    INFO = 2,
    WARNING = 3,
    ERROR = 4,
    OFF = 5
}

/** Utility class for logging messages at different levels.
 */
export class LogUtils {
    /** Current logging level. Messages below this level won't be logged. */
    static level: LogLevel = LogLevel.DEBUG

    /** Logs an error message.
     * 
     * @param {string} component - The component or module where the error occurred.
     * @param {string} message - The error message.
     */
    static error(component: string, message: string) {
        LogUtils.log(component, LogLevel.ERROR, message)
    }

    /** Logs a warning message.
     * 
     * @param {string} component - The component or module where the warning was triggered.
     * @param {string} message - The warning message.
     */
    static warn(component: string, message: string) {
        LogUtils.log(component, LogLevel.WARNING, message)
    }

    /** Logs an informational message.
     * 
     * @param {string} component - The component or module producing the info.
     * @param {string} message - The informational message.
     */
    static info(component: string, message: string) {
        LogUtils.log(component, LogLevel.INFO, message)
    }

    /** Logs a debug message.
     * 
     * @param {string} component - The component or module producing the debug info.
     * @param {string} message - The debug message.
     */
    static debug(component: string, message: string) {
        LogUtils.log(component, LogLevel.DEBUG, message)
    }

    private static log(component: string, level: LogLevel, message: string) {
        if (level < LogUtils.level || level == LogLevel.OFF) return

        const timestamp = new Date().toISOString()

        switch (level) {
            case LogLevel.ERROR:
                console.error(`${timestamp};ERROR;${component};${message}`)
                break

            case LogLevel.WARNING:
                console.warn(`${timestamp};WARNING;${component};${message}`)
                break

            case LogLevel.INFO:
                console.info(`${timestamp};INFO;${component};${message}`)
                break

            case LogLevel.DEBUG:
                console.debug(`${timestamp};DEBUG;${component};${message}`)
                break

            default:
                break
        }
    }
}

