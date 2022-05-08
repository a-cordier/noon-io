import * as API from '../api/factory.js';
import * as LIB from '../lib/factory.js';

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
