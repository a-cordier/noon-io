# 🎹 noon-io

Easy io for the [Web MIDI API](https://www.w3.org/TR/webmidi/)

🚀 Getting started
--

## Sending a message

Send a A4 `NOTE ON` message on all available MIDI outputs


```typescript
import { MidiStatus, writeMidiMessage } from 'noon-io';

// get access to the Web MIDI API
this.midiAccess = await navigator.requestMIDIAccess();

// send a Note On message over all available outputs on channel 2
for (const output of this.midiAccess.outputs.values()) {
    const noteOnMessage = {
        status: MidiStatus.NOTE_ON,
        channel: 2,
        data: {
            value: 69, // A4
            velocity: 127
        }
    };
    output.send(writeMidiMessage(noteOnMessage));
}
```

### Reading a message

Print messages received from any available MIDI input in the console.

```typescript
import { MidiStatus, readMidiMessage } from 'noon-io';

// get access to the Web MIDI API
this.midiAccess = await navigator.requestMIDIAccess();

// Log received messages for all available inputs
for (const input of this.midiAccess.input.values()) {
    input.onmidimessage = (msg) => {
        const readableMessage = readMidiMessage(msg.data);
        console.log(readableMessage);
    };
}
```

🚧 Supported Message
--

:warning: Some supported MIDI messages may not have been tested on a MIDI port (see the status section of the following table)

## Channel Messages

|Type|Reader|Writer|Status
|:-:|:-:|:-:|:--|
|NOTE_ON|:white_check_mark:|:white_check_mark:|Only write has been tested on a MIDI port
|NOTE_OFF|:white_check_mark:|:white_check_mark:|Only write has been tested on a MIDI port
|NOTE_AFTER_TOUCH|:white_check_mark:|:white_check_mark:|Both read and write have not been tested
|CONTROL_CHANGE|:white_check_mark:|:white_check_mark:|Both read and write have not been tested
|CHANNEL_AFTER_TOUCH|:white_check_mark:|:white_check_mark:|Both read and write have not been tested
|PITCH_BEND|:white_check_mark:|:x:|Read has not been tested, write is not implemented

## System Messages

|Type|Reader|Writer|Status
|:-:|:-:|:-:|:--|
|PROGRAM_CHANGE|:white_check_mark:|:white_check_mark:|Both read and write have not been tested
|SYSEX_MESSAGE|:white_check_mark:|:x:|Read has not been tested, write is not implemented
|SEQUENCE_NAME|:white_check_mark:|:x:|Read has not been tested, write is not implemented
|INSTRUMENT_NAME|:white_check_mark:|:x:|Read has not been tested, write is not implemented
|SEQUENCE_NUMBER|:x:|:x:|Not implemented
|TEXT_EVENT|:x:|:x:|Not implemented
|COPYRIGHT_NOTICE|:x:|:x:|Not implemented
|LYRIC|:x:|:x:|Not implemented
|MARKER|:x:|:x:|Not implemented
|CUE_POINT|:x:|:x:|Not implemented
|MIDI_CHANNEL_PREFIX|:x:|:x:|Not implemented
|END_OF_TRACK|:x:|:x:|Not implemented
|SET_TEMPO|:x:|:x:|Not implemented
|SMPTE_OFFSET|:x:|:x:|Not implemented
|TIME_SIGNATURE|:x:|:x:|Not implemented
|KEY_SIGNATURE|:x:|:x:|Not implemented
