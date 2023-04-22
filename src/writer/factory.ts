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

import { WRITERS } from "./writers.js";

export function writeMidiMessage(message: API.MidiMessage<API.MidiData>): Uint8Array {
    if (WRITERS.has(message.status)) {
        const write = WRITERS.get(message.status);
        return write(message);
    }
    throw new RangeError(`Unknown MIDI Status ${message.status}`);
}

/**
 * For a dedicated MIDI channel, noon-io offers a more concise way of writing MIDI messages
 * using factory functions
 *
 * A factory can be instanciated by calling the [channel](https://a-cordier.github.io/noon-io/docs/modules.html#channel)
 * function
 */
export interface ChannelMessageFactory {
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
     * Creates a Bank Select MSB MIDI message as a Uint8Array
     * This message is in fact a Control Change message with
     * a control address set to 0.
     *
     * Bank is selected using the product of this message value
     * and a subsequent `bankSelectLSB` message value to allow
     * up to 2097152 program changes distributed across 16384
     * banks.
     *
     * @param value the MSB multiplier of the bank select message
     */
    bankSelectMSB(value: number): Uint8Array;
    /**
     * Creates a Bank Select LSB MIDI message as a Uint8Array
     * This message is in fact a Control Change message with
     * a control address set to 32.
     *
     * Bank is selected using of a foregoing `bankSelectMSB`
     * message value and this message value to allow up to
     * 2097152 program changes distributed across 16384
     * banks.
     *
     * @param value the MSB multiplier of the bank select message
     */
    bankSelectLSB(value: number): Uint8Array;
    /**
     * Creates a Program Change MIDI message as a Uint8Array
     * @param value the program to select
     */
    programChange(value: number): Uint8Array;
}

export function channel(channel: number): ChannelMessageFactory {
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
        bankSelectMSB(value: number): Uint8Array {
            return writeMidiMessage({
                status: API.MidiStatus.CONTROL_CHANGE,
                channel,
                data: {
                    control: 0,
                    value,
                },
            });
        },
        bankSelectLSB(value: number): Uint8Array {
            return writeMidiMessage({
                status: API.MidiStatus.CONTROL_CHANGE,
                channel,
                data: {
                    control: 32,
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
