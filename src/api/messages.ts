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
    export type ControlChangeMessage = Message<Status.CONTROL_CHANGE>;
    export type NoteMessage = Message<Status.NOTE_ON | Status.NOTE_OFF>;
    export type NoteOnMessage = Message<Status.NOTE_ON>;
    export type NoteOffMessage = Message<Status.NOTE_OFF>;
    export type PitchBendMessage = Message<Status.PITCH_BEND>;
    export type NoteAfterTouchMessage = Message<Status.NOTE_AFTER_TOUCH>;
    export type ChannelAfterTouchMessage = Message<Status.CHANNEL_AFTER_TOUCH>;
    export type ProgramChangeMessage = Message<Status.PROGRAM_CHANGE>;
    export type SysexMessage = Message<Status.SYSEX>;
    export type TimingClockMessage = Message<Status.TIMING_CLOCK>;
    export type StartMessage = Message<Status.START>;
    export type StopMessage = Message<Status.STOP>;
    export type ContinueMessage = Message<Status.CONTINUE>;
    export type ActiveSendingMessage = Message<Status.ACTIVE_SENDING>;
    export type SystemResetMessage = Message<Status.SYSTEM_RESET>;
    export type SongSelectMessage = Message<Status.SONG_SELECT>;
    export type SongPositionMessage = Message<Status.SONG_POSITION>;
    export type MTCMessage = Message<Status.MTC>;
    export type TuneRequestMessage = Message<Status.TUNE_REQUEST>;
}
