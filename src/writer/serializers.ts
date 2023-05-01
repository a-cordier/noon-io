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
import * as API from "../api/index.js";
import * as LIB from "../internal/index.js";

export class NoteOnSerializer implements LIB.MidiDataSerializer<API.MidiStatus.NOTE_ON> {
    serialize(view: DataView, offset: number, note: API.MidiNote): void {
        view.setUint8(offset, note.value);
        view.setUint8(offset + 1, note.velocity);
    }
}

export class NoteOffSerializer
    implements LIB.MidiDataSerializer<API.MidiStatus.NOTE_OFF>
{
    serialize(view: DataView, offset: number, note: API.MidiNote): void {
        view.setUint8(offset, note.value);
        view.setUint8(offset + 1, note.velocity);
    }
}

export class ControlChangeSerializer
    implements LIB.MidiDataSerializer<API.MidiStatus.CONTROL_CHANGE>
{
    serialize(view: DataView, offset: number, controlChange: API.MidiControlChange) {
        view.setUint8(offset, controlChange.control);
        view.setUint8(offset + 1, controlChange.value);
    }
}

export class PitchBendSerializer
    implements LIB.MidiDataSerializer<API.MidiStatus.PITCH_BEND>
{
    serialize(view: DataView, offset: number, pitchBend: API.MidiPitchBend) {
        view.setUint8(offset, pitchBend.lsb);
        view.setUint8(offset + 1, pitchBend.msb);
        return offset + 2;
    }
}

export class NoteAfterTouchSerializer
    implements LIB.MidiDataSerializer<API.MidiStatus.NOTE_AFTER_TOUCH>
{
    serialize(view: DataView, offset: number, afterTouch: API.MidiNoteAfterTouch) {
        view.setUint8(offset, afterTouch.note);
        view.setUint8(offset + 1, afterTouch.value);
    }
}

export class ProgramChangeSerializer
    implements LIB.MidiDataSerializer<API.MidiStatus.PROGRAM_CHANGE>
{
    serialize(view: DataView, offset: number, programChange: API.NumberValue) {
        view.setUint8(offset, programChange.value);
    }
}

export class TimingClockSerializer
    implements LIB.MidiDataSerializer<API.MidiStatus.TIMING_CLOCK>
{
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    serialize(view: DataView, offset: number) {}
}

export class StartSerializer implements LIB.MidiDataSerializer<API.MidiStatus.START> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    serialize(view: DataView, offset: number) {}
}

export class StopSerializer implements LIB.MidiDataSerializer<API.MidiStatus.STOP> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    serialize(view: DataView, offset: number) {}
}

export class ContinueSerializer
    implements LIB.MidiDataSerializer<API.MidiStatus.CONTINUE>
{
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    serialize(view: DataView, offset: number) {}
}

export class ActiveSendingSerializer
    implements LIB.MidiDataSerializer<API.MidiStatus.ACTIVE_SENDING>
{
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    serialize(view: DataView, offset: number) {}
}

export class SystemResetSerializer
    implements LIB.MidiDataSerializer<API.MidiStatus.SYSTEM_RESET>
{
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    serialize(view: DataView, offset: number) {}
}
