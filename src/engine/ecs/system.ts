import { Component, Entity, World } from "./"

export abstract class System {
    world: World

    constructor(world: World) {
        this.world = world
    }

    create() {

    }

    destroy() {

    }

    update(step: number) {

    }

    updateFixed(fixedStep: number) {

    }
}