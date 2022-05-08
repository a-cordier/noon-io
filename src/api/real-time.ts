/**
 * An event handler that can be used to subscribe to real-time system message.
 */
export interface EventHandler<T> {
    (event: T): void;
}

/**
 * A subscription to a real time system message
 */
export interface Subscription {
    /**
     * Unsubscribes the subscription.
     * Once unsubscribed, the event handler will
     * be removed from the observers list and will
     * not be called anymore when the event is fired.
     */
    unsubscribe(): void;
}
