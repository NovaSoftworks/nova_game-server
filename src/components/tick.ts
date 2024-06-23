import { Component } from "../engine/ecs"

export class Tick extends Component {
    currentTick: number

    constructor(currentTick: number = 0) {
        super()
        this.currentTick = currentTick
    }

    incrementTick() {
        this.currentTick++
    }
}