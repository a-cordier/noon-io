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
import * as API from "../api/index.js";

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
