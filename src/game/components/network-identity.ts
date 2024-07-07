import { Component } from "../../engine/ecs"

export class NetworkIdentity extends Component {
    networkId: string

    constructor(networkId: string) {
        super()
        this.networkId = networkId
    }
}