# 🎹 noon-io

Easy io for the [Web MIDI API](https://www.w3.org/TR/webmidi/)

## :warning: Disclaimer

Development has just started and until v1.0.0 has been released, noon-io should be considered at least unstable.

🚀 Getting started
--

## Install

```bash
npm i noon-io
```

## Send MIDI messages

Send a A4 `NOTE ON` message on all available MIDI outputs


```typescript
import * as NIO from 'noon-io';

// Gain access to the Web MIDI API
const midiAccess = await navigator.requestMIDIAccess();

// Send a Note On message over all available outputs on channel 2
for (const output of midiAccess.outputs.values()) {
    const noteOnMessage = {
        status: NIO.MidiStatus.NOTE_ON,
        channel: 2,
        data: {
            value: 69, // A4
            velocity: 127
        }
    };
    output.send(NIO.writeMidiMessage(noteOnMessage));
}
```

## Using factory functions

For one dedicated channel, noon-io offers a more concise way of writing message using factory functions.

```typescript
// send a CC of 80 for control 71
output.send(NIO.channel(2).controlChange(71, 80));
// send a A4 note on message with a velocity of 120
output.send(NIO.channel(2).noteOn(69, 120));
// send the subsequent note off message for our A4 note
output.send(NIO.channel(2).noteOff(69));
```

## Read MIDI messages

Print messages received from any available MIDI input in the console.

```typescript
import * as NIO from 'noon-io';

// Gain access to the Web MIDI API
const midiAccess = await navigator.requestMIDIAccess();

// Log messages received from any available input
for (const input of midiAccess.inputs.values()) {
    input.onmidimessage = (msg) => {
        console.log(NIO.readMidiMessage(msg.data));
    };
}
```

## :alembic: Bank Select / Program Change

Sending a bank select followed by a program change can be achieved by sending two consecutives contol change messages before 
sending the actual program change. 

(The following has been tested on a Dave Smith Instruments Mopho device)

```typescript

/*
 * Start Bank Select message
 * Selects banks 2 (bank 1 is 0) for channel 2
 */
output.send(
    NIO.writeMidiMessage({
        status: NIO.MidiStatus.CONTROL_CHANGE,
        channel: 2,
        data: {
        control: 32, // always 32
            value: 1, // bank value
        }
    })
);

output.send(
    NIO.writeMidiMessage({
        status: NIO.MidiStatus.CONTROL_CHANGE,
        channel: 2,
        data: {
        control: 0, // always 0
            value: 1, // bank value (ignored on most devices)
        }
    })
); // Ends bank select message

/*
 * Now that we have selected bank 2,
 * let's select a random program
 */
output.send(
    NIO.writeMidiMessage({
        status: NIO.MidiStatus.PROGRAM_CHANGE,
        channel: 2,
        data: {
            value: Math.ceil(Math.random() * 127),
        }
    })
);

```

🚧 Supported Message
--

:warning: Some supported MIDI messages may not have been tested on a MIDI port (see the status section of the following table)

## Channel Messages

|Type|Reader|Writer|Status
|:-:|:-:|:-:|:--|
|NOTE_ON|:white_check_mark:|:white_check_mark:|Read and write have been tested on a MIDI port
|NOTE_OFF|:white_check_mark:|:white_check_mark:|Read and write have been tested on a MIDI port
|PITCH_BEND|:white_check_mark:|:white_check_mark:|Read and write have been tested on a MIDI port
|CONTROL_CHANGE|:white_check_mark:|:white_check_mark:|Read and write have been tested on a MIDI port
|PROGRAM_CHANGE|:white_check_mark:|:white_check_mark:|Read and write have been tested on a MIDI port
|NOTE_AFTER_TOUCH|:white_check_mark:|:white_check_mark:|Both read and write have not been tested
|CHANNEL_AFTER_TOUCH|:white_check_mark:|:white_check_mark:|Both read and write have not been tested

## System Messages

|Type|Reader|Writer|Status
|:-:|:-:|:-:|:--|
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
