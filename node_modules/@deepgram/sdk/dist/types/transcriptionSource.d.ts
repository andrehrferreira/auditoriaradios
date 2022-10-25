/// <reference types="node" />
import { Readable } from "stream";
export declare type TranscriptionSource = UrlSource | BufferSource | ReadStreamSource;
export declare type ReadStreamSource = {
    stream: Readable;
    mimetype: string;
};
export declare type UrlSource = {
    url: string;
};
export declare type BufferSource = {
    buffer: Buffer;
    mimetype: string;
};
