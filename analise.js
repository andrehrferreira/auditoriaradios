const fs = require("fs");
const fg = require("fast-glob");
const radios = JSON.parse(fs.readFileSync('radios.json', 'utf8'));
const frasesDeCampanha = JSON.parse(fs.readFileSync('frasesDeCampanhas.json', 'utf8'));

let insercoes = {};
let summaryInsercoes = { lula: 0, bolsonaro: 0 };
let citacoes = { lula: 0, bolsonaro: 0 };
let radiosCount = 0;

for(let radio in radios)    
    radiosCount++;  

if(fs.existsSync("relatorio.csv")) 
    fs.unlinkSync("relatorio.csv");

fs.appendFileSync("relatorio.csv", "RADIO,LOCALIDADE,DATAEHORA,CAMPANHA,FRASE\n");

(async () => {
    const queue = await fg("./tmp/**/*.index");
    const files = await fg("./transcricoes/*.txt");
    let preventDuplicate = {};

    for(let file of files){
        const lines = fs.readFileSync(file, "utf8").split("\n");
        const [Radio, Local] = file.replace("./transcricoes/", "").replace(".txt", "").split(" - ");

        for(let line of lines){
            if(line.includes("lula") || line.includes("Lula"))
                citacoes.lula++;

            for(let fraseCampanhaLula of frasesDeCampanha.lula){
                if(line.includes(fraseCampanhaLula)){
                    const dataHora = [ .../\[(.*?)\]/.exec(line) ];

                    if(!insercoes[Radio])
                        insercoes[Radio] = [];

                    if(Local){
                        const idreg = `Lula-${new Date(parseInt(dataHora[1])).toString()}`;

                        if(!preventDuplicate[idreg]){
                            preventDuplicate[idreg] = true;
                            insercoes[Radio].push({
                                campanha: "Lula",
                                dataHora: new Date(parseInt(dataHora[1])).toString(),
                                frase: fraseCampanhaLula,
                                radio: Radio,
                                local: Local
                            });

                            fs.appendFileSync("relatorio.csv", `${Radio},${Local},${new Date(parseInt(dataHora[1])).toString()},LULA,${fraseCampanhaLula}\n`);    
                        }
                        
                        summaryInsercoes.lula++;
                    }
                }
            }

            if(line.includes("bolsonaro") || line.includes("Bolsonaro"))
                citacoes.bolsonaro++;

            for(let fraseCampanhaBolsonaro of frasesDeCampanha.bolsonaro){
                if(line.includes(fraseCampanhaBolsonaro)){
                    const dataHora = [ .../\[(.*?)\]/.exec(line) ];

                    if(!insercoes[Radio])
                        insercoes[Radio] = [];

                    if(Local){
                        const idreg = `Lula-${new Date(parseInt(dataHora[1])).toString()}`;

                        if(!preventDuplicate[idreg]){
                            preventDuplicate[idreg] = true;
                            insercoes[Radio].push({
                                campanha: "Bolsonaro",
                                dataHora: new Date(parseInt(dataHora[1])).toString(),
                                frase: fraseCampanhaBolsonaro,
                                radio: Radio,
                                local: Local
                            });

                            fs.appendFileSync("relatorio.csv", `${Radio},${Local},${new Date(parseInt(dataHora[1])).toString()},BOLSONARO,${fraseCampanhaBolsonaro}\n`);
                        }

                        summaryInsercoes.bolsonaro++;
                    }
                }
            }
        }
    }

    insercoes.total = {
        insercoesLula: summaryInsercoes.lula,
        insercoesBolsonaro: summaryInsercoes.bolsonaro,
        citacoesLula: citacoes.lula,
        citacoesBolsonaro: citacoes.bolsonaro
    }

    insercoes.lastUpdate = new Date().getTime();
    insercoes.radiosCount = radiosCount;
    insercoes.queueFiles = queue.length;

    fs.writeFileSync("relatorio.json", JSON.stringify(insercoes, null, 2));
    fs.copyFileSync("relatorio.csv", "./site/relatorio.csv");
    fs.copyFileSync("relatorio.json", "./site/relatorio.json");
})();