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
import { Subject, Observable, filter } from "rxjs";
import * as API from "../api/index.js";

export const Rx = new Subject<API.Message<API.Status>>();

export function observe(
    status: API.Status,
    channel?: API.Channel,
): Observable<API.Message<API.Status>> {
    return Rx.pipe(
        filter((message) => message !== null),
        filter((message) => {
            if (channel !== undefined) {
                return message.status === status && message.channel === channel;
            }
            return message.status === status;
        }),
    );
}
