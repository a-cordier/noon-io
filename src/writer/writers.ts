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
import * as IMP from "./serializers.js";

const WRITERS = new Map<API.MidiStatus, LIB.MidiMessageWriter<API.MidiData>>();

function createWriter<T>(
    statusEncoder: LIB.StatusEncoder,
    serializer: LIB.MidiDataSerializer<T>,
    size: number,
): LIB.MidiMessageWriter<T> {
    return (message: API.MidiMessage<T>): Uint8Array => {
        const data = new Uint8Array(size);
        const view = new DataView(data.buffer);
        const status = statusEncoder(message.status, message.channel);
        view.setUint8(0, status);
        serializer.serialize(view, 1, message.data);
        return data;
    };
}

WRITERS.set(
    API.MidiStatus.NOTE_ON,
    createWriter<API.MidiNote>(LIB.channelStatusEncoder, new IMP.NoteTriggerSerializer(), 3),
);

WRITERS.set(
    API.MidiStatus.NOTE_OFF,
    createWriter<API.MidiNote>(LIB.channelStatusEncoder, new IMP.NoteTriggerSerializer(), 3),
);

WRITERS.set(
    API.MidiStatus.CONTROL_CHANGE,
    createWriter<API.MidiControlChange>(
        LIB.channelStatusEncoder,
        new IMP.ControlChangeSerializer(),
        3,
    ),
);

WRITERS.set(
    API.MidiStatus.NOTE_AFTER_TOUCH,
    createWriter<API.MidiNoteAfterTouch>(
        LIB.channelStatusEncoder,
        new IMP.NoteAfterTouchSerializer(),
        3,
    ),
);

WRITERS.set(
    API.MidiStatus.CHANNEL_AFTER_TOUCH,
    createWriter<API.NumberValue>(LIB.channelStatusEncoder, new IMP.NumberValueSerializer(), 2),
);

WRITERS.set(
    API.MidiStatus.PROGRAM_CHANGE,
    createWriter<API.NumberValue>(LIB.channelStatusEncoder, new IMP.NumberValueSerializer(), 2),
);

WRITERS.set(
    API.MidiStatus.PITCH_BEND,
    createWriter<API.MidiPitchBend>(LIB.channelStatusEncoder, new IMP.PitchBendSerializer(), 3),
);

WRITERS.set(
    API.MidiStatus.TIMING_CLOCK,
    createWriter<void>(LIB.systemStatusEncoder, new IMP.NoopSerializer(), 1),
);

WRITERS.set(
    API.MidiStatus.START,
    createWriter<void>(LIB.systemStatusEncoder, new IMP.NoopSerializer(), 1),
);

WRITERS.set(
    API.MidiStatus.CONTINUE,
    createWriter<void>(LIB.systemStatusEncoder, new IMP.NoopSerializer(), 1),
);

WRITERS.set(
    API.MidiStatus.STOP,
    createWriter<void>(LIB.systemStatusEncoder, new IMP.NoopSerializer(), 1),
);

WRITERS.set(
    API.MidiStatus.ACTIVE_SENDING,
    createWriter<void>(LIB.systemStatusEncoder, new IMP.NoopSerializer(), 1),
);

WRITERS.set(
    API.MidiStatus.SYSTEM_RESET,
    createWriter<void>(LIB.systemStatusEncoder, new IMP.NoopSerializer(), 1),
);

export { WRITERS };
