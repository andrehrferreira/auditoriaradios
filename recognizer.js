
const fs = require('fs');
const { v4: uuidv4 } = require("uuid");

module.exports = class Recognizer {
    constructor(outFile, model){
        this.outFile = outFile;     
        this.model = model;   
        this.bufferStorage = [];     
    }

    append(buffer){
        if(this.bufferStorage.length > 100){
            const megaBuffer = Buffer.concat(this.bufferStorage);
            this.bufferStorage = [];
            const tmpFiles = `./tmp/${new Date().getTime()} - ${uuidv4()}`;
            fs.writeFileSync(`${tmpFiles}.wav`, megaBuffer);
            fs.writeFileSync(`${tmpFiles}.index`, this.outFile);
        }
        else{
            this.bufferStorage.push(buffer);
        }
    }
}