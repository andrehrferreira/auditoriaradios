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
let temp = {}

/*
//
const municipiosOld = JSON.parse(fs.readFileSync('./site/data/municipios.json', 'utf8'))

//
for (let key in municipiosOld) {

  //
  temp[accentsTidy(municipiosOld[key].municipio)] = municipiosOld[key].estadoSingla
}

temp['cariri'] = 'CE'
temp['apicum'] = 'MA'

//
fs.writeFileSync('./municipios.json', JSON.stringify(temp, null, 2));

*/

//
const municipios = JSON.parse(fs.readFileSync('./municipios.json', 'utf8'))
const radios = JSON.parse(fs.readFileSync('./radios.json', 'utf8'))

//
temp = {}
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
  temp[uf].push(radios[key])
}

//
fs.writeFileSync('./site/data/radios.json', JSON.stringify(temp, null, 2))