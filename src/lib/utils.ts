import * as API from '../api/index.js';

const MIDI_MESSAGE_MAX_BYTES = 3;

export function times<T>(length: number, op: (idx: number) => T): T[] {
    return Array.from({ length }).map((_, i) => op(i));
}

export function isVariableLengthQuantityDelimiter(value: number): boolean {
    const unmasked = 0x80 & value;
    return 0 === unmasked;
}

export function readVariableLengthQuantity(
    data: DataView,
    offset: number,
): API.VariableLengthValue {
    let [last, current] = [0, 0];
    /* eslint-disable no-plusplus */
    for (let i = 0; i < 4; ++i, ++offset) {
        current = data.getUint8(offset);
        if (isVariableLengthQuantityDelimiter(current)) {
            return {
                value: last + current,
                offset: offset + 1,
            };
        }
        const next = current & 0x7f;
        last += next;
        last <<= 7;
    }
    throw new RangeError('4 bytes limit exceeded for variable length quantity');
}

export function readString(view: DataView, offset: number, length: number) {
    return times(length, (i) => String.fromCharCode(view.getUint8(offset + i))).join('');
}

export function readBytes(view: DataView, offset: number, length: number): number[] {
    return times<number>(length, (i) => view.getUint8(offset + i));
}

export function isSystemMessage(view: DataView, offset: number): boolean {
    const status = view.getUint8(offset);
    return 0xff === status;
}

export function isRunningStatusChange(view: DataView, offset: number) {
    const unmasked = view.getUint8(offset) && 0x80;
    return 0 !== unmasked;
}

export function writeChannelStatusByte(view: DataView, offset: number, status: API.MidiStatus, channel: number): number {
    const midiStatus =  (status << 4) | (channel - 1);
    view.setUint8(offset, midiStatus);
    return offset + 1;
}

export function writeSystemStatusByte(view: DataView, offset: number, status: API.MidiStatus): number {
    view.setUint8(offset, status);;
    return offset + 1;
}

export function newMIDIUint8Array(): Uint8Array {
    return new Uint8Array(MIDI_MESSAGE_MAX_BYTES);
}

export function getDataView(bytes = [0]): DataView {
    const buffer = new ArrayBuffer(bytes.length);
    const view = new DataView(buffer);
    bytes.forEach((b, i) => view.setUint8(i, b));
    return view;
}
