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
const path = require("path");
const fg = require("fast-glob");
const AudioContext = require('web-audio-api').AudioContext;
const WavEncoder = require('wav-encoder');
const context = new AudioContext();
const { spawn } = require("child_process");
const vosk = require("./vosk.js");
vosk.setLogLevel(0);

module.exports = class QueueAudio {
    constructor(model, skip = 0){
        this.model = model;
        this.skip = skip;
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
        const filesTotal = await fg("./tmp/*.index");
        const files = filesTotal.slice(this.skip, this.skip + 100);

        for(let file of files){         
            console.log(file);

            const outFile = fs.readFileSync(file, "utf8");
            const buffer = fs.readFileSync(file.replace(".index", ".wav"));

            try{ await this.process(buffer, outFile, file); }
            catch(e){ console.log(e); }
            
            this.rec.free();
            this.rec = null;

            try{ fs.unlinkSync(file, () => {});} catch(e){ }
            try{ fs.unlinkSync(file.replace(".index", ".wav"), () => {}); } catch(e){ }           
        }

        this.eventLooping();
    }

    process(buffer, outFile, filename){
        return new Promise(async (resolve, reject) => {
            try{
                const dateTime = path.basename(filename).split("-")[0];

                this.rec = new vosk.Recognizer({ model: this.model, sampleRate: 16000 });
                this.rec.setMaxAlternatives(1);
                this.rec.setWords(true);
                this.rec.setPartialWords(true);

                const ffmpeg_run = spawn('ffmpeg', [
                    '-loglevel', 'quiet', '-i', filename.replace(".index", ".wav"),
                    '-ar', "16000" , '-ac', '1',
                    '-f', 's16le', '-bufsize', "4046",
                    '-hwaccel', 'cuda' , '-'
                ]);

                if(!fs.existsSync(`./${outFile}`))
                    fs.writeFileSync(`./${outFile}`, `\n`);

                ffmpeg_run.stdout.on('data', async (data) => {
                    const endSpeech = this.rec.acceptWaveform(data);

                    if (endSpeech){
                        const result = this.rec.result();

                        if(result.alternatives[0].text !== "")
                            await fs.appendFileSync(`./${outFile}`, `[${dateTime.trim()}] - ${result.alternatives[0].text}\n`); 
                    }                       
                }).on("end", async () => {
                    const result = this.rec.finalResult(this.rec);
                    
                    if(result.alternatives[0].text !== "")
                        await fs.appendFileSync(`./${outFile}`, `[${dateTime.trim()}] - ${result.alternatives[0].text}\n`);
                    
                    resolve();
                }).on("error", async () => {
                    resolve();
                });
            }
            catch(err){
                reject(err);
            }
            
        });
    }
}