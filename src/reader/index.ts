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
import * as INT from "../internal/index.js";

import { Rx } from "../rx/index.js";

import { READERS } from "./readers.js";

function readChannelMessage(
    view: DataView,
    offset: number,
): API.Message<API.Status> | null {
    if (INT.isRunningStatusChange(view, offset)) {
        const rawStatus = view.getUint8(offset) >>> 4; // leftmost bits gives the status
        const rawChannel = view.getUint8(offset) & 0xf; // rightmost bits gives the channel (starting from 0)
        const status = rawStatus as API.Status;
        const channel = rawChannel + 1;
        INT.RunningStatus.instance.set({ channel, status });
        offset += 1;
    }

    if (!READERS.has(INT.RunningStatus.instance.status)) {
        return null;
    }

    const read = READERS.get(INT.RunningStatus.instance.status);
    const message = read(view, offset);
    message.channel = INT.RunningStatus.instance.channel;

    return message;
}

function readSystemMessage(
    view: DataView,
    offset: number,
): API.Message<API.Status> | null {
    const status = view.getUint8(offset);
    if (READERS.has(status)) {
        const read = READERS.get(status);
        return read(view, offset);
    }
    return null;
}

export type MetadataDecorator<T extends API.Status> = (
    message: API.Message<T>,
) => Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

type MetadataDecorators = {
    [T in API.Status]: MetadataDecorator<T>;
};

export interface ReaderOpts {
    decorators?: MetadataDecorators;
}

function decorate<T extends API.Status>(
    message: API.Message<T>,
    decorators: MetadataDecorators,
): API.Message<T> {
    const decorator = decorators[message.status];
    if (decorator) {
        return {
            ...message,
            meta: decorator(message),
        };
    }
    return message;
}

function noopDecorator<T extends API.Status>(
    message: API.Message<T>, // eslint-disable-line @typescript-eslint/no-unused-vars
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Record<string, any> {
    return {};
}

function defaultOpts(): ReaderOpts {
    return {
        decorators: {
            [API.Status.NOTE_ON]: noopDecorator<API.Status.NOTE_ON>,
            [API.Status.NOTE_OFF]: noopDecorator<API.Status.NOTE_OFF>,
            [API.Status.CONTROL_CHANGE]: noopDecorator<API.Status.CONTROL_CHANGE>,
            [API.Status.PROGRAM_CHANGE]: noopDecorator<API.Status.PROGRAM_CHANGE>,
            [API.Status.POLYPHONIC_AFTER_TOUCH]:
                noopDecorator<API.Status.POLYPHONIC_AFTER_TOUCH>,
            [API.Status.CHANNEL_AFTER_TOUCH]:
                noopDecorator<API.Status.CHANNEL_AFTER_TOUCH>,
            [API.Status.PITCH_BEND]: noopDecorator<API.Status.PITCH_BEND>,
            [API.Status.TIMING_CLOCK]: noopDecorator<API.Status.TIMING_CLOCK>,
            [API.Status.SONG_POSITION]: noopDecorator<API.Status.SONG_POSITION>,
            [API.Status.SONG_SELECT]: noopDecorator<API.Status.SONG_SELECT>,
            [API.Status.TUNE_REQUEST]: noopDecorator<API.Status.TUNE_REQUEST>,
            [API.Status.TIMING_CLOCK]: noopDecorator<API.Status.TIMING_CLOCK>,
            [API.Status.START]: noopDecorator<API.Status.START>,
            [API.Status.CONTINUE]: noopDecorator<API.Status.CONTINUE>,
            [API.Status.STOP]: noopDecorator<API.Status.STOP>,
            [API.Status.ACTIVE_SENSING]: noopDecorator<API.Status.ACTIVE_SENSING>,
            [API.Status.SYSTEM_RESET]: noopDecorator<API.Status.SYSTEM_RESET>,
            [API.Status.MTC]: noopDecorator<API.Status.MTC>,
            [API.Status.SYSEX]: noopDecorator<API.Status.SYSEX>,
        },
    };
}

function assignDefaultReaderOpts(partialOpts: Partial<ReaderOpts>): ReaderOpts {
    const opts = defaultOpts();
    if (partialOpts.decorators) {
        for (const [status, decorator] of Object.entries(partialOpts.decorators)) {
            opts.decorators[status] = decorator;
        }
    }
    return opts;
}

export type MessageReader = (data: Uint8Array, opts?: ReaderOpts) => void;

export function read(data: Uint8Array, partialOpts = {}): void {
    const opts = assignDefaultReaderOpts(partialOpts);
    const message = readMidi(data);
    Rx.next(decorate(message, opts.decorators));
}

export function reader(partialOpts = {}): MessageReader {
    return (data: Uint8Array): void => read(data, partialOpts);
}

function readMidi(data: Uint8Array): API.Message<API.Status> {
    const view = new DataView(data.buffer);
    if (INT.isSystemMessage(view, 0)) {
        return readSystemMessage(view, 0);
    }
    return readChannelMessage(view, 0);
}
