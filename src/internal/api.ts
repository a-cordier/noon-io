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

/**
 * @internal
 */
export interface DeserializationResult<T extends API.Status> {
    data?: API.DataTypes[T] | never;
    offset: number;
}

/**
 * @internal
 */
export interface MidiDataDeserializer<T extends API.Status> {
    /**
     * Read bytes and build an object of type T
     * @param view A DataView of an Uint8Array buffer holding MIDI encoding data
     * @param offset The offset where the read operation should start
     */
    deserialize(view: DataView, offset: number): DeserializationResult<T>;
}

/**
 * @internal
 */
export interface MidiMessageReader<T extends API.Status> {
    /**
     * @param   view A DataView of an Uint8Array buffer holding MIDI encoding data
     * @param   offset The offset where the read operation should start
     * @returns The MIDI message decoded from the DataView
     */
    (view: DataView, offset: number): API.Message<T>;
}

/**
 * @internal
 */
export interface MidiDataSerializer<T extends API.Status> {
    /**
     * @param data A DataView holding the Uint8Array buffer to write in
     * @param message The message to serialize to the DataView
     * @returns The number of bytes written to the DataView
     */
    serialize(view: DataView, offset: number, message: API.DataTypes[T]): void;
}

/**
 * @internal
 */
export interface MidiMessageWriter<T extends API.Status> {
    /**
     * @internal
     * @param message: A noon formatted MIDI message
     * @returns The MIDI message as a MIDI encoded Uint8Array
     */
    (message: API.Message<T>): Uint8Array;
}

/**
 * @internal
 */
export interface StatusEncoder {
    /**
     * @param status The MIDI status without the channel bytes in case of a channel message
     * @param channel The MIDI channel to add to the MIDI status in case of a channel message
     * @returns The actual message status deduced from status and channel
     */
    (status: API.Status, channel?: number): number;
}

/**
 * @internal
 *
 * Helper class for channel MIDI messages that relies on the Running Status
 *
 * This class is meant to be shared across module and should be accessed through the `instance` getter
 *
 */
export class RunningStatus {
    static #instance: RunningStatus;

    public status: API.Status;
    public channel: number;

    private constructor() {
        /* eslint-disable @typescript-eslint/no-empty-function */
    }

    public static get instance(): RunningStatus {
        if (!RunningStatus.#instance) {
            RunningStatus.#instance = new RunningStatus();
        }
        return RunningStatus.#instance;
    }

    public set({ status, channel }: Partial<RunningStatus>): void {
        this.status = status;
        this.channel = channel;
    }
}
