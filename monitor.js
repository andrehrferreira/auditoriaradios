/**
 * @see https://console.deepgram.com/project/cf17b559-9d7a-492b-94c7-46ddeea8f452/mission/realtime-via-sdk
 */

const fs = require('fs');
const fetch = require('cross-fetch');
const Gravador = require("./gravador.js");
const Recognizer = require("./recognizer.js");
const radios = JSON.parse(fs.readFileSync('radios.json', 'utf8'));
const AudioContext = require('web-audio-api').AudioContext;
const context = new AudioContext();
const { Howl, Howler } = require('howler');
const vosk = require("./vosk.js");

process.on('uncaughtException', function(err) {
    //console.log(err)
});

class MonitorarRadio{
    constructor(radio, model){
        const date = new Date();
        this.radio = radio;
        this.model = model;
        this.gravador = new Gravador(`gravacoes/${this.radio.name} - ${date.getFullYear()}-${date.getMonth()}-${date.getDate()}.mp3`);
        this.recognizer = new Recognizer(`transcricoes/${this.radio.name} - ${date.getFullYear()}-${date.getMonth()}-${date.getDate()}.txt`, this.model);
    }

    start(){
        try{     
            if(!this.conn == null){
                try{ this.conn.destroy(); }
                catch(e){}
        
                this.conn = null;
            }
                        
            this.conn = fetch(this.radio.url).then(r => r.body).then(res => {
                console.log(`Connectado ${this.radio.name}...`);

                res.on("readable", () => {
                    const data = res.read();
                    this.gravador.append(data);
                    this.recognizer.append(data);
                })
            }).catch(err => {
                console.log(`Erro ao tentar conectar ${this.radio.name}...`);
            });

            setTimeout(() => { //Restart radio 1h
                this.start();
            }, 3600000)
        }
        catch(err){
            console.log(err);
        }        
    }
}

(() => {
    const model = new vosk.Model("./model");
    let radiosMonitoradas = [];

    for(let radioKey in radios) {
        radios[radioKey].name = radioKey;

        radiosMonitoradas.push(new Promise(() => {
            (new MonitorarRadio(radios[radioKey], model)).start();
        }));
    }

    Promise.all(radiosMonitoradas);

    //new QueueAudio(model).start();
})();