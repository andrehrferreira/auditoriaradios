const fs = require('fs');
const Lame = require("node-lame").Lame;

module.exports = class Gravador{
    constructor(outFile){
        this.outFile = outFile;
    }

    async append(buffer){ 
        try{
            fs.appendFile(this.outFile, Buffer.from(buffer), () => {});
        }
        catch(err){}   
    }
}