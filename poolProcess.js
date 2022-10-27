const vosk = require("./vosk.js");
const QueueAudio = require("./queueAudio.js");

process.on('uncaughtException', (err) => {});

(() => {
    const model = new vosk.Model("./model");
    new QueueAudio(model).start();
})();