'use strict';

//
const fs = require('fs');

//
function accentsTidy (s) {
  var r=s.toLowerCase();
  r = r.replace(new RegExp(/\s/g),"");
  r = r.replace(new RegExp(/[àáâãäå]/g),"a");
  r = r.replace(new RegExp(/æ/g),"ae");
  r = r.replace(new RegExp(/ç/g),"c");
  r = r.replace(new RegExp(/[èéêë]/g),"e");
  r = r.replace(new RegExp(/[ìíîï]/g),"i");
  r = r.replace(new RegExp(/ñ/g),"n");                
  r = r.replace(new RegExp(/[òóôõö]/g),"o");
  r = r.replace(new RegExp(/œ/g),"oe");
  r = r.replace(new RegExp(/[ùúûü]/g),"u");
  r = r.replace(new RegExp(/[ýÿ]/g),"y");
  r = r.replace(new RegExp(/\W/g),"");
  return r;
}

//
function generateMunicipios() {
  let temp = {}

  const municipiosOld = JSON.parse(fs.readFileSync('./site/data/municipios.json', 'utf8'))

  //
  for (let key in municipiosOld) {

    //
    temp[accentsTidy(municipiosOld[key].municipio)] = municipiosOld[key].estadoSingla
  }

  //
  temp['cariri'] = 'CE'
  temp['apicum'] = 'MA'

  //
  fs.writeFileSync('./municipios.json', JSON.stringify(temp, null, 2));
}

//
function processaInsercoes(){
  let insercoes = JSON.parse(fs.readFileSync('./relatorio.json', 'utf8'))

  //
  let temp = {}
  for (let key in insercoes) {

    //
    let radioName = accentsTidy( key )

    //
    if (!Array.isArray(temp[radioName])) {
      temp[radioName] = {}
    }

    //
    for (let i=0; i<insercoes[key].length; i++) {

      if (temp[radioName][insercoes[key][i].campanha]==null) {
        temp[radioName][insercoes[key][i].campanha]=0
      }

      temp[radioName][insercoes[key][i].campanha]++
    }

  }

  fs.writeFileSync('./site/data/relatorio.json', JSON.stringify(temp, null, 2))

  return temp
}

//
function processaRadios(insercoes=null) {
  const municipios = JSON.parse(fs.readFileSync('./municipios.json', 'utf8'))
  const radios = JSON.parse(fs.readFileSync('./radios.json', 'utf8'))

  //
  let temp = {}
  for (let key in radios) {

    //
    let municipio = accentsTidy( key.substring(key.lastIndexOf('-') + 1) )

    //
    let uf = municipios[municipio]

    //
    if (uf == null) {
      console.log(uf)
      new Error('precisa de um municipio')
    }

    //
    if (!Array.isArray(temp[uf])) {
      temp[uf] = []
    }

    //
    let radio = radios[key]

    //
    if (insercoes!=null) {
      radios[key].insercoes = insercoes[accentsTidy(radios[key].name)]??{
        Bolsonaro: 0,
        Lula: 0
      }
    }

    //
    temp[uf].push(radios[key])
  }

  //
  fs.writeFileSync('./site/data/radios.json', JSON.stringify(temp, null, 2))
}

/**
 * 
 * 
 * 
 * 
 * 
 */

// generateMunicipios()

let insercoes = processaInsercoes()

processaRadios(insercoes)
//
// 