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
import test, { ExecutionContext } from "ava";

import * as UTILS from "../internal/utils.js";
import * as DESER from "./deserializers.js";

test("NoteDeserializer should return note A4 (69) with a velocity of 80 and read two bytes", (t: ExecutionContext<unknown>) => {
    const deserializer = new DESER.NoteOnDeserializer();
    const bytes = [69, 80];
    const view = UTILS.getDataView(bytes);
    const result = deserializer.deserialize(view, 0);
    t.is(69, result.data.value);
    t.is(80, result.data.velocity);
    t.is(2, result.offset);
});

test("PolyphonicAfterTouchDeserializer should return an aftertouch of 80 for note 69 and read two bytes", (t: ExecutionContext<unknown>) => {
    const deserializer = new DESER.PolyphonicAfterTouchDeserializer();
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
