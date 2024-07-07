import { NovaEvent } from '../../events'
import { ConnectionHandle } from '../network-manager';

export class AuthenticationRequestEvent implements NovaEvent {
    constructor(public connectionHandle: ConnectionHandle, public username: string) { }
}

export class AuthenticationSuccessEvent implements NovaEvent {
    constructor(public username: string) { }
}