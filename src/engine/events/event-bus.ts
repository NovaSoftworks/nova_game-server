export interface NovaEvent { }

type NovaEventCallback = (event: NovaEvent) => void
type NovaEventConstructor = new (...args: any[]) => NovaEvent

export class NovaEventBus {
    private listeners: Map<NovaEventConstructor, Set<NovaEventCallback>> = new Map()

    subscribe(eventConstructor: NovaEventConstructor, callback: NovaEventCallback) {
        if (!this.listeners.has(eventConstructor))
            this.listeners.set(eventConstructor, new Set())

        this.listeners.get(eventConstructor)!.add(callback)
    }

    unsubscribe(eventConstructor: NovaEventConstructor, callback: NovaEventCallback) {
        const listeners = this.listeners.get(eventConstructor)
        if (listeners) {
            listeners.delete(callback)
            if (listeners.size === 0) {
                this.listeners.delete(eventConstructor);
            }
        }
    }

    publish(event: NovaEvent) {
        const eventconstructor = event.constructor as NovaEventConstructor
        const listeners = this.listeners.get(eventconstructor)
        if (listeners) {
            listeners.forEach((listener) => listener(event))
        }
    }
}
