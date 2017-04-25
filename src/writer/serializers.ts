import * as API from '../api/index.js';
import * as LIB from '../lib/index.js';

export class NoteTriggerSerializer implements LIB.MidiDataSerializer<API.MidiNote> {
    serialize(view: DataView, note: API.MidiNote, offset: number): number {
        view.setUint8(offset, note.value);
        view.setUint8(offset + 1, note.velocity);
        return offset + 2;
    }
}

export class ControlChangeSerializer implements LIB.MidiDataSerializer<API.MidiControlChange> {
    serialize(view: DataView, controlChange: API.MidiControlChange, offset: number): number {
        view.setUint8(offset, controlChange.control);
        view.setUint8(offset + 1, controlChange.value);
        return offset + 2;
    }
}

export class PitchBendSerializer implements LIB.MidiDataSerializer<API.MidiPitchBend> {
    serialize(view: DataView, pitchBend: API.MidiPitchBend, offset: number): number {
        view.setUint8(offset, pitchBend.lsb);
        view.setUint8(offset + 1, pitchBend.msb);
        return offset + 2;
    }
}

export class NoteAfterTouchSerializer implements LIB.MidiDataSerializer<API.MidiNoteAfterTouch> {
    serialize(view: DataView, afterTouch: API.MidiNoteAfterTouch, offset: number): number {
        view.setUint8(offset, afterTouch.note);
        view.setUint8(offset + 1, afterTouch.value);
        return offset + 2;
    }
}

export class NumberValueSerializer implements LIB.MidiDataSerializer<API.NumberValue> {
    serialize(view: DataView, programChange: API.NumberValue, offset: number): number {
        view.setUint8(offset, programChange.value);
        return offset + 1;
    }
}
