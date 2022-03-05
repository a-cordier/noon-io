import * as API from '../api/factory.js';

import { WRITERS } from './writers.js';

export function writeMidiMessage(message: API.MidiMessage<API.MidiData>): Uint8Array {
    if (WRITERS.has(message.status)) {
        const write = WRITERS.get(message.status);
        return write(message);
    }
    throw new RangeError(`Unknown MIDI Status ${message.status}`);
}

interface MidiMessageFactory {
    noteOn(value: number, velocity?: number): Uint8Array;
    noteOff(value: number): Uint8Array;
    controlChange(control: number, value: number): Uint8Array;
    programChange(value: number): Uint8Array;
}

export function channel(channel: number): MidiMessageFactory {
    return {
        noteOn(value: number, velocity = 127): Uint8Array {
            return writeMidiMessage({
                status: API.MidiStatus.NOTE_ON,
                channel,
                data: {
                    value,
                    velocity,
                },
            });
        },
        noteOff(value: number): Uint8Array {
            return writeMidiMessage({
                status: API.MidiStatus.NOTE_OFF,
                channel,
                data: {
                    value,
                    velocity: 0,
                },
            });
        },
        controlChange(control: number, value: number): Uint8Array {
            return writeMidiMessage({
                status: API.MidiStatus.CONTROL_CHANGE,
                channel,
                data: {
                    control,
                    value,
                },
            });
        },
        programChange(value: number): Uint8Array {
            return writeMidiMessage({
                status: API.MidiStatus.PROGRAM_CHANGE,
                channel,
                data: {
                    value,
                },
            });
        },
    };
}
