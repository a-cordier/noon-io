import * as API from '../api/index.js';

import { WRITERS } from './writers.js';

export function writeMidiMessage(message: API.MidiMessage<API.MidiData>): Uint8Array {
    if (WRITERS.has(message.status)) {
        const write = WRITERS.get(message.status);
        return write(message);
    }
    throw new RangeError(`Unknown MIDI Status ${message.status}`);
}
