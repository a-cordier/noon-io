import * as API from '../api/factory.js';
import * as LIB from '../lib/factory.js';

export function subscribe<T extends API.RealTimeStatus>(
    status: T,
    handler: API.EventHandler<T>,
): API.Subscription | null {
    return LIB.addObserver(status, handler);
}
