import * as API from '../api/index.js';
import * as LIB from '../lib/index.js';
import * as IMP from './serializers.js';

const WRITERS = new Map<API.MidiStatus, LIB.MidiMessageWriter<API.MidiData>>();

function createWriter<T>(
    serializer: LIB.MidiDataSerializer<T>,
    writeChannelStatusByte: LIB.StatusWriter,
): LIB.MidiMessageWriter<T> {
    return function (message: API.MidiMessage<T>): Uint8Array {
        const data = LIB.newMIDIUint8Array();
        const view = new DataView(data.buffer);
        const offset = message.offset || 0;
        view.setUint8(offset, writeChannelStatusByte(message.status, message.channel));
        serializer.serialize(view, message.data, offset + 1);
        return data;
    };
}

WRITERS.set(
    API.MidiStatus.NOTE_ON,
    createWriter<API.MidiNote>(new IMP.NoteTriggerSerializer(), LIB.writeChannelStatusByte),
);

WRITERS.set(
    API.MidiStatus.NOTE_OFF,
    createWriter<API.MidiNote>(new IMP.NoteTriggerSerializer(), LIB.writeChannelStatusByte),
);

WRITERS.set(
    API.MidiStatus.CONTROL_CHANGE,
    createWriter<API.MidiControlChange>(
        new IMP.ControlChangeSerializer(),
        LIB.writeChannelStatusByte,
    ),
);

WRITERS.set(
    API.MidiStatus.NOTE_AFTER_TOUCH,
    createWriter<API.MidiNoteAfterTouch>(
        new IMP.NoteAfterTouchSerializer(),
        LIB.writeChannelStatusByte,
    ),
);

WRITERS.set(
    API.MidiStatus.CHANNEL_AFTER_TOUCH,
    createWriter<API.NumberValue>(new IMP.NumberValueSerializer(), LIB.writeChannelStatusByte),
);

WRITERS.set(
    API.MidiStatus.PROGRAM_CHANGE,
    createWriter<API.NumberValue>(new IMP.NumberValueSerializer(), LIB.writeChannelStatusByte),
);

export { WRITERS };
