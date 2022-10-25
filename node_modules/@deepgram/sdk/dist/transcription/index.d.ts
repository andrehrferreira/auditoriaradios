import { LiveTranscriptionOptions, PrerecordedTranscriptionOptions, PrerecordedTranscriptionResponse, TranscriptionSource } from "../types";
import { LiveTranscription } from "./liveTranscription";
export declare class Transcriber {
    private _credentials;
    private _apiUrl;
    constructor(_credentials: string, _apiUrl: string);
    /**
     * Transcribes prerecorded audio from a file or buffer
     * @param source Url or Buffer of file to transcribe
     * @param options Options to modify transcriptions
     */
    preRecorded(source: TranscriptionSource, options?: PrerecordedTranscriptionOptions): Promise<PrerecordedTranscriptionResponse>;
    /**
     * Opens a websocket to Deepgram's API for live transcriptions
     * @param options Options to modify transcriptions
     */
    live(options?: LiveTranscriptionOptions): LiveTranscription;
}
