import { Component } from '../engine/ecs'
import { Rectangle } from '../engine/math'

export class Collider extends Component {
    public name: string = "Collider"

    public shape: Rectangle
    public colliding: boolean = false

    constructor(rectangle: Rectangle) {
        super()
        this.shape = rectangle
    }
}