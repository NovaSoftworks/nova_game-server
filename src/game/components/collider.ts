import { Component } from '../../engine/ecs'
import { Rectangle } from '../../engine/math'

export class Collider extends Component {
    public shape: Rectangle
    public layer?: string
    public colliding: boolean = false

    constructor(rectangle: Rectangle, layer?: string) {
        super()
        this.shape = rectangle
        this.layer = layer
    }
}