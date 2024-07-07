import { NetworkMessage } from './'

/**
 * Interface for defining middleware functions to process incoming and/or outgoing network messages.
 */
export interface NetworkMiddleware {
    /**
     * Function to process incoming network messages before they are handled by network handlers.
     * @param message The incoming network message.
     * @returns The processed network message.
     */
    processIncomingMessage?: (message: NetworkMessage) => NetworkMessage

    /**
     * Function to process outgoing network messages before they are sent out via the network.
     * @param message The outgoing network message.
     * @returns The processed network message.
     */
    processOutgoingMessage?: (message: NetworkMessage) => NetworkMessage
}