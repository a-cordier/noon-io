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
import { MidiStatus } from "./midi-status";

export interface MidiMessage<T> {
    /**
     * The MIDI status, identifying the type of the MIDI message
     * @see MidiStatus
     */
    status: MidiStatus;

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
    data?: T;
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
export type SysexValue = SingleValue<number[]>;

/**
 * For MIDI notes, value holds the MIDI value of the note
 */
export interface MidiNote extends NumberValue {
    /**
     * the velocity to apply to the note
     */
    velocity: number;
    frequency: number;
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

/**
 * The kind of data one can expect to be hold by a MIDI Message
 */
export type MidiData =
    | StringValue
    | NumberValue
    | SysexValue
    | MidiNote
    | MidiNoteAfterTouch
    | MidiControlChange
    | MidiPitchBend
    | void;
