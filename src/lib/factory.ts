import * as API from '../api/index.js';

interface MidiMessageFactory {
    noteOn(value: number, velocity?: number): API.MidiMessage<API.MidiNote>;
    noteOff(value: number): API.MidiMessage<API.MidiNote>;
    controlChange(control: number, value: number): API.MidiMessage<API.MidiControlChange>;
    programChange(value: number): API.MidiMessage<API.NumberValue>;
}

function channel(channel: number): MidiMessageFactory {
    return {
        noteOn(value: number, velocity = 127): API.MidiMessage<API.MidiNote> {
            return {
                status: API.MidiStatus.NOTE_ON,
                channel,
                data: {
                    value,
                    velocity,
                },
            };
        },
        noteOff(value: number): API.MidiMessage<API.MidiNote> {
            return {
                status: API.MidiStatus.NOTE_OFF,
                channel,
                data: {
                    value,
                    velocity: 0,
                },
            };
        },
        controlChange(control: number, value: number): API.MidiMessage<API.MidiControlChange> {
            return {
                status: API.MidiStatus.CONTROL_CHANGE,
                channel,
                data: {
                    control,
                    value,
                },
            };
        },
        programChange(value: number): API.MidiMessage<API.NumberValue> {
            return {
                status: API.MidiStatus.PROGRAM_CHANGE,
                channel,
                data: {
                    value,
                },
            };
        },
    };
}

export { channel };
