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
import { MidiStatus } from "./midi-status.js";

/**
 * Associates each MIDI status with the definition of its data bytes.
 *
 * This type is essentially used internally to infer the data carried by a MIDI message
 * from its status.
 */
export type MidiData = {
    /**
     * Data definition for a Note Off message
     * @see MidiStatus.NOTE_OFF
     * @see MidiNote
     */
    [MidiStatus.NOTE_OFF]: MidiNote;
    /**
     * Data definition for a Note On message
     * @see MidiStatus.NOTE_ON
     * @see MidiNote
     */
    [MidiStatus.NOTE_ON]: MidiNote;
    /**
     * Data definition for a Control Change message
     * @see MidiStatus.CONTROL_CHANGE
     * @see MidiControlChange
     */
    [MidiStatus.CONTROL_CHANGE]: MidiControlChange;
    /**
     * Data definition for a Pitch Bend message
     * @see MidiStatus.PITCH_BEND
     * @see MidiPitchBend
     */
    [MidiStatus.PITCH_BEND]: MidiPitchBend;
    /**
     * Data definition for a Note Aftertouch message
     * @see MidiStatus.NOTE_AFTER_TOUCH
     * @see MidiPitchBend
     */
    [MidiStatus.NOTE_AFTER_TOUCH]: MidiNoteAfterTouch;
    /**
     * Data definition for a Channel Aftertouch message
     * @see MidiStatus.CHANNEL_AFTER_TOUCH
     * @see NumberValue
     */
    [MidiStatus.CHANNEL_AFTER_TOUCH]: NumberValue;
    /**
     * Data definition for a Program Change message
     * @see MidiStatus.PROGRAM_CHANGE
     * @see NumberValue
     */
    [MidiStatus.PROGRAM_CHANGE]: NumberValue;
    /**
     * Data definition for a System Exclusive message
     * @see MidiStatus.SYSEX
     * @see SysexValue
     */
    [MidiStatus.SYSEX]: SysexValue;
    /**
     * Data definition for a Timing Clock message
     * @see MidiStatus.TIMING_CLOCK
     */
    [MidiStatus.TIMING_CLOCK]: void;
    /**
     * Data definition for a Start message
     * @see MidiStatus.START
     */
    [MidiStatus.START]: void;
    /**
     * Data definition for a Continue message
     * @see MidiStatus.CONTINUE
     */
    [MidiStatus.CONTINUE]: void;
    /**
     * Data definition for a Stop message
     * @see MidiStatus.STOP
     */
    [MidiStatus.STOP]: void;
    /**
     * Data definition for an Active Sending message
     * @see MidiStatus.ACTIVE_SENDING
     */
    [MidiStatus.ACTIVE_SENDING]: void;
    /**
     * Data definition for a System Reset message
     * @see MidiStatus.SYSTEM_RESET
     */
    [MidiStatus.SYSTEM_RESET]: void;
    /**
     * Data definition for a Midi Time Code message
     * @see MidiStatus.MTC
     */
    [MidiStatus.MTC]: void;
    /**
     * Data definition for a Song Position message
     * @see MidiStatus.SONG_POSITION
     */
    [MidiStatus.SONG_POSITION]: void;
    /**
     * Data definition for a Song Select message
     * @see MidiStatus.SONG_SELECT
     */
    [MidiStatus.SONG_SELECT]: void;
    /**
     * Data definition for a Tune Request message
     * @see MidiStatus.TUNE_REQUEST
     */
    [MidiStatus.TUNE_REQUEST]: void;
};

/**
 * The MidiMessage interface is the base interface for all MIDI messages.
 * It defines the common properties of all MIDI messages, the data associated
 * with the message status.
 *
 * The meta property allow to decorate the message with application specific data.
 */
export interface MidiMessage<T extends MidiStatus> {
    /**
     * The MIDI status, identifying the type of the MIDI message
     * @see MidiStatus
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
     * Can be empty for some system messages (e.g. a End Of Track message)
     */
    data?: MidiData[T] | never;
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
export interface MidiNote extends NumberValue {
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
export interface MidiNoteAfterTouch extends NumberValue {
    note: number;
}

/**
 * For MIDI control changes, value holds the value to apply to the control
 */
export interface MidiControlChange extends NumberValue {
    /**
     * control address
     */
    control: number;
}

export interface MidiPitchBend {
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
