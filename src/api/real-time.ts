/*
 * Copyright (C) 2020 Antoine CORDIER
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
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
