import * as API from '../api/factory.js';
import * as LIB from '../lib/factory.js';

import { READERS } from './readers.js';

function readChannelMessage(view: DataView, offset: number): API.MidiMessage<API.MidiData>|null {
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

function readRealTimeMessage(view: DataView, offset: number): API.MidiMessage<API.MidiData> | null {
    const status = view.getUint8(offset);
    if (READERS.has(status)) {
        const read = READERS.get(status);
        return read(view, offset);
    }
    return null;
}

function readSystemMessage(view: DataView, offset: number): null {
    offset += 1; // skip 0XFF meta event marker
    const status = view.getUint8(offset) as API.RealTimeStatus;
    offset += 1;

    if (READERS.has(status)) {
        LIB.notifyObservers(status);
    }

    return null;
}

export function readMidiMessage(data: Uint8Array, offset = 0): API.MidiMessage<API.MidiData>|null {
    const view = new DataView(data.buffer);
    if (LIB.isSystemMessage(view, offset)) {
        return readSystemMessage(view, offset);
    }
    if (LIB.isRealTimeMessage(view, offset)) {
        return readRealTimeMessage(view, offset);
    }
    return readChannelMessage(view, offset);
}
