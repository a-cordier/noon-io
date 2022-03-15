/**
 * MIDI status constants are used to define
 * which type of message is about to be read / written.
 */
 export enum MidiStatus {
    // SYSTEM MESSAGES
    SEQUENCE_NUMBER = 0x00,
    TEXT_EVENT = 0x01,
    COPYRIGHT_NOTICE = 0x02,
    SEQUENCE_NAME = 0x03,
    INSTRUMENT_NAME = 0x04,
    LYRIC = 0x05,
    MARKER = 0x06,
    CUE_POINT = 0x07,
    MIDI_CHANNEL_PREFIX = 0x20,
    END_OF_TRACK = 0x2f,
    SET_TEMPO = 0x51,
    SMPTE_OFFSET = 0x54,
    TIME_SIGNATURE = 0x58,
    KEY_SIGNATURE = 0x59,
    SPECIFIC = 0x7f,
    /**
     * System Exclusive Message
     */
    SYSEX = 0xf0,
    /**
     * Real Time System Message
     */
    TIMING_CLOCK = 0xf8,
    /**
     * Real Time System Message
     */
    START = 0xf9,
    /**
     * Real Time System Message
     */
    CONTINUE = 0xfb,
    /**
     * Real Time System Message
     */
    STOP = 0xfc,
    /**
     * Real Time System Message
     */
    ACTIVE_SENDING = 0xfe,
    /**
     * Real Time System Message
     */
    SYSTEM_RESET = 0xff,
    /**
     * Channel Message
     */
    NOTE_OFF = 0x08,
    /**
     * Channel Message
     */
    NOTE_ON = 0x09,
    /**
     * Channel Message
     */
    NOTE_AFTER_TOUCH = 0x0a,
    /**
     * Channel Message
     */
    CHANNEL_AFTER_TOUCH = 0x0d,
    /**
     * Channel Message
     * May be used to express other messages such
     * as Bank Select or Channel Mode
     */
    CONTROL_CHANGE = 0x0b,
    /**
     * Channel Message
     */
    PROGRAM_CHANGE = 0x0c,
    /**
     * Channel Message
     */
    PITCH_BEND = 0x0e,
}
