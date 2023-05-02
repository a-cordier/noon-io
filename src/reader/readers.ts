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
import * as IMP from "./deserializers.js";

const READERS = new Map<API.Status, LIB.MidiMessageReader<API.Status>>();

function createReader<T extends API.Status>(
    status: T,
    deserializer: LIB.MidiDataDeserializer<T>,
): LIB.MidiMessageReader<T> {
    return function (view: DataView, offset: number): API.Message<T> {
        const deser = deserializer.deserialize(view, offset);
        return {
            status,
            ...deser,
        };
    };
}

READERS.set(
    API.Status.NOTE_ON,
    createReader<API.Status.NOTE_ON>(API.Status.NOTE_ON, new IMP.NoteOnDeserializer()),
);

READERS.set(
    API.Status.NOTE_OFF,
    createReader<API.Status.NOTE_OFF>(API.Status.NOTE_OFF, new IMP.NoteOffDeserializer()),
);

READERS.set(
    API.Status.CONTROL_CHANGE,
    createReader<API.Status.CONTROL_CHANGE>(
        API.Status.CONTROL_CHANGE,
        new IMP.ControlChangeDeserializer(),
    ),
);

READERS.set(
    API.Status.NOTE_AFTER_TOUCH,
    createReader<API.Status.NOTE_AFTER_TOUCH>(
        API.Status.NOTE_AFTER_TOUCH,
        new IMP.NoteAfterTouchDeserializer(),
    ),
);

READERS.set(
    API.Status.CHANNEL_AFTER_TOUCH,
    createReader<API.Status.CHANNEL_AFTER_TOUCH>(
        API.Status.CHANNEL_AFTER_TOUCH,
        new IMP.ChannelAfterTouchDeserializer(),
    ),
);

READERS.set(
    API.Status.PITCH_BEND,
    createReader<API.Status.PITCH_BEND>(
        API.Status.PITCH_BEND,
        new IMP.PitchBendDeserializer(),
    ),
);

READERS.set(
    API.Status.PROGRAM_CHANGE,
    createReader<API.Status.PROGRAM_CHANGE>(
        API.Status.PROGRAM_CHANGE,
        new IMP.ProgramChangeDeserializer(),
    ),
);

READERS.set(
    API.Status.SYSEX,
    createReader<API.Status.SYSEX>(API.Status.SYSEX, new IMP.SysexDeserializer()),
);

READERS.set(
    API.Status.TIMING_CLOCK,
    createReader<API.Status.TIMING_CLOCK>(
        API.Status.TIMING_CLOCK,
        new IMP.TimingClockDeserializer(),
    ),
);

READERS.set(
    API.Status.START,
    createReader<API.Status.START>(API.Status.START, new IMP.StartDeserializer()),
);

READERS.set(
    API.Status.STOP,
    createReader<API.Status.STOP>(API.Status.STOP, new IMP.StopDeserializer()),
);

READERS.set(
    API.Status.CONTINUE,
    createReader<API.Status.CONTINUE>(
        API.Status.CONTINUE,
        new IMP.ContinueDeserializer(),
    ),
);

READERS.set(
    API.Status.ACTIVE_SENDING,
    createReader<API.Status.ACTIVE_SENDING>(
        API.Status.ACTIVE_SENDING,
        new IMP.ActiveSendingDeserializer(),
    ),
);

READERS.set(
    API.Status.SYSTEM_RESET,
    createReader<API.Status.SYSTEM_RESET>(
        API.Status.SYSTEM_RESET,
        new IMP.SystemResetDeserializer(),
    ),
);

READERS.set(
    API.Status.MTC,
    createReader<API.Status.MTC>(API.Status.MTC, new IMP.MTCDeserializer()),
);

READERS.set(
    API.Status.SONG_POSITION,
    createReader<API.Status.SONG_POSITION>(
        API.Status.SONG_POSITION,
        new IMP.SongPositionDeserializer(),
    ),
);

READERS.set(
    API.Status.SONG_SELECT,
    createReader<API.Status.SONG_SELECT>(
        API.Status.SONG_SELECT,
        new IMP.SongSelectDeserializer(),
    ),
);

READERS.set(
    API.Status.TUNE_REQUEST,
    createReader<API.Status.TUNE_REQUEST>(
        API.Status.TUNE_REQUEST,
        new IMP.TuneRequestDeserializer(),
    ),
);

export { READERS };
