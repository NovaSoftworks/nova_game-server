import { Component } from "../engine/ecs"
import { WebSocket } from 'ws'

export class PlayerConnection extends Component {
    public name: string = "PlayerConnection"

    username: string = 'General K.'
    ws: WebSocket

    constructor(ws: WebSocket, username: string) {
        super()
        this.ws = ws
        this.username = username
    }
}
