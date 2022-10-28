
const fs = require('fs');
const { v4: uuidv4 } = require("uuid");

module.exports = class Recognizer {
    constructor(outFile, model){
        this.outFile = outFile;     
        this.model = model;   
        this.bufferStorage = [];     
    }

    async append(buffer){
        const megaBuffer = Buffer.concat(this.bufferStorage);

        if(megaBuffer.length > 250000){
            this.bufferStorage = [];
            const tmpFiles = `./tmp/${(new Date().getTime()).toString().substring(0, 9)}/${new Date().getTime()} - ${uuidv4()}`;
            //console.log(`./tmp/${(new Date().getTime()).toString().substring(0, 9)}`);
            await fs.mkdirSync(`./tmp/${(new Date().getTime()).toString().substring(0, 9)}`, { recursive: true });
            fs.writeFileSync(`${tmpFiles}.wav`, megaBuffer);
            fs.writeFileSync(`${tmpFiles}.index`, this.outFile);
        }
        else{
            this.bufferStorage.push(buffer);
        }
    }
}