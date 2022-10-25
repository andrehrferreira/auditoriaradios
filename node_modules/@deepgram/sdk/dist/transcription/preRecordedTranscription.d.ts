import { PrerecordedTranscriptionOptions, PrerecordedTranscriptionResponse, TranscriptionSource } from "../types";
/**
 * Transcribes audio from a file or buffer
 * @param credentials Base64 encoded API key & secret
 * @param source Url or Buffer of file to transcribe
 * @param options Options to modify transcriptions
 */
export declare const preRecordedTranscription: (apiKey: string, apiUrl: string, source: TranscriptionSource, options?: PrerecordedTranscriptionOptions | undefined) => Promise<PrerecordedTranscriptionResponse>;
