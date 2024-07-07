export interface NovaEvent { }

type NovaEventCallback<E extends NovaEvent> = (event: E) => void
type NovaEventConstructor<E extends NovaEvent> = new (...args: any[]) => E

export class NovaEventBus {
    private listeners: Map<NovaEventConstructor<NovaEvent>, Set<NovaEventCallback<NovaEvent>>> = new Map()

    subscribe<E extends NovaEvent>(eventConstructor: NovaEventConstructor<E>, callback: NovaEventCallback<E>) {
        if (!this.listeners.has(eventConstructor))
            this.listeners.set(eventConstructor, new Set())

        this.listeners.get(eventConstructor as NovaEventConstructor<NovaEvent>)!.add(callback as NovaEventCallback<NovaEvent>)
    }

    unsubscribe<E extends NovaEvent>(eventConstructor: NovaEventConstructor<E>, callback: NovaEventCallback<E>) {
        const listeners = this.listeners.get(eventConstructor as NovaEventConstructor<NovaEvent>)
        if (listeners) {
            listeners.delete(callback as NovaEventCallback<NovaEvent>)
            if (listeners.size === 0) {
                this.listeners.delete(eventConstructor as NovaEventConstructor<NovaEvent>)
            }
        }
    }

    publish(event: NovaEvent) {
        const eventconstructor = event.constructor as NovaEventConstructor<NovaEvent>
        const listeners = this.listeners.get(eventconstructor)
        if (listeners) {
            listeners.forEach((listener) => (listener as NovaEventCallback<NovaEvent>)(event))
        }
    }
}
