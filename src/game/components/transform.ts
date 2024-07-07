import { Vector2 } from "../../engine/math"
import { Component } from "../../engine/ecs"

export class Transform extends Component {
    position: Vector2

    constructor(position: Vector2 = Vector2.zero()) {
        super()
        this.position = position
    }
}
