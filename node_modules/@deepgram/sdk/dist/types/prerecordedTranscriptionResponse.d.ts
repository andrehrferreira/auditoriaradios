import { Metadata } from "./metadata";
import { Channel } from "./channel";
import { Utterance } from "./utterance";
export declare class PrerecordedTranscriptionResponse {
    request_id?: string;
    metadata?: Metadata;
    results?: {
        channels: Array<Channel>;
        utterances?: Array<Utterance>;
    };
    /**
     * Converts the transcription to the WebVTT format
     * @remarks In order to translate the transcription to WebVTT, the utterances
     * feature must be used.
     * @returns A string with the transcription in the WebVTT format
     */
    toWebVTT(): string;
    /**
     * Converts the transcription to the SRT format
     * @remarks In order to translate the transcription to SRT, the utterances
     * feature must be used.
     * @returns A string with the transcription in the SRT format
     */
    toSRT(): string;
}
