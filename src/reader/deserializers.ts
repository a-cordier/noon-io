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

export class NoteOnDeserializer
    implements LIB.MidiDataDeserializer<API.MidiStatus.NOTE_ON>
{
    deserialize(
        view: DataView,
        offset: number,
    ): LIB.DeserializationResult<API.MidiStatus.NOTE_ON> {
        return {
            data: deserializeNote(view, offset),
            offset: offset + 2,
        };
    }
}

export class NoteOffDeserializer
    implements LIB.MidiDataDeserializer<API.MidiStatus.NOTE_OFF>
{
    deserialize(
        view: DataView,
        offset: number,
    ): LIB.DeserializationResult<API.MidiStatus.NOTE_OFF> {
        return {
            data: deserializeNote(view, offset),
            offset: offset + 2,
        };
    }
}

export class ControlChangeDeserializer
    implements LIB.MidiDataDeserializer<API.MidiStatus.CONTROL_CHANGE>
{
    deserialize(
        view: DataView,
        offset: number,
    ): LIB.DeserializationResult<API.MidiStatus.CONTROL_CHANGE> {
        return {
            data: {
                control: view.getUint8(offset),
                value: view.getUint8(offset + 1),
            },
            offset: offset + 2,
        };
    }
}

export class ChannelAfterTouchDeserializer
    implements LIB.MidiDataDeserializer<API.MidiStatus.CHANNEL_AFTER_TOUCH>
{
    deserialize(
        view: DataView,
        offset: number,
    ): LIB.DeserializationResult<API.MidiStatus.CHANNEL_AFTER_TOUCH> {
        return {
            data: {
                value: view.getUint8(offset),
            },
            offset: offset + 1,
        };
    }
}

export class ProgramChangeDeserializer
    implements LIB.MidiDataDeserializer<API.MidiStatus.PROGRAM_CHANGE>
{
    deserialize(
        view: DataView,
        offset: number,
    ): LIB.DeserializationResult<API.MidiStatus.PROGRAM_CHANGE> {
        return {
            data: {
                value: view.getUint8(offset),
            },
            offset: offset + 1,
        };
    }
}

export class NoteAfterTouchDeserializer
    implements LIB.MidiDataDeserializer<API.MidiStatus.NOTE_AFTER_TOUCH>
{
    deserialize(
        view: DataView,
        offset: number,
    ): LIB.DeserializationResult<API.MidiStatus.NOTE_AFTER_TOUCH> {
        return {
            data: {
                note: view.getUint8(offset),
                value: view.getUint8(offset + 1),
            },
            offset: offset + 2,
        };
    }
}

export class PitchBendDeserializer
    implements LIB.MidiDataDeserializer<API.MidiStatus.PITCH_BEND>
{
    deserialize(
        view: DataView,
        offset: number,
    ): LIB.DeserializationResult<API.MidiStatus.PITCH_BEND> {
        return {
            data: {
                lsb: view.getUint8(offset),
                msb: view.getUint8(offset + 1),
            },
            offset: offset + 2,
        };
    }
}

export class SysexDeserializer implements LIB.MidiDataDeserializer<API.MidiStatus.SYSEX> {
    deserialize(
        view: DataView,
        offset: number,
    ): LIB.DeserializationResult<API.MidiStatus.SYSEX> {
        let endOffset = offset + 1;

        while (endOffset < view.byteLength) {
            if (view.getUint8(endOffset) === 0xf7) {
                break;
            }
            endOffset += 1;
        }

        const data = view.buffer.slice(offset + 1, endOffset);
        const value = new Uint8Array(data);

        return {
            data: {
                value,
            },
            offset: endOffset + 1,
        };
    }
}

export class TimingClockDeserializer
    implements LIB.MidiDataDeserializer<API.MidiStatus.TIMING_CLOCK>
{
    deserialize(
        _: DataView,
        offset: number,
    ): LIB.DeserializationResult<API.MidiStatus.TIMING_CLOCK> {
        return {
            offset: offset + 1,
        };
    }
}

export class StartDeserializer implements LIB.MidiDataDeserializer<API.MidiStatus.START> {
    deserialize(
        _: DataView,
        offset: number,
    ): LIB.DeserializationResult<API.MidiStatus.START> {
        return {
            offset: offset + 1,
        };
    }
}

export class StopDeserializer implements LIB.MidiDataDeserializer<API.MidiStatus.STOP> {
    deserialize(
        _: DataView,
        offset: number,
    ): LIB.DeserializationResult<API.MidiStatus.STOP> {
        return {
            offset: offset + 1,
        };
    }
}

export class ContinueDeserializer
    implements LIB.MidiDataDeserializer<API.MidiStatus.CONTINUE>
{
    deserialize(
        _: DataView,
        offset: number,
    ): LIB.DeserializationResult<API.MidiStatus.CONTINUE> {
        return {
            offset: offset + 1,
        };
    }
}

export class ActiveSendingDeserializer
    implements LIB.MidiDataDeserializer<API.MidiStatus.ACTIVE_SENDING>
{
    deserialize(
        _: DataView,
        offset: number,
    ): LIB.DeserializationResult<API.MidiStatus.ACTIVE_SENDING> {
        return {
            offset: offset + 1,
        };
    }
}

export class SystemResetDeserializer
    implements LIB.MidiDataDeserializer<API.MidiStatus.SYSTEM_RESET>
{
    deserialize(
        view: DataView,
        offset: number,
    ): LIB.DeserializationResult<API.MidiStatus.SYSTEM_RESET> {
        return {
            offset: offset + 1,
        };
    }
}

export class MTCDeserializer implements LIB.MidiDataDeserializer<API.MidiStatus.MTC> {
    deserialize(
        view: DataView,
        offset: number,
    ): LIB.DeserializationResult<API.MidiStatus.MTC> {
        return {
            offset: offset + 1,
        };
    }
}

export class SongSelectDeserializer
    implements LIB.MidiDataDeserializer<API.MidiStatus.SONG_SELECT>
{
    deserialize(
        view: DataView,
        offset: number,
    ): LIB.DeserializationResult<API.MidiStatus.SONG_SELECT> {
        return {
            offset: offset + 1,
        };
    }
}

export class SongPositionDeserializer
    implements LIB.MidiDataDeserializer<API.MidiStatus.SONG_POSITION>
{
    deserialize(
        view: DataView,
        offset: number,
    ): LIB.DeserializationResult<API.MidiStatus.SONG_POSITION> {
        return {
            offset: offset + 2,
        };
    }
}

export class TuneRequestDeserializer
    implements LIB.MidiDataDeserializer<API.MidiStatus.TUNE_REQUEST>
{
    deserialize(
        view: DataView,
        offset: number,
    ): LIB.DeserializationResult<API.MidiStatus.TUNE_REQUEST> {
        return {
            offset: offset + 1,
        };
    }
}

function deserializeNote(view: DataView, offset: number): API.MidiNote {
    const value = view.getUint8(offset);
    const velocity = view.getUint8(offset + 1);
    const note = LIB.MidiNotes[value];
    return {
        value,
        velocity,
        frequency: note.frequency,
        name: note.name,
    };
}
