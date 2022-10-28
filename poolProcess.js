const vosk = require("./vosk.js");
const QueueAudio = require("./queueAudio.js");
const argv = require('argv');

const args = argv.option({
    name: 'skip',
    short: 's',
    type: 'int',
    description: 'Skip this many audio files',
    example: "'node poolProcess.js --skip=10' or 'node poolProcess.js -s 10'"
}).run();

process.on('uncaughtException', (err) => {});

(() => {
    const model = new vosk.Model("./model");
    new QueueAudio(model, args.options.skip).start();
})();