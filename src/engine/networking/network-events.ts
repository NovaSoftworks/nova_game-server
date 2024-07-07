import { NetworkMessage } from '.'
import { NovaEvent } from '../events';

export class NetworkMessageEvent implements NovaEvent, NetworkMessage {
    constructor(public type: string, public payload?: any, public error?: string) { }
}
