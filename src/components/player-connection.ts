import { Component } from "../engine/ecs"

export class PlayerConnection extends Component {
    public name: string = "PlayerConnection"

    username: string = 'General K.'

    constructor(username: string) {
        super()
        this.username = username
    }
}
