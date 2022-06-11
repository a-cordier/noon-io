import test, { ExecutionContext } from "ava";

import * as UTILS from "../lib/utils.js";
import * as DESER from "./deserializers.js";

test("NumberValueSerializer should read one byte and return 129", (t: ExecutionContext<unknown>) => {
    const deserializer = new DESER.NumberValueSerializer();
    const view = UTILS.getDataView([129]);
    const result = deserializer.deserialize(view, 0);
    t.is(129, result.data.value);
    t.is(1, result.offset);
});

test("StringValueSerializer should read 5 bytes and return MTrk", (t: ExecutionContext<unknown>) => {
    const deserializer = new DESER.StringValueDeserializer();
    const bytes = "MTrk".split("").map((char) => char.charCodeAt(0));
    bytes.unshift(4); // the length of the string to read
    const view = UTILS.getDataView(bytes);
    const result = deserializer.deserialize(view, 0);
    t.is("MTrk", result.data.value);
    t.is(6, result.offset);
});

test("NoteDeserializer should return note A4 (69) with a velocity of 80 and read two bytes", (t: ExecutionContext<unknown>) => {
    const deserializer = new DESER.NoteDeserializer();
    const bytes = [69, 80];
    const view = UTILS.getDataView(bytes);
    const result = deserializer.deserialize(view, 0);
    t.is(69, result.data.value);
    t.is(80, result.data.velocity);
    t.is(2, result.offset);
});

test("NoteAfterTouchDeserializer should return an aftertouch of 80 for note 69 and read two bytes", (t: ExecutionContext<unknown>) => {
    const deserializer = new DESER.NoteAfterTouchDeserializer();
    const bytes = [69, 80];
    const view = UTILS.getDataView(bytes);
    const result = deserializer.deserialize(view, 0);
    t.is(80, result.data.value);
    t.is(69, result.data.note);
    t.is(2, result.offset);
});

test("ControlChangeDeserializer should return a value of 22 for filter res (71) and read two bytes", (t: ExecutionContext<unknown>) => {
    const deserializer = new DESER.ControlChangeDeserializer();
    const bytes = [71, 22];
    const view = UTILS.getDataView(bytes);
    const result = deserializer.deserialize(view, 0);
    t.is(71, result.data.control);
    t.is(22, result.data.value);
    t.is(2, result.offset);
});

test("PitchBendDeserializer should return 80 as pitch lsb and 81 as pitch msb and read two bytes", (t: ExecutionContext<unknown>) => {
    const deserializer = new DESER.PitchBendDeserializer();
    const bytes = [80, 81];
    const view = UTILS.getDataView(bytes);
    const result = deserializer.deserialize(view, 0);
    t.is(80, result.data.lsb);
    t.is(81, result.data.msb);
    t.is(2, result.offset);
});
