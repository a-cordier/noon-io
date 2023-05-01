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

import { READERS } from "./readers.js";

function readChannelMessage(
    view: DataView,
    offset: number,
): API.MidiMessage<API.MidiStatus> | null {
    if (LIB.isRunningStatusChange(view, offset)) {
        const rawStatus = view.getUint8(offset) >>> 4; // leftmost bits gives the status
        const rawChannel = view.getUint8(offset) & 0xf; // rightmost bits gives the channel (starting from 0)
        const status = rawStatus as API.MidiStatus;
        const channel = rawChannel + 1;
        LIB.RunningStatus.instance.set({ channel, status });
        offset += 1;
    }

    if (!READERS.has(LIB.RunningStatus.instance.status)) {
        return null;
    }

    const read = READERS.get(LIB.RunningStatus.instance.status);
    const message = read(view, offset);
    message.channel = LIB.RunningStatus.instance.channel;

    return message;
}

function readSystemMessage(
    view: DataView,
    offset: number,
): API.MidiMessage<API.MidiStatus> | null {
    const status = view.getUint8(offset);
    if (READERS.has(status)) {
        const read = READERS.get(status);
        return read(view, offset);
    }
    return null;
}

export type MetadataDecorator<T extends API.MidiStatus> = (
    message: API.MidiMessage<T>,
) => Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

type MetadataDecorators = {
    [T in API.MidiStatus]: MetadataDecorator<T>;
};

export interface ReaderOpts {
    decorators?: MetadataDecorators;
}

function decorate<T extends API.MidiStatus>(
    message: API.MidiMessage<T>,
    decorators: MetadataDecorators,
): API.MidiMessage<T> {
    const decorator = decorators[message.status];
    if (decorator) {
        return {
            ...message,
            meta: decorator(message),
        };
    }
    return message;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function, @typescript-eslint/no-explicit-any
function noopDecorator<T extends API.MidiStatus>(
    message: API.MidiMessage<T>,
): Record<string, any> {
    return {};
}

function assignDefaultReaderOpts(opts: Partial<ReaderOpts>): ReaderOpts {
    return Object.assign({}, opts, {
        decorators: {
            [API.MidiStatus.NOTE_ON]: noopDecorator<API.MidiStatus.NOTE_ON>,
            [API.MidiStatus.NOTE_OFF]: noopDecorator<API.MidiStatus.NOTE_OFF>,
            [API.MidiStatus.CONTROL_CHANGE]: noopDecorator<API.MidiStatus.CONTROL_CHANGE>,
            [API.MidiStatus.PROGRAM_CHANGE]: noopDecorator<API.MidiStatus.PROGRAM_CHANGE>,
            [API.MidiStatus.NOTE_AFTER_TOUCH]:
                noopDecorator<API.MidiStatus.NOTE_AFTER_TOUCH>,
            [API.MidiStatus.CHANNEL_AFTER_TOUCH]:
                noopDecorator<API.MidiStatus.CHANNEL_AFTER_TOUCH>,
            [API.MidiStatus.PITCH_BEND]: noopDecorator<API.MidiStatus.PITCH_BEND>,
            [API.MidiStatus.TIMING_CLOCK]: noopDecorator<API.MidiStatus.TIMING_CLOCK>,
            [API.MidiStatus.SONG_POSITION]: noopDecorator<API.MidiStatus.SONG_POSITION>,
            [API.MidiStatus.SONG_SELECT]: noopDecorator<API.MidiStatus.SONG_SELECT>,
            [API.MidiStatus.TUNE_REQUEST]: noopDecorator<API.MidiStatus.TUNE_REQUEST>,
            [API.MidiStatus.TIMING_CLOCK]: noopDecorator<API.MidiStatus.TIMING_CLOCK>,
            [API.MidiStatus.START]: noopDecorator<API.MidiStatus.START>,
            [API.MidiStatus.CONTINUE]: noopDecorator<API.MidiStatus.CONTINUE>,
            [API.MidiStatus.STOP]: noopDecorator<API.MidiStatus.STOP>,
            [API.MidiStatus.ACTIVE_SENDING]: noopDecorator<API.MidiStatus.ACTIVE_SENDING>,
            [API.MidiStatus.SYSTEM_RESET]: noopDecorator<API.MidiStatus.SYSTEM_RESET>,
            [API.MidiStatus.MTC]: noopDecorator<API.MidiStatus.MTC>,
            [API.MidiStatus.SYSEX]: noopDecorator<API.MidiStatus.SYSEX>,
        },
    });
}

export type MessageReader = (data: Uint8Array, opts?: ReaderOpts) => void;

export function read(data: Uint8Array, partialOpts = {}): void {
    const opts = assignDefaultReaderOpts(partialOpts);
    const message = readMidi(data);
    LIB.messageStream.next(decorate(message, opts.decorators));
}

export function reader(partialOpts = {}): MessageReader {
    return (data: Uint8Array): void => read(data, partialOpts);
}

function readMidi(data: Uint8Array): API.MidiMessage<API.MidiStatus> {
    const view = new DataView(data.buffer);
    if (LIB.isSystemMessage(view, 0)) {
        return readSystemMessage(view, 0);
    }
    return readChannelMessage(view, 0);
}
