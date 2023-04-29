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

export class NumberValueSerializer implements LIB.MidiDataDeserializer<API.NumberValue> {
    deserialize(view: DataView, offset: number): LIB.DeserializationResult<API.NumberValue> {
        return {
            data: {
                value: view.getUint8(offset),
            },
            offset: offset + 1,
        };
    }
}

export class StringValueDeserializer implements LIB.MidiDataDeserializer<API.StringValue> {
    deserialize(view: DataView, offset: number): LIB.DeserializationResult<API.StringValue> {
        const length = view.getUint8(offset);
        const value = LIB.readString(view, offset + 1, length);
        offset = offset + length + 2;
        return {
            data: {
                value,
            },
            offset,
        };
    }
}

export class NoteDeserializer implements LIB.MidiDataDeserializer<API.MidiNote> {
    deserialize(view: DataView, offset: number): LIB.DeserializationResult<API.MidiNote> {
        const value = view.getUint8(offset);
        const velocity = view.getUint8(offset + 1);
        const note = LIB.MidiNotes[value];
        return {
            data: {
                value,
                velocity,
                frequency: note.frequency,
                name: note.name,
            },
            offset: offset + 2,
        };
    }
}

export class NoteAfterTouchDeserializer
    implements LIB.MidiDataDeserializer<API.MidiNoteAfterTouch>
{
    deserialize(view: DataView, offset: number): LIB.DeserializationResult<API.MidiNoteAfterTouch> {
        return {
            data: {
                note: view.getUint8(offset),
                value: view.getUint8(offset + 1),
            },
            offset: offset + 2,
        };
    }
}

export class ControlChangeDeserializer implements LIB.MidiDataDeserializer<API.MidiControlChange> {
    deserialize(view: DataView, offset: number): LIB.DeserializationResult<API.MidiControlChange> {
        return {
            data: {
                control: view.getUint8(offset),
                value: view.getUint8(offset + 1),
            },
            offset: offset + 2,
        };
    }
}

export class PitchBendDeserializer implements LIB.MidiDataDeserializer<API.MidiPitchBend> {
    deserialize(view: DataView, offset: number): LIB.DeserializationResult<API.MidiPitchBend> {
        return {
            data: {
                lsb: view.getUint8(offset),
                msb: view.getUint8(offset + 1),
            },
            offset: offset + 2,
        };
    }
}

export class SysexDeserializer implements LIB.MidiDataDeserializer<API.SysexValue> {
    deserialize(view: DataView, offset: number): LIB.DeserializationResult<API.SysexValue> {
        offset += 1;
        let endOffset = offset;

        const boundary = 0x7f;

        while (endOffset < view.byteLength) {
            if (view.getUint8(endOffset) === boundary) {
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

export class EmptyMessageDeserializer implements LIB.MidiDataDeserializer<void> {
    deserialize(view: DataView, offset: number): LIB.DeserializationResult<void> {
        return {
            offset: offset + 1,
        };
    }
}
