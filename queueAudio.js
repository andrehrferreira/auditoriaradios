/**
 * @see https://github.com/alphacep/vosk-api/blob/master/nodejs/index.js
 * @see https://alphacephei.com/vosk/integrations
 * @see https://github.com/Nuitka/Nuitka/issues/1431
 * @see https://groups.google.com/g/jna-users/c/qvprhP34Nrk
 * @see https://github.com/alphacep/vosk-api/blob/f57b926f667131437e2bde73fe5f27aeeffd2d6a/java/lib/src/main/java/org/vosk/LibVosk.java#L25
 * @see https://github.com/alphacep/vosk-api/blob/master/nodejs/index.js
 * @see https://github.com/julio-0/yt-1-speech-to-text/blob/main/src/transcription.js
 * @see https://gitlab.com/fb-resources/kaldi-br
 * @see https://github.com/falabrasil/speech-datasets
 * @see https://github.com/alphacep/vosk-api/blob/master/nodejs/demo/test_simple.js
 * @see https://github.com/Jam3/audiobuffer-to-wav/blob/master/index.js
 * @see https://github.com/alphacep/vosk-api/issues/497
 * @see https://github.com/alphacep/vosk-api/blob/master/nodejs/demo/test_ffmpeg.js
 */

const fs = require('fs');
const fg = require("fast-glob");
const AudioContext = require('web-audio-api').AudioContext;
const WavEncoder = require('wav-encoder');
const context = new AudioContext();
const vosk = require("./vosk.js");
vosk.setLogLevel(0);

module.exports = class QueueAudio {
    constructor(model){
        this.model = model;
        this.ignoreResults = ["<UNK>", "art"];
    }

    start(){
        this.eventLooping();
    }

    chunking(data, length) {
        let result = [];

        for (let i = 0; i < data.length; i += length) 
            result.push(data.subarray(i, i + length));
        
        return result;
    }

    async eventLooping(){
        const files = await fg("./tmp/*.index");

        for(let file of files){
            console.log(file);
            const outFile = fs.readFileSync(file, "utf8");
            const buffer = fs.readFileSync(file.replace(".index", ".wav"));

            try{ await this.process(buffer, outFile); }
            catch(e){}
            
            this.rec.free();
            this.rec = null;
            fs.unlinkSync(file, () => {});
            fs.unlinkSync(file.replace(".index", ".wav"), () => {});
        }

        this.eventLooping();
    }

    process(buffer, outFile){
        return new Promise((resolve, reject) => {
            let timeout = setTimeout(() => { resolve() }, 5000);

            try{
                this.rec = new vosk.Recognizer({ model: this.model, sampleRate: 16000 });
                this.rec.setMaxAlternatives(1);
                this.rec.setWords(true);
                this.rec.setPartialWords(true);

                context.decodeAudioData(buffer, async (audioBuffer) => {
                    const channels = audioBuffer.numberOfChannels;
        
                    if(channels > 0){
                        const nowBuffering = audioBuffer.getChannelData(0);
                        //console.log(`Size: `, nowBuffering.length);

                        if(nowBuffering.length < 400000){
                            WavEncoder.encode({
                                sampleRate: audioBuffer.sampleRate,
                                channelData: [nowBuffering]
                            }).then(async (data) => {  
                                const buffer = Buffer.from(data);    
                                
                                if(buffer.length < 10000000){
                                    const chunks = this.chunking(buffer, 4096);
            
                                    for await (const data of chunks) 
                                        this.rec.acceptWaveform(data);
                                    
                                    const result = this.rec.finalResult(this.rec);
                
                                    if (result.alternatives.length > 0){                                        
                                        //console.log(result.alternatives[0].text);

                                        if(!this.ignoreResults.includes(result.alternatives[0].text)){
                                            //console.log(fs.existsSync(`./${outFile}`), outFile);

                                            if(!fs.existsSync(`./${outFile}`))
                                                await fs.writeFileSync(`./${outFile}`, `[${new Date().getTime()}] - ${result.alternatives[0].text}\n`);
                                            else
                                                await fs.appendFileSync(`./${outFile}`, `[${new Date().getTime()}] - ${result.alternatives[0].text}\n`);
                                        }
                                    }
            
                                    clearTimeout(timeout);
                                    resolve();
                                }
                                else{
                                    clearTimeout(timeout);
                                    resolve();
                                }
                            }).catch((err) => {
                                clearTimeout(timeout);
                                resolve();
                            });
                        }
                        else{
                            clearTimeout(timeout);
                            resolve();
                        }
                    }
                    else{
                        clearTimeout(timeout);
                        resolve();
                    }
                }, (err) => {
                    clearTimeout(timeout);
                    resolve();
                });
            }
            catch(err){
                clearTimeout(timeout);
                resolve();
            }
        });
    }
}