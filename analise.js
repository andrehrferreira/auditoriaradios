import * as fs from "fs";
import fg from "fast-glob";
const radios = JSON.parse(fs.readFileSync('radios.json', 'utf8'));
const frasesDeCampanha = JSON.parse(fs.readFileSync('frasesDeCampanhas.json', 'utf8'));

let insercoes = {};
let summaryInsercoes = { lula: 0, bolsonaro: 0 };
let citacoes = { lula: 0, bolsonaro: 0 };

fs.appendFileSync("insercoes.csv", "RADIO,LOCALIDADE,DATAEHORA,CAMPANHA,FRASE\n");

(async () => {
    const files = await fg("./transcricoes/*.txt");

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

                    insercoes[Radio].push({
                        campanha: "Lula",
                        dataHora: new Date(parseInt(dataHora[1])).toString(),
                        frase: fraseCampanhaLula,
                        radio: Radio,
                        local: Local
                    });

                    fs.appendFileSync("insercoes.csv", `${Radio},${Local},${new Date(parseInt(dataHora[1])).toString()},LULA,${fraseCampanhaLula}\n`);

                    summaryInsercoes.lula++;
                }
            }

            if(line.includes("bolsonaro") || line.includes("Bolsonaro"))
                citacoes.bolsonaro++;

            for(let fraseCampanhaBolsonaro of frasesDeCampanha.bolsonaro){
                if(line.includes(fraseCampanhaBolsonaro)){
                    const dataHora = [ .../\[(.*?)\]/.exec(line) ];

                    if(!insercoes[Radio])
                        insercoes[Radio] = [];

                    insercoes[Radio].push({
                        campanha: "Bolsonaro",
                        dataHora: new Date(parseInt(dataHora[1])).toString(),
                        frase: fraseCampanhaBolsonaro,
                        radio: Radio,
                        local: Local
                    });

                    fs.appendFileSync("insercoes.csv", `${Radio},${Local},${new Date(parseInt(dataHora[1])).toString()},BOLSONARO,${fraseCampanhaBolsonaro}\n`);

                    summaryInsercoes.bolsonaro++;
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

    fs.writeFileSync("insercoes.json", JSON.stringify(insercoes, null, 2));
})();