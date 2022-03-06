import * as API from '../api/factory.js';

import { WRITERS } from './writers.js';

export function writeMidiMessage(message: API.MidiMessage<API.MidiData>): Uint8Array {
    if (WRITERS.has(message.status)) {
        const write = WRITERS.get(message.status);
        return write(message);
    }
    throw new RangeError(`Unknown MIDI Status ${message.status}`);
}

/**
 * For a dedicated MIDI channel, MidiMessageFactory offers a more concise way of writing MIDI messages
 * using factory functions
 *
 * see {@link channel}
 */
export interface MidiMessageFactory {
    /**
     * Creates a MIDI Note On message as a Uint8Array
     * @param value the MIDI value of the note
     * @param velocity the velocity of the note (if ommited, the default value is 64)
     */
    noteOn(value: number, velocity?: number): Uint8Array;
    /**
     * Creates a MIDI Note Off message as a Uint8Array
     * @param value the MIDI value of the note to stop
     */
    noteOff(value: number): Uint8Array;
    /**
     * Creates a Control Change MIDI message as a Uint8Array
     * @param control the control address to send a value on
     * @param value the value to be sent to the selected control
     */
    controlChange(control: number, value: number): Uint8Array;
    /**
     * Creates a Program Change MiIDI message as a Uint8Array
     * @param value the program to select
     */
    programChange(value: number): Uint8Array;
}

export function channel(channel: number): MidiMessageFactory {
    return {
        noteOn(value: number, velocity = 64): Uint8Array {
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
