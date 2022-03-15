# 🎹 noon-io

Easy io for the [Web MIDI API](https://www.w3.org/TR/webmidi/)

## 🚨 Disclaimer

Development has just started and until v1.0.0 has been released, noon-io should be considered at least unstable.

# 🗒️ API Documentation

A more detailed documentation of noon-io can be found [here](https://a-cordier.github.io/noon-io/docs).

# 🚀 Getting started

## 📦 Install

```bash
npm i noon-io
```

## 📤 Send MIDI messages

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

## 🔨 Using channel message factory functions

For one dedicated channel, noon-io offers a more concise way of writing messages using factory functions.

```typescript
// send a CC of 80 for control 71
output.send(NIO.channel(2).controlChange(71, 80));
// send a A4 note on message with a velocity of 120
output.send(NIO.channel(2).noteOn(69, 120));
// send the subsequent note off message for our A4 note
output.send(NIO.channel(2).noteOff(69));
```

For more information about noon-io factories, you can checkout this [documentation](https://a-cordier.github.io/noon-io/docs/interfaces/ChannelMessageFactory.html)

## 📥 Read MIDI messages

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

## ⚗️ Bank Select / Program Change

Sending a bank select followed by a program change can be achieved by sending two consecutives contol change messages before 
sending the actual program change. 

(The following has been tested on a Dave Smith Instruments Mopho device)

```typescript
import * as NIO from 'noon-io';
/*
 * Start Bank Select message
 * Selects banks 2 (bank 1 is 0) for channel 2
 */
output.send(
    NIO.writeMidiMessage({
        status: NIO.MidiStatus.CONTROL_CHANGE,
        channel: 2,
        data: {
            control: 0, // bank select MSB (always 0)
            value: 1, // MSB multiplier
        }
    })
);

output.send(
    NIO.writeMidiMessage({
        status: NIO.MidiStatus.CONTROL_CHANGE,
        channel: 2,
        data: {
            control: 0, // bank select LSB (always 32)
            value: 1, // LSB multiplier
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

Or using the `bankSelectMSB` and `bankSelectLSB` factories provided by noon-io

```typescript
// Select bank 1
output.send(NIO.channel(2).bankSelectMSB(0));
output.send(NIO.channel(2).bankSelectLSB(0));
// Select program 109 from bank 1
output.send(NIO.channel(2).programChange(Math.ceil(Math.random() * 127)));
```

# 🚧 Supported Messages

⚠️ Some of the following MIDI messages may not have been tested on a MIDI port (see the status section of the following tables)

## 🎶 Channel Messages

|Type|Reader|Writer|Status
|:--|:-:|:-:|:--|
|NOTE ON|✅|✅|Read and write have been tested on a MIDI port
|NOTE OFF|✅|✅|Read and write have been tested on a MIDI port
|PITCH BEND|✅|✅|Read and write have been tested on a MIDI port
|CONTROL CHANGE|✅|✅|Read and write have been tested on a MIDI port
|PROGRAM CHANGE|✅|✅|Read and write have been tested on a MIDI port
|NOTE AFTER TOUCH|✅|✅|Both read and write have not been tested
|CHANNEL AFTER TOUCH|✅|✅|Both read and write have not been tested

## 🎛️ System Messages

|Type|Reader|Writer|Status
|:--|:-:|:-:|:--|
|TIMING CLOCK|✅|✅|Both read and write have not been tested
|START|✅|✅|Both read and write have not been tested
|STOP|✅|✅|Both read and write have not been tested
|CONTINUE|✅|✅|Both read and write have not been tested
|SYSTEM RESET|✅|✅|Both read and write have not been tested
|ACTIVE SENDING|✅|✅|Both read and write have not been tested
|SYSTEM EXCLUSIVE|❌|❌|Not Implemented
|END OF SYSTEM EXCLUSIVE|❌|❌|Not Implemented
|MIDI TIME CODE QUARTER FRAME|❌|❌|Not Implemented
|SONG POSITION|❌|❌|Not Implemented
|SONG SELECT|❌|❌|Not Implemented
|TUNE REQUEST|❌|❌|Not Implemented
