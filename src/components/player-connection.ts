import { Component } from "../engine/ecs"
import { WebSocket } from 'ws'

export class PlayerConnection extends Component {
    public name: string = "PlayerConnection"

    username: string
    id: string
    socket: WebSocket

    constructor(id: string, username: string, socket: WebSocket) {
        super()
        this.id = id
        this.username = username
        this.socket = socket
    }
}
