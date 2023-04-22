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
import * as API from "../api/factory.js";
import * as LIB from "../internal/factory.js";

/**
 * subscribe to real time system MIDI messages
 *
 * It is important to notice that the subscription should be
 * made before the MIDI messages are received (i.e. before reading on a specific MIDI port)
 * @param status the real time status to subscribe to
 * @param handler an event handler to be called when a message is readen with the given status
 * @returns a subscription to the event that can be cancelled  later if needed
 */
export function subscribe<T extends API.RealTimeStatus>(
    status: T,
    handler: API.EventHandler<T>,
): API.Subscription | null {
    return LIB.addObserver(status, handler);
}
