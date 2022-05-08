/**
 * The MIDI Status is used to define which type of message has been read or should be written.
 *
 * The following enumeration constants and explanations come from the MIDI 1.0 Detailed Specification
 * that can be found on the [MIDI Association](https://midi.org/specifications/midi1-specifications) web site.
 */
export enum MidiStatus {
    /**
     *
     * The MIDI Time Code Quarter Frame message communicates the Frame, Seconds, Minutes and Hours Count in an 8-message sequence.
     *
     * @category System Common Message
     */
    MTC = 0xf1,
    /**
     *
     * A sequencer's Song Position (SP) is the number of MIDI beats (1 beat = 6 MIDI clocks) that have elapsed from the start of the song
     * and is used to begin playback of a sequence from a position other than the beginning of the song.
     *
     * @category System Common Message
     */
    SONG_POSITION = 0xf2,
    /**
     *
     * Specifies which song or sequence is to be played upon receipt of a Start message in sequencers and drum machines capable of holding multiple songs or sequences.
     *
     * This message should be ignored if the receiver is not set to respond to incoming Real Time messages (MIDI Sync).
     *
     * @category System Common Message
     */
    SONG_SELECT = 0xf3,
    /**
     *
     * Used with analog synthesizers to request that all oscillators be tuned.
     *
     * @category System Common Message
     */
    TUNE_REQUEST = 0xf6,
    /**
     *
     * Used as a flag to indicate the end of a System Exclusive transmission.
     *
     * The receiver will continue to wait for data until an EOX message (F7H) or any other non-Real Time status byte is received.
     *
     * Although any Status Byte (except Real-Time) will end an exclusive message, an EOX should always be sent at the end of a System Exclusive message.
     *
     * @category System Exclusive Message
     */
    EOX = 0xf7,
    /**
     * Exclusive messages are used to send data such as patch parameters, sampler data, or a sequencer memory bulk dump
     *
     * @category System Exclusive Message
     */
    SYSEX = 0xf0,
    /**
     * Clock-based MIDI systems are synchronized with this message, which is sent at a rate of 24 per quarter note
     *
     * @category System Real Time Message
     */
    TIMING_CLOCK = 0xf8,
    /**
     * Commands all receivers which are synchronized to incoming Real Time messages (MIDI Sync mode) to start at the beginning of the song or sequence
     *
     * @category System Real Time Message
     */
    START = 0xf9,
    /**
     * Sequence will continue from its current location upon receipt of the next Timing Clock
     *
     * @category System Real Time Message
     */
    CONTINUE = 0xfb,
    /**
     * Playback in a receiver should stop immediately
     *
     * @category System Real Time Message
     */
    STOP = 0xfc,
    /**
     * Once the receiver recognizes Active Sensing, it then will expect to get a message of some kind every 300 milliseconds
     *
     * If no messages are received within this time period the receiver will assume the MIDI cable has been disconnected
     *
     * @category System Real Time Message
     */
    ACTIVE_SENDING = 0xfe,
    /**
     * Commands all devices in a system to return to their initialized, power-up condition
     *
     * @category System Real Time Message
     */
    SYSTEM_RESET = 0xff,
    /**
     * Note off message that will turn off the designated note
     *
     * @category Channel Message
     */
    NOTE_OFF = 0x08,
    /**
     * Note On message, that can be interpreted as a Note Off message, if velocity is set to 0
     *
     * @category Channel Message
     */
    NOTE_ON = 0x09,
    /**
     * Aftertouch is applied to each note individually
     *
     * @category Channel Message
     */
    NOTE_AFTER_TOUCH = 0x0a,
    /**
     * Aftertouch will affect all notes playing in that channel
     *
     * @category Channel Message
     */
    CHANNEL_AFTER_TOUCH = 0x0d,
    /**
     *
     * The Control Change message is generally used for modifying tones with a controller other than a keyboard key.
     *
     * There are some exceptions to the use of the Control Change message, such as the special Bank Select message and the RPN/NRPN
     *
     * @category Channel Message
     */
    CONTROL_CHANGE = 0x0b,
    /**
     * This message is used to transmit the program or "patch" number when changing sounds on a MIDI instrument.
     *
     * The message does not include any information about the sound parameters of the selected tone.
     *
     * As the various parameters that constitute a program are very different from one MIDI instrument to another it is much more efficient to address a sound simply by its internal number.
     *
     * @category Channel Message
     */
    PROGRAM_CHANGE = 0x0c,
    /**
     * Special purpose pitch change controller. Messages are always sent with 14 bit resolution (2 bytes)
     *
     * @category Channel Message
     */
    PITCH_BEND = 0x0e,
}

/**
 * A subset of the MIDI Status enumeration that expresses real time system messages.
 */
export type RealTimeStatus =
    | MidiStatus.TIMING_CLOCK
    | MidiStatus.START
    | MidiStatus.STOP
    | MidiStatus.CONTINUE
    | MidiStatus.SYSTEM_RESET
    | MidiStatus.ACTIVE_SENDING;
