import { ConnectionHandle, NetworkMessage } from './'

/**
 * Interface for defining handlers to process specific types of network messages.
 */
export interface NetworkHandler {
    /**
     * Function that handles incoming network messages of a specific type.
     * @param connectionHandle The identifier of the connection the message comes from.
     * @param message The incoming network message.
     * @returns Boolean indicating whether the message was successfully handled.
     */
    handleMessage: (connectionHandle: ConnectionHandle, message: NetworkMessage) => boolean
}