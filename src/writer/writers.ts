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

const WRITERS = new Map<API.MidiStatus, LIB.MidiMessageWriter<API.MidiStatus>>();

function createWriter<T extends API.MidiStatus>(
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
    createWriter<API.MidiStatus.NOTE_ON>(
        LIB.channelStatusEncoder,
        new IMP.NoteOnSerializer(),
        3,
    ),
);

WRITERS.set(
    API.MidiStatus.NOTE_OFF,
    createWriter<API.MidiStatus.NOTE_OFF>(
        LIB.channelStatusEncoder,
        new IMP.NoteOffSerializer(),
        3,
    ),
);

WRITERS.set(
    API.MidiStatus.CONTROL_CHANGE,
    createWriter<API.MidiStatus.CONTROL_CHANGE>(
        LIB.channelStatusEncoder,
        new IMP.ControlChangeSerializer(),
        3,
    ),
);

WRITERS.set(
    API.MidiStatus.NOTE_AFTER_TOUCH,
    createWriter<API.MidiStatus.NOTE_AFTER_TOUCH>(
        LIB.channelStatusEncoder,
        new IMP.NoteAfterTouchSerializer(),
        3,
    ),
);

WRITERS.set(
    API.MidiStatus.CHANNEL_AFTER_TOUCH,
    createWriter<API.MidiStatus.CHANNEL_AFTER_TOUCH>(
        LIB.channelStatusEncoder,
        new IMP.ProgramChangeSerializer(),
        2,
    ),
);

WRITERS.set(
    API.MidiStatus.PROGRAM_CHANGE,
    createWriter<API.MidiStatus.PROGRAM_CHANGE>(
        LIB.channelStatusEncoder,
        new IMP.ProgramChangeSerializer(),
        2,
    ),
);

WRITERS.set(
    API.MidiStatus.PITCH_BEND,
    createWriter<API.MidiStatus.PITCH_BEND>(
        LIB.channelStatusEncoder,
        new IMP.PitchBendSerializer(),
        3,
    ),
);

WRITERS.set(
    API.MidiStatus.TIMING_CLOCK,
    createWriter<API.MidiStatus.TIMING_CLOCK>(
        LIB.systemStatusEncoder,
        new IMP.TimingClockSerializer(),
        1,
    ),
);

WRITERS.set(
    API.MidiStatus.START,
    createWriter<API.MidiStatus.START>(
        LIB.systemStatusEncoder,
        new IMP.StartSerializer(),
        1,
    ),
);

WRITERS.set(
    API.MidiStatus.CONTINUE,
    createWriter<API.MidiStatus.CONTINUE>(
        LIB.systemStatusEncoder,
        new IMP.ContinueSerializer(),
        1,
    ),
);

WRITERS.set(
    API.MidiStatus.STOP,
    createWriter<API.MidiStatus.STOP>(
        LIB.systemStatusEncoder,
        new IMP.StopSerializer(),
        1,
    ),
);

WRITERS.set(
    API.MidiStatus.ACTIVE_SENDING,
    createWriter<API.MidiStatus.ACTIVE_SENDING>(
        LIB.systemStatusEncoder,
        new IMP.ActiveSendingSerializer(),
        1,
    ),
);

WRITERS.set(
    API.MidiStatus.SYSTEM_RESET,
    createWriter<API.MidiStatus.SYSTEM_RESET>(
        LIB.systemStatusEncoder,
        new IMP.SystemResetSerializer(),
        1,
    ),
);

export { WRITERS };
