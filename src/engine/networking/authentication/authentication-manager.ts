import { AuthenticationHandler, AuthenticationRequestEvent, AuthenticationSuccessEvent } from '.'
import { ConnectionHandle, NetworkManager } from '..'
import { NovaEvent, NovaEventBus } from '../../events'
import { LogUtils } from '../../utils'

export class AuthenticationManager {
    eventBus: NovaEventBus
    users: Map<ConnectionHandle, string> = new Map<ConnectionHandle, string>()

    constructor(private networkManager: NetworkManager) {
        this.eventBus = networkManager.eventBus
        this.eventBus.subscribe(AuthenticationRequestEvent, this.onAuthenticationRequest.bind(this))

        this.networkManager.addHandler(new AuthenticationHandler(this.eventBus))
    }

    addUser(connectionHandle: ConnectionHandle, username: string) {
        this.users.set(connectionHandle, username)
    }

    removeUser(connectionHandle: ConnectionHandle) {
        this.users.delete(connectionHandle)
    }

    userExists(username: string): boolean {
        for (const [h, u] of this.users) {
            if (u == username)
                return true
        }

        return false
    }

    onAuthenticationRequest(event: AuthenticationRequestEvent) {
        const connectionHandle = event.connectionHandle
        const username = event.username

        if (username.length == 0) {
            LogUtils.info('AuthenticationService', `Authentication failure: '${username}'`)
            this.networkManager.sendMessage(connectionHandle, {
                type: 'authentication_failure',
                payload: {
                    message: `Username can not be empty.`
                }
            })
            return
        }

        if (username.length < 3 || username.length > 16) {
            LogUtils.info('AuthenticationService', `Authentication failure: '${username}'`)
            this.networkManager.sendMessage(connectionHandle, {
                type: 'authentication_failure',
                payload: {
                    message: `Username must be between 3 and 16 characters.`
                }
            })
            return
        }

        if (this.userExists(username)) {
            LogUtils.info('AuthenticationService', `Authentication failure: '${username}'`)
            this.networkManager.sendMessage(connectionHandle, {
                type: 'authentication_failure',
                payload: {
                    message: `Username '${username}' is already used.`
                }
            })
            return
        }

        LogUtils.info('AuthenticationService', `Authentication success: '${username}'`)
        this.addUser(connectionHandle, username)
        this.networkManager.sendMessage(connectionHandle, {
            type: 'authentication_success',
            payload: {
                username: username
            }
        })
    }
}
