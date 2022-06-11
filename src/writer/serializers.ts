import * as API from "../api/factory.js";
import * as LIB from "../lib/factory.js";

export class NoteTriggerSerializer implements LIB.MidiDataSerializer<API.MidiNote> {
    serialize(view: DataView, offset: number, note: API.MidiNote): void {
        view.setUint8(offset, note.value);
        view.setUint8(offset + 1, note.velocity);
    }
}

export class ControlChangeSerializer implements LIB.MidiDataSerializer<API.MidiControlChange> {
    serialize(view: DataView, offset: number, controlChange: API.MidiControlChange) {
        view.setUint8(offset, controlChange.control);
        view.setUint8(offset + 1, controlChange.value);
    }
}

export class PitchBendSerializer implements LIB.MidiDataSerializer<API.MidiPitchBend> {
    serialize(view: DataView, offset: number, pitchBend: API.MidiPitchBend) {
        view.setUint8(offset, pitchBend.lsb);
        view.setUint8(offset + 1, pitchBend.msb);
        return offset + 2;
    }
}

export class NoteAfterTouchSerializer implements LIB.MidiDataSerializer<API.MidiNoteAfterTouch> {
    serialize(view: DataView, offset: number, afterTouch: API.MidiNoteAfterTouch) {
        view.setUint8(offset, afterTouch.note);
        view.setUint8(offset + 1, afterTouch.value);
    }
}

export class NumberValueSerializer implements LIB.MidiDataSerializer<API.NumberValue> {
    serialize(view: DataView, offset: number, programChange: API.NumberValue) {
        view.setUint8(offset, programChange.value);
    }
}

export class NoopSerializer implements LIB.MidiDataSerializer<void> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    serialize(view: DataView, offset: number) {}
}
