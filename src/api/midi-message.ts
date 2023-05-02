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

export type MidiData = {
    [MidiStatus.NOTE_OFF]: MidiNote;
    [MidiStatus.NOTE_ON]: MidiNote;
    [MidiStatus.CONTROL_CHANGE]: MidiControlChange;
    [MidiStatus.PITCH_BEND]: MidiPitchBend;
    [MidiStatus.NOTE_AFTER_TOUCH]: MidiNoteAfterTouch;
    [MidiStatus.CHANNEL_AFTER_TOUCH]: NumberValue;
    [MidiStatus.PROGRAM_CHANGE]: NumberValue;
    [MidiStatus.SYSEX]: SysexValue;
    [MidiStatus.TIMING_CLOCK]: void;
    [MidiStatus.START]: void;
    [MidiStatus.CONTINUE]: void;
    [MidiStatus.STOP]: void;
    [MidiStatus.ACTIVE_SENDING]: void;
    [MidiStatus.SYSTEM_RESET]: void;
    [MidiStatus.MTC]: void;
    [MidiStatus.SONG_POSITION]: void;
    [MidiStatus.SONG_SELECT]: void;
    [MidiStatus.TUNE_REQUEST]: void;
};

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

export type ControlChangeMessage = MidiMessage<MidiStatus.CONTROL_CHANGE>;
export type NoteMessage = MidiMessage<MidiStatus.NOTE_ON | MidiStatus.NOTE_OFF>;
export type NoteOnMessage = MidiMessage<MidiStatus.NOTE_ON>;
export type NoteOffMessage = MidiMessage<MidiStatus.NOTE_OFF>;
export type NoteAfterTouchMessage = MidiMessage<MidiStatus.NOTE_AFTER_TOUCH>;
export type ChannelAfterTouchMessage = MidiMessage<MidiStatus.CHANNEL_AFTER_TOUCH>;
export type ProgramChangeMessage = MidiMessage<MidiStatus.PROGRAM_CHANGE>;
export type PitchBendMessage = MidiMessage<MidiStatus.PITCH_BEND>;
export type SysexMessage = MidiMessage<MidiStatus.SYSEX>;
export type TimingClockMessage = MidiMessage<MidiStatus.TIMING_CLOCK>;
export type StartMessage = MidiMessage<MidiStatus.START>;
export type ContinueMessage = MidiMessage<MidiStatus.CONTINUE>;
export type StopMessage = MidiMessage<MidiStatus.STOP>;
export type ActiveSendingMessage = MidiMessage<MidiStatus.ACTIVE_SENDING>;
export type SystemResetMessage = MidiMessage<MidiStatus.SYSTEM_RESET>;
export type MtcMessage = MidiMessage<MidiStatus.MTC>;
export type SongPositionMessage = MidiMessage<MidiStatus.SONG_POSITION>;
export type SongSelectMessage = MidiMessage<MidiStatus.SONG_SELECT>;
export type TuneRequestMessage = MidiMessage<MidiStatus.TUNE_REQUEST>;
