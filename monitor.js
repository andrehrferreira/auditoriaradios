/**
 * @see https://console.deepgram.com/project/cf17b559-9d7a-492b-94c7-46ddeea8f452/mission/realtime-via-sdk
 */
const fetch = require('cross-fetch');
const { Deepgram } = require('@deepgram/sdk');
const fs = require('fs');
const radios = JSON.parse(fs.readFileSync('radios.json', 'utf8'));

class MonitorarRadio{
    constructor(radio){
        this.radio = radio;
        this.stream = fs.createWriteStream(`transcricoes/${this.radio.name}.txt`, { flags: 'a' })
        this.deepgram = new Deepgram('912c645bc5211d30e6cc5817f090bd0068db5347')
        this.deepgramLive = this.deepgram.transcription.live({ 
            punctuate: true, 
            language: 'pt-BR',
            model: 'general',
            tier: 'base'
        });

        this.deepgramLive.addListener('transcriptReceived', (message) => {
            try{
                const data = JSON.parse(message)
                const transcript = data.channel.alternatives[0].transcript;

                if(transcript) 
                    this.stream.write('['+ new Date().getTime() +'] - ' + transcript + '\n');
            }
            catch(err){}
        })
    }

    start(){
        try{
            fetch(this.radio.url).then(r => r.body).then(res => {
                res.on("readable", () => {
                    const data = res.read()
        
                    if(this.deepgramLive.getReadyState() === 1)
                        this.deepgramLive.send(data);
                })
            });
        }
        catch(err){}        
    }
}

(() => {
    for(let radio of radios) {
        const monitor = new MonitorarRadio(radio)
        monitor.start()
    }
})();