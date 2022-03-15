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
     * System Common message
     *
     * A sequencer's Song Position (SP) is the number of MIDI beats (1 beat = 6 MIDI clocks)
     * that have elapsed from the start of the song and is used to begin playback of a sequence
     * from a position other than the beginning of the song.
     */
    SONG_POSITION = 0xf2,
    /**
     * System Common Message
     *
     * Specifies which song or sequence is to be played upon receipt of a Start message in sequencers and drum machines capable of holding multiple songs or sequences.
     * This message should be ignored if the receiver is not set to respond to incoming Real Time messages (MIDI Sync).
     */
    SONG_SELECT = 0xf3,
    /**
     * System Common Message
     *
     * Used with analog synthesizers to request that all oscillators be tuned.

     */
    TUNE_REQUEST = 0xf6,
    /**
     * System Common Message
     *
     * End of Exclusive
     */
    EOX = 0xf7,
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
     *
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
