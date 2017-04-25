import * as API from '../api/index.js';
import * as LIB from '../lib/index.js';
import * as IMP from './deserializers.js';

const READERS = new Map<API.MidiStatus, LIB.MidiMessageReader<API.MidiData>>();

function createReader<T>(
    status: API.MidiStatus,
    deserializer: LIB.MidiDataDeserializer<T>,
): LIB.MidiMessageReader<T> {
    return function (view: DataView, offset: number): API.MidiMessage<T> {
        const deser = deserializer.deserialize(view, offset);
        return {
            status,
            ...deser,
        };
    };
}

READERS.set(
    API.MidiStatus.NOTE_ON,
    createReader<API.MidiNote>(API.MidiStatus.NOTE_ON, new IMP.NoteDeserializer()),
);

READERS.set(
    API.MidiStatus.NOTE_OFF,
    createReader<API.MidiNote>(API.MidiStatus.NOTE_OFF, new IMP.NoteDeserializer()),
);

READERS.set(
    API.MidiStatus.CONTROL_CHANGE,
    createReader<API.MidiControlChange>(
        API.MidiStatus.CONTROL_CHANGE,
        new IMP.ControlChangeDeserializer(),
    ),
);

READERS.set(
    API.MidiStatus.NOTE_AFTER_TOUCH,
    createReader<API.MidiNoteAfterTouch>(
        API.MidiStatus.NOTE_AFTER_TOUCH,
        new IMP.NoteAfterTouchDeserializer(),
    ),
);

READERS.set(
    API.MidiStatus.CHANNEL_AFTER_TOUCH,
    createReader<API.NumberValue>(
        API.MidiStatus.CHANNEL_AFTER_TOUCH,
        new IMP.NumberValueSerializer(),
    ),
);

READERS.set(
    API.MidiStatus.PITCH_BEND,
    createReader<API.MidiPitchBend>(API.MidiStatus.PROGRAM_CHANGE, new IMP.PitchBendDeserializer()),
);

READERS.set(
    API.MidiStatus.PROGRAM_CHANGE,
    createReader<API.NumberValue>(API.MidiStatus.PROGRAM_CHANGE, new IMP.NumberValueSerializer()),
);

READERS.set(
    API.MidiStatus.SEQUENCE_NAME,
    createReader<API.StringValue>(API.MidiStatus.SEQUENCE_NAME, new IMP.StringValueDeserializer()),
);

READERS.set(
    API.MidiStatus.INSTRUMENT_NAME,
    createReader<API.StringValue>(
        API.MidiStatus.INSTRUMENT_NAME,
        new IMP.StringValueDeserializer(),
    ),
);

READERS.set(
    API.MidiStatus.SYSEX_MESSAGE,
    createReader<API.SysexValue>(API.MidiStatus.SYSEX_MESSAGE, new IMP.SysexDeserializer()),
);

export { READERS };
