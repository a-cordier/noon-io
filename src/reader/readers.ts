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
import * as API from "../api/factory.js";
import * as LIB from "../lib/factory.js";
import * as IMP from "./deserializers.js";

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
    API.MidiStatus.SYSEX,
    createReader<API.SysexValue>(API.MidiStatus.SYSEX, new IMP.SysexDeserializer()),
);

READERS.set(
    API.MidiStatus.TIMING_CLOCK,
    createReader<void>(API.MidiStatus.TIMING_CLOCK, new IMP.EmptyMessageDeserializer()),
);

READERS.set(
    API.MidiStatus.START,
    createReader<void>(API.MidiStatus.START, new IMP.EmptyMessageDeserializer()),
);

READERS.set(
    API.MidiStatus.STOP,
    createReader<void>(API.MidiStatus.STOP, new IMP.EmptyMessageDeserializer()),
);

READERS.set(
    API.MidiStatus.CONTINUE,
    createReader<void>(API.MidiStatus.CONTINUE, new IMP.EmptyMessageDeserializer()),
);

READERS.set(
    API.MidiStatus.ACTIVE_SENDING,
    createReader<void>(API.MidiStatus.ACTIVE_SENDING, new IMP.EmptyMessageDeserializer()),
);

READERS.set(
    API.MidiStatus.SYSTEM_RESET,
    createReader<void>(API.MidiStatus.SYSTEM_RESET, new IMP.EmptyMessageDeserializer()),
);

export { READERS };
