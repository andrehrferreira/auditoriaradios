const vosk = require("./vosk.js");

const fs = require("fs");
const { spawn } = require("child_process");

SAMPLE_RATE = 16000
BUFFER_SIZE = 2000

if (process.argv.length > 2)
    FILE_NAME = process.argv[2]

vosk.setLogLevel(0);
const model = new vosk.Model("./model");
const rec = new vosk.Recognizer({
    model: model, 
    sampleRate: SAMPLE_RATE
});

rec.setMaxAlternatives(1);
rec.setWords(true);
rec.setPartialWords(true);

const ffmpeg_run = spawn('ffmpeg', ['-loglevel', 'quiet', '-i', "O Silmarillion, Quenta, Parte 1.mp3",
                         '-ar', String(SAMPLE_RATE) , '-ac', '1',
                         '-f', 's16le', '-bufsize', String(BUFFER_SIZE) , '-']);

ffmpeg_run.stdout.on('data', async (data) => {
    const end_of_speech = rec.acceptWaveform(data);

    if (end_of_speech)
        fs.appendFileSync("O Silmarillion, Quenta, Parte 1.txt", `${rec.result().alternatives[0].text}\n`)
});