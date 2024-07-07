import { ConnectionHandle, NetworkHandler, NetworkMessage } from "../"
import { NovaEventBus } from "../../events"
import { LogUtils } from "../../utils"
import { AuthenticationRequestEvent } from "./authentication-events"

export class AuthenticationHandler implements NetworkHandler {
    constructor(private eventBus: NovaEventBus) { }

    handleMessage(connectionHandle: ConnectionHandle, message: NetworkMessage) {
        switch (message.type) {
            case 'authentication_request': {
                const username = message.payload['username']
                LogUtils.info('AuthenticationHandler', `Authentication request: '${username}'`)
                this.eventBus.publish(new AuthenticationRequestEvent(connectionHandle, username))
                return true
            }
            default:
                return false
        }
    }
}
