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
import { Status } from "./status.js";

/**
 * The 16 MIDI channels numbered from 0 to 15.
 */
export type Channel = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15;

/**
 * The MIDI channel 16 is reserved for Omni channel mode.
 */
export type OmniChannel = 16;

/**
 * Associates each MIDI status with the definition of its data bytes.
 *
 * This type is essentially used internally to infer the data carried by a MIDI message
 * from its status.
 */
export type DataTypes = {
    /**
     * Data definition for a Note Off message
     * @see Status.NOTE_OFF
     * @see Note
     */
    [Status.NOTE_OFF]: Note;
    /**
     * Data definition for a Note On message
     * @see Status.NOTE_ON
     * @see Note
     */
    [Status.NOTE_ON]: Note;
    /**
     * Data definition for a Control Change message
     * @see Status.CONTROL_CHANGE
     * @see ControlChange
     */
    [Status.CONTROL_CHANGE]: ControlChange;
    /**
     * Data definition for a Pitch Bend message
     * @see Status.PITCH_BEND
     * @see PitchBend
     */
    [Status.PITCH_BEND]: PitchBend;
    /**
     * Data definition for a Note Aftertouch message
     * @see Status.POLYPHONIC_AFTER_TOUCH
     * @see PitchBend
     */
    [Status.POLYPHONIC_AFTER_TOUCH]: PolyphonicAfterTouch;
    /**
     * Data definition for a Channel Aftertouch message
     * @see Status.CHANNEL_AFTER_TOUCH
     * @see NumberValue
     */
    [Status.CHANNEL_AFTER_TOUCH]: NumberValue;
    /**
     * Data definition for a Program Change message
     * @see Status.PROGRAM_CHANGE
     * @see NumberValue
     */
    [Status.PROGRAM_CHANGE]: NumberValue;
    /**
     * Data definition for a System Exclusive message
     * @see Status.SYSEX
     * @see SysexValue
     */
    [Status.SYSEX]: SysexValue;
    /**
     * Data definition for a Timing Clock message
     * @see Status.TIMING_CLOCK
     */
    [Status.TIMING_CLOCK]: void;
    /**
     * Data definition for a Start message
     * @see Status.START
     */
    [Status.START]: void;
    /**
     * Data definition for a Continue message
     * @see Status.CONTINUE
     */
    [Status.CONTINUE]: void;
    /**
     * Data definition for a Stop message
     * @see Status.STOP
     */
    [Status.STOP]: void;
    /**
     * Data definition for an Active Sensing message
     * @see Status.ACTIVE_SENSING
     */
    [Status.ACTIVE_SENSING]: void;
    /**
     * Data definition for a System Reset message
     * @see Status.SYSTEM_RESET
     */
    [Status.SYSTEM_RESET]: void;
    /**
     * Data definition for a Midi Time Code message
     * @see Status.MTC
     */
    [Status.MTC]: void;
    /**
     * Data definition for a Song Position message
     * @see Status.SONG_POSITION
     */
    [Status.SONG_POSITION]: void;
    /**
     * Data definition for a Song Select message
     * @see Status.SONG_SELECT
     */
    [Status.SONG_SELECT]: void;
    /**
     * Data definition for a Tune Request message
     * @see Status.TUNE_REQUEST
     */
    [Status.TUNE_REQUEST]: void;
};

/**
 * The MidiMessage interface is the base interface for all MIDI messages.
 * It defines the common properties of all MIDI messages, the data associated
 * with the message status.
 *
 * The meta property allow to decorate the message with application specific data.
 */
export interface Message<T extends Status> {
    /**
     * The MIDI status, identifying the type of the MIDI message
     * @see Status
     */
    status: T;

    /**
     * The channel on which the message is sent, if the message is not a system message
     * The minimum value is 1, the maximum value is 16
     */
    channel?: number;

    /**
     * The offset where the next message should be read
     */
    offset?: number;

    /**
     * The actual data carried by the message
     * Can be empty for some system messages (e.g. a real time messages)
     */
    data?: DataTypes[T] | never;
    /**
     * The meta data associated with the message
     * This can be used to store additional information about the message
     * and implement custom logic when subscribing to the message stream.
     */
    meta?: Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
}

/**
 * Messages that hold a single value implements this interface
 */
export interface SingleValue<T> {
    value: T;
}

/**
 * Alias for string values
 */
export type StringValue = SingleValue<string>;

/**
 * Alias for number values
 */
export type NumberValue = SingleValue<number>;

/**
 * Alias for sysex values, expressed as an array of bytes
 */
export type SysexValue = SingleValue<Uint8Array>;

/**
 * For MIDI notes, value holds the MIDI value of the note
 */
export interface Note extends NumberValue {
    /**
     * the velocity to apply to the note
     */
    velocity: number;
    /**
     * the center frequency of the note, in hertz
     */
    frequency: number;
    /**
     * the name of the note, e.g. "A4" for midi value 69
     */
    name: string;
}

/**
 * For MIDI note after touch, value holds the amount of after touch to be processed
 */
export interface PolyphonicAfterTouch extends NumberValue {
    note: number;
}

/**
 * For MIDI control changes, value holds the value to apply to the control
 */
export interface ControlChange extends NumberValue {
    /**
     * control address
     */
    control: number;
}

export interface PitchBend {
    /**
     * least significant byte of the pitch bend message
     */
    lsb: number;
    /**
     * most significant byte of the pitch bend message
     */
    msb: number;
}

/**
 * For Variable length quantity values, value holds the actual value expressed by the MIDI message
 * @throws RangeError if 4 bytes have been read without being able to return a value
 */
export interface VariableLengthValue extends NumberValue {
    /**
     * The offset where the next message should be read (i.e. the number of bytes read plus one)
     */
    offset: number;
}
