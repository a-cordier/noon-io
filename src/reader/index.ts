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

function readChannelMessage(view: DataView, offset: number): API.MidiMessage<API.MidiData> | null {
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

function readSystemMessage(view: DataView, offset: number): API.MidiMessage<API.MidiData> | null {
    const status = view.getUint8(offset);
    if (READERS.has(status)) {
        const read = READERS.get(status);
        return read(view, offset);
    }
    return null;
}

export type MetadataDecorator = () => Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

export interface ReaderOpts {
    decorators?: Map<API.MidiStatus, MetadataDecorator>;
}

function defaultOpts(): ReaderOpts {
    return {
        decorators: new Map<API.MidiStatus, MetadataDecorator>(),
    };
}

export type MessageReader = (data: Uint8Array, opts?: ReaderOpts) => void;

export function read(data: Uint8Array, opts = defaultOpts()): void {
    const message = readMidi(data);
    if (opts.decorators.has(message.status)) {
        const decorator = opts.decorators.get(message.status);
        message.meta = decorator();
    }
    LIB.messageStream.next(message);
}

export function reader(opts?: ReaderOpts): MessageReader {
    return (data: Uint8Array): void => read(data, opts);
}

function readMidi(data: Uint8Array): API.MidiMessage<API.MidiData> {
    const view = new DataView(data.buffer);
    if (LIB.isSystemMessage(view, 0)) {
        return readSystemMessage(view, 0);
    }
    return readChannelMessage(view, 0);
}
