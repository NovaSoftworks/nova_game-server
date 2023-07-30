export class Vector2 {
    x: number
    y: number

    constructor(x: number, y: number) {
        this.x = x
        this.y = y
    }

    static zero(): Vector2 {
        return new Vector2(0, 0)
    }

    add(vector: Vector2): Vector2 {
        return new Vector2(this.x + vector.x, this.y + vector.y)
    }

    subtract(vector: Vector2): Vector2 {
        return new Vector2(this.x - vector.x, this.y - vector.y)
    }


    multiply(n: number): Vector2 {
        return new Vector2(this.x * n, this.y * n)
    }

    magnitude(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y)
    }

    normalize(): Vector2 {
        const magnitude = this.magnitude()

        if (magnitude === 0) {
            return Vector2.zero()
        }

        return new Vector2(this.x / magnitude, this.y / magnitude)
    }
}
