# Auditoria de propagandas eleitorais nas radios 

## Agradecimento

Inicialmente gostaria de agradece ao grupo FalaBrasil da UFPA pois seu modelo de ASR: Reconhecimento Automático de Fala, foi de extrema importância para a viabilidade do projeto portanto deixo o 
link para o site oficinal e o nomes dos pesquisadores responsáveis pelo projeto.

```
https://ufpafalabrasil.gitlab.io/
```

```
Nelson Neto
Cassio Batista
Erick Campos
Larissa Dias
Daniel Santana
João Canavarro
Aldebaro Barreto da Rocha Klautau Jr.
Ana Carolina Quintão Siravenha
Carlos Patrick Alves da Silva
Chadia Hosn
Denise Costa Alves
Ênio dos Santos Silva
Hugo Santos
Igor Costa do Couto
Jefferson Magalhães de Morais
Joarley Wanzeler de Moraes
Luiz Albero Novaes
Pedro dos Santos Batista
Rafael Oliveira Santana
Renan Moura Ferreira
Renan Fonseca Cunha
```

## Instalação de dependências 

Os scripts utilizam a linguagem Javascript, utilizando Node.JS para interpretação, e analise dos dados,  execute os comandos abaixo para instalação das dependências do projeto  

```js
$ sudo apt install ffmpeg
$ pip3 install vosk
$ npm install
```

## Arquivo do modelo

Para realizar analise dos áudios será necessário download do modelo ASR do FalaBrasil disponível no link abaixo e descompactar no diretório ./model/

```
https://alphacephei.com/vosk/models/vosk-model-pt-fb-v0.1.1-20220516_2113.zip
```

## Monitorar

Para iniciar o script e monitorar as rádios basta executar o seguinte comando:

```js
node monitor.js
```

## Processamento dos arquivos de audio

Para iniciar o processamento dos áudios capturados e necessário iniciar o scripta poolProcess.js

```js
node poolProcess.js
```

## Fontes

https://ufpafalabrasil.gitlab.io/
https://github.com/alphacep/vosk-api
https://github.com/falabrasil/speech-datasets
https://alphacephei.com/vosk/integrations
https://alphacephei.com/vosk/models
https://github.com/Jam3/audiobuffer-to-wav
https://tunein.com/
https://deepgram.com/
