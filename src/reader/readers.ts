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

const READERS = new Map<API.MidiStatus, LIB.MidiMessageReader<API.MidiStatus>>();

function createReader<T extends API.MidiStatus>(
    status: T,
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
    createReader<API.MidiStatus.NOTE_ON>(
        API.MidiStatus.NOTE_ON,
        new IMP.NoteOnDeserializer(),
    ),
);

READERS.set(
    API.MidiStatus.NOTE_OFF,
    createReader<API.MidiStatus.NOTE_OFF>(
        API.MidiStatus.NOTE_OFF,
        new IMP.NoteOffDeserializer(),
    ),
);

READERS.set(
    API.MidiStatus.CONTROL_CHANGE,
    createReader<API.MidiStatus.CONTROL_CHANGE>(
        API.MidiStatus.CONTROL_CHANGE,
        new IMP.ControlChangeDeserializer(),
    ),
);

READERS.set(
    API.MidiStatus.NOTE_AFTER_TOUCH,
    createReader<API.MidiStatus.NOTE_AFTER_TOUCH>(
        API.MidiStatus.NOTE_AFTER_TOUCH,
        new IMP.NoteAfterTouchDeserializer(),
    ),
);

READERS.set(
    API.MidiStatus.CHANNEL_AFTER_TOUCH,
    createReader<API.MidiStatus.CHANNEL_AFTER_TOUCH>(
        API.MidiStatus.CHANNEL_AFTER_TOUCH,
        new IMP.ChannelAfterTouchDeserializer(),
    ),
);

READERS.set(
    API.MidiStatus.PITCH_BEND,
    createReader<API.MidiStatus.PITCH_BEND>(
        API.MidiStatus.PITCH_BEND,
        new IMP.PitchBendDeserializer(),
    ),
);

READERS.set(
    API.MidiStatus.PROGRAM_CHANGE,
    createReader<API.MidiStatus.PROGRAM_CHANGE>(
        API.MidiStatus.PROGRAM_CHANGE,
        new IMP.ProgramChangeDeserializer(),
    ),
);

READERS.set(
    API.MidiStatus.SYSEX,
    createReader<API.MidiStatus.SYSEX>(API.MidiStatus.SYSEX, new IMP.SysexDeserializer()),
);

READERS.set(
    API.MidiStatus.TIMING_CLOCK,
    createReader<API.MidiStatus.TIMING_CLOCK>(
        API.MidiStatus.TIMING_CLOCK,
        new IMP.TimingClockDeserializer(),
    ),
);

READERS.set(
    API.MidiStatus.START,
    createReader<API.MidiStatus.START>(API.MidiStatus.START, new IMP.StartDeserializer()),
);

READERS.set(
    API.MidiStatus.STOP,
    createReader<API.MidiStatus.STOP>(API.MidiStatus.STOP, new IMP.StopDeserializer()),
);

READERS.set(
    API.MidiStatus.CONTINUE,
    createReader<API.MidiStatus.CONTINUE>(
        API.MidiStatus.CONTINUE,
        new IMP.ContinueDeserializer(),
    ),
);

READERS.set(
    API.MidiStatus.ACTIVE_SENDING,
    createReader<API.MidiStatus.ACTIVE_SENDING>(
        API.MidiStatus.ACTIVE_SENDING,
        new IMP.ActiveSendingDeserializer(),
    ),
);

READERS.set(
    API.MidiStatus.SYSTEM_RESET,
    createReader<API.MidiStatus.SYSTEM_RESET>(
        API.MidiStatus.SYSTEM_RESET,
        new IMP.SystemResetDeserializer(),
    ),
);

READERS.set(
    API.MidiStatus.MTC,
    createReader<API.MidiStatus.MTC>(API.MidiStatus.MTC, new IMP.MTCDeserializer()),
);

READERS.set(
    API.MidiStatus.SONG_POSITION,
    createReader<API.MidiStatus.SONG_POSITION>(
        API.MidiStatus.SONG_POSITION,
        new IMP.SongPositionDeserializer(),
    ),
);

READERS.set(
    API.MidiStatus.SONG_SELECT,
    createReader<API.MidiStatus.SONG_SELECT>(
        API.MidiStatus.SONG_SELECT,
        new IMP.SongSelectDeserializer(),
    ),
);

READERS.set(
    API.MidiStatus.TUNE_REQUEST,
    createReader<API.MidiStatus.TUNE_REQUEST>(
        API.MidiStatus.TUNE_REQUEST,
        new IMP.TuneRequestDeserializer(),
    ),
);

export { READERS };
