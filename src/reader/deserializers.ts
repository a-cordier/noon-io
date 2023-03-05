import * as API from "../api/factory.js";
import * as LIB from "../lib/factory.js";

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
        const vlq = LIB.readVariableLengthQuantity(view, offset);
        offset = vlq.offset;
        const bytes = LIB.readBytes(view, offset, vlq.value);
        offset += vlq.value;
        return {
            data: {
                value: bytes,
            },
            offset,
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
