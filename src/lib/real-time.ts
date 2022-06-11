import * as API from "../api/factory.js";

class RealTimeEventSubscription<T extends API.RealTimeStatus> implements API.Subscription {
    constructor(
        private readonly status: T,
        private readonly observers: Map<API.MidiStatus, Set<API.EventHandler<API.RealTimeStatus>>>,
        private readonly handler: API.EventHandler<T>,
    ) {}

    unsubscribe(): void {
        this.observers.get(this.status).delete(this.handler);
    }
}

const observers = new Map([
    [API.MidiStatus.START, new Set<API.EventHandler<API.RealTimeStatus>>()],
    [API.MidiStatus.STOP, new Set<API.EventHandler<API.RealTimeStatus>>()],
    [API.MidiStatus.CONTINUE, new Set<API.EventHandler<API.RealTimeStatus>>()],
    [API.MidiStatus.TIMING_CLOCK, new Set<API.EventHandler<API.RealTimeStatus>>()],
    [API.MidiStatus.ACTIVE_SENDING, new Set<API.EventHandler<API.RealTimeStatus>>()],
    [API.MidiStatus.SYSTEM_RESET, new Set<API.EventHandler<API.RealTimeStatus>>()],
]);

export function addObserver<T extends API.RealTimeStatus>(
    status: T,
    handler: API.EventHandler<T>,
): API.Subscription | null {
    if (observers.has(status)) {
        observers.get(status).add(handler);
        return new RealTimeEventSubscription(status, observers, handler);
    }
    return null;
}

export function notifyObservers(status: API.RealTimeStatus): void {
    if (observers.has(status)) {
        observers.get(status).forEach((handler) => handler(status));
    }
}
