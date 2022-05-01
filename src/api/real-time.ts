export interface EventHandler<T> {
    (event: T): void;
}

export interface Subscription {
    unsubscribe(): void;
}
