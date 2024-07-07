import { NovaEvent, NovaEventBus } from '../'

describe('NovaEventBus', () => {
    class TestEvent implements NovaEvent {
        constructor(public data: string) { }
    }

    class AnotherTestEvent implements NovaEvent {
        constructor(public number: number) { }
    }

    let eventBus: NovaEventBus

    beforeEach(() => {
        eventBus = new NovaEventBus()
    })

    describe('subscribe', () => {
        it('should add a listener for a specific event type', () => {
            const listener = jest.fn()
            eventBus.subscribe(TestEvent, listener)
            eventBus.publish(new TestEvent('test'))
            expect(listener).toHaveBeenCalledWith(expect.any(TestEvent))
        })

        it('should allow multiple listeners for the same event type', () => {
            const listener1 = jest.fn()
            const listener2 = jest.fn()
            eventBus.subscribe(TestEvent, listener1)
            eventBus.subscribe(TestEvent, listener2)
            eventBus.publish(new TestEvent('test'))
            expect(listener1).toHaveBeenCalled()
            expect(listener2).toHaveBeenCalled()
        })
    })

    describe('unsubscribe', () => {
        it('should remove a specific listener for an event type', () => {
            const listener1 = jest.fn()
            const listener2 = jest.fn()
            eventBus.subscribe(TestEvent, listener1)
            eventBus.subscribe(TestEvent, listener2)
            eventBus.unsubscribe(TestEvent, listener1)
            eventBus.publish(new TestEvent('test'))
            expect(listener1).not.toHaveBeenCalled()
            expect(listener2).toHaveBeenCalled()
        })

        it('should not affect other event types when unsubscribing', () => {
            const testListener = jest.fn()
            const anotherListener = jest.fn()
            eventBus.subscribe(TestEvent, testListener)
            eventBus.subscribe(AnotherTestEvent, anotherListener)
            eventBus.unsubscribe(TestEvent, testListener)
            eventBus.publish(new AnotherTestEvent(42))
            expect(anotherListener).toHaveBeenCalled()
        })
    })

    describe('publish', () => {
        it('should trigger all listeners for the published event type', () => {
            const listener1 = jest.fn()
            const listener2 = jest.fn()
            eventBus.subscribe(TestEvent, listener1)
            eventBus.subscribe(TestEvent, listener2)
            eventBus.publish(new TestEvent('test'))
            expect(listener1).toHaveBeenCalledWith(expect.any(TestEvent))
            expect(listener2).toHaveBeenCalledWith(expect.any(TestEvent))
        })

        it('should not trigger listeners for other event types', () => {
            const testListener = jest.fn()
            const anotherListener = jest.fn()
            eventBus.subscribe(TestEvent, testListener)
            eventBus.subscribe(AnotherTestEvent, anotherListener)
            eventBus.publish(new TestEvent('test'))
            expect(testListener).toHaveBeenCalled()
            expect(anotherListener).not.toHaveBeenCalled()
        })

        it('should pass the correct event data to listeners', () => {
            const listener = jest.fn()
            eventBus.subscribe(TestEvent, listener)
            const testEvent = new TestEvent('test data')
            eventBus.publish(testEvent)
            expect(listener).toHaveBeenCalledWith(testEvent)
        })
    })

    describe('edge cases', () => {
        it('should handle unsubscribing a non-existent listener', () => {
            const listener = jest.fn()
            expect(() => eventBus.unsubscribe(TestEvent, listener)).not.toThrow()
        })

        it('should handle publishing an event with no listeners', () => {
            expect(() => eventBus.publish(new TestEvent('test'))).not.toThrow()
        })

        it('should ignore multiple subscriptions of the same listener', () => {
            const listener = jest.fn()
            eventBus.subscribe(TestEvent, listener)
            eventBus.subscribe(TestEvent, listener)
            eventBus.publish(new TestEvent('test'))
            expect(listener).toHaveBeenCalledTimes(1)
        })
    })
})