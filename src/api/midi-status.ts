/**
 * MIDI status constants are used to define
 * which type of message is about to be read / written.
 */
export enum MidiStatus {
    /**
     * @category System Common message
     *
     * For device synchronization, MIDI Time Code uses two basic types of messages, described as Quarter Frame and Full.
     * There is also a third, optional message for encoding SMPTE user bits.
     * The Quarter Frame message communicates the Frame, Seconds, Minutes and Hours Count in an 8-message sequence.
     * There is also an MTC FULL FRAME message which is a MIDI System Exclusive Message.
     */
    MTC = 0xf1,
    /**
     * @category System Common message
     *
     * A sequencer's Song Position (SP) is the number of MIDI beats (1 beat = 6 MIDI clocks) that have elapsed from the start of the song
     * and is used to begin playback of a sequence from a position other than the beginning of the song.
     *
     * It is normally set to 0 when the START button is pressed to start sequence playback from the very beginning.
     *
     * It is incremented every sixth MIDI clock until STOP is pressed. If CONTINUE is pressed, it continues to increment from its current value.
     * The current Song Position can be communicated via the Song Position Pointer message and can be changed in a receiver by an incoming Song Position Pointer message.
     *
     * This message should only be recognized if the receiver is set to MIDI sync (external) mode.
     */
    SONG_POSITION = 0xf2,
    /**
     * @category System Common Message
     *
     * Specifies which song or sequence is to be played upon receipt of a Start message in sequencers and drum machines capable of holding multiple songs or sequences.
     * This message should be ignored if the receiver is not set to respond to incoming Real Time messages (MIDI Sync).
     */
    SONG_SELECT = 0xf3,
    /**
     * @category System Common Message
     *
     * Used with analog synthesizers to request that all oscillators be tuned.
     */
    TUNE_REQUEST = 0xf6,
    /**
     * @category System Common Message
     *
     * Used as a flag to indicate the end of a System Exclusive transmission.
     *
     * A System Exclusive message starts with F0H and can continue for any number of bytes.
     * The receiver will continue to wait for data until an EOX message (F7H) or any other non-Real Time status byte is received.
     * To avoid hanging a system, a transmitter should send a status byte immediately after the end of an Exclusive transmission
     * so the receiver can return to normal operation. Although any Status Byte (except Real-Time) will end an exclusive message,
     * an EOX should always be sent at the end of a System Exclusive message.
     *
     * Real time messages may be inserted between data bytes of an Exclusive message in order to maintain synchronization,
     * and can not be used to terminate an exclusive message.
     */
    EOX = 0xf7,
    /**
     * @category System Exclusive Message
     */
    SYSEX = 0xf0,
    /**
     * @category System Real Time Message
     */
    TIMING_CLOCK = 0xf8,
    /**
     * @category System Real Time Message
     */
    START = 0xf9,
    /**
     * @category System Real Time Message
     */
    CONTINUE = 0xfb,
    /**
     * @category System Real Time Message
     */
    STOP = 0xfc,
    /**
     * @category System Real Time Message
     */
    ACTIVE_SENDING = 0xfe,
    /**
     * @category System Real Time Message
     */
    SYSTEM_RESET = 0xff,
    /**
     * @category Channel Message
     */
    NOTE_OFF = 0x08,
    /**
     * @category Channel Message
     */
    NOTE_ON = 0x09,
    /**
     * @category Channel Message
     */
    NOTE_AFTER_TOUCH = 0x0a,
    /**
     * @category Channel Message
     */
    CHANNEL_AFTER_TOUCH = 0x0d,
    /**
     * @category Channel Message
     *
     * May be used to express other messages such
     * as Bank Select or Channel Mode
     */
    CONTROL_CHANGE = 0x0b,
    /**
     * @category Channel Message
     */
    PROGRAM_CHANGE = 0x0c,
    /**
     * @category Channel Message
     */
    PITCH_BEND = 0x0e,
}
