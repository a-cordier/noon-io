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
import { Message } from "./message.js";
import { Status } from "./status.js";

/**
 * Shorthand types for the different MIDI messages.
 */
export namespace Messages {
    export type ControlChange = Message<Status.CONTROL_CHANGE>;
    export type Note = Message<Status.NOTE_ON | Status.NOTE_OFF>;
    export type NoteOn = Message<Status.NOTE_ON>;
    export type NoteOff = Message<Status.NOTE_OFF>;
    export type PitchBend = Message<Status.PITCH_BEND>;
    export type NoteAfterTouch = Message<Status.NOTE_AFTER_TOUCH>;
    export type ChannelAfterTouch = Message<Status.CHANNEL_AFTER_TOUCH>;
    export type ProgramChange = Message<Status.PROGRAM_CHANGE>;
    export type Sysex = Message<Status.SYSEX>;
    export type TimingClock = Message<Status.TIMING_CLOCK>;
    export type Start = Message<Status.START>;
    export type Stop = Message<Status.STOP>;
    export type Continue = Message<Status.CONTINUE>;
    export type ActiveSending = Message<Status.ACTIVE_SENDING>;
    export type SystemReset = Message<Status.SYSTEM_RESET>;
    export type SongSelect = Message<Status.SONG_SELECT>;
    export type SongPosition = Message<Status.SONG_POSITION>;
    export type MTC = Message<Status.MTC>;
    export type TuneRequest = Message<Status.TUNE_REQUEST>;
}
