let radios = null;

$(window).on( "load", async () => {
    let relatorio = await $.getJSON("/relatorio.json");
    $("#insercoesLula").html(relatorio.total.insercoesLula.toLocaleString());
    $("#insercoesBolsonaro").html(relatorio.total.insercoesBolsonaro.toLocaleString());
    $("#citacoesLula").html(relatorio.total.citacoesLula.toLocaleString());
    $("#citacoesBolsonaro").html(relatorio.total.citacoesBolsonaro.toLocaleString());
    $("#radiosCount").html(relatorio.radiosCount.toLocaleString());
    $("#lastUpdate").html(new Date(relatorio.lastUpdate).toLocaleDateString('pt-BR') + ' ' + new Date(relatorio.lastUpdate).toLocaleTimeString("pt-BR"));
    $("#queueFiles").html(relatorio.queueFiles.toLocaleString() + " (" + ((relatorio.queueFiles * 15) / 60).toFixed(0) + ` horas de audio` + ")");

    new Chart(
        document.getElementById('chartGeral'), {
            type: 'doughnut',
            data: {
                labels: [
                    'Lula',
                    'Bolsonaro'
                ],
                datasets: [{
                    label: 'Inserções',
                    data: [relatorio.total.insercoesLula, relatorio.total.insercoesBolsonaro],
                    backgroundColor: [
                        'rgb(255, 99, 132)',
                        'rgb(54, 162, 235)'
                    ],
                    hoverOffset: 4
                }]
            }
        }
    )

    console.log(relatorio);

    for (let radio in relatorio) {
        for(let item of relatorio[radio]){
            $('#relatorio').append(`<tr>
                <td>${item.radio}</td>
                <td>${item.local}</td>
                <td>${item.campanha}</td>
                <td>${new Date(item.dataHora).toLocaleDateString()} ${new Date(item.dataHora).toLocaleTimeString()}</td>
                <td>${item.frase}</td>
            </tr>`)
        }
    }
});

let toHandler = null
async function onSearchKeyUp(text) {

    if (radios == null) {
        radios = await $.getJSON("/data/radios.json");
    }
    
    if (toHandler!=null) {
        clearTimeout(toHandler)
    }

    if (text.length < 3) {
        $('#mainAccordion').html(`<div class="alert alert-info">Difite pelo menos 3 caracteres</div>`)
        return
    }

    $('#mainAccordion').html(`
        <div class="alert alert-success">Procurando...</div>
    `)

    toHandler = setTimeout(() => {

        $('#mainAccordion').html('')

        let i = 0
        text = accentsTidy(text).toLowerCase()

        Object.keys(radios).forEach((uf) => {
            Object.values(radios[uf]).forEach((radio) => {
                if (radio.cleanName.includes(text)) {
                    drawRadio(radio, i++)
                }
            });
        });

        if (i==0) {
            $('#mainAccordion').html(`<div class="alert alert-warning">Nenhuma rádio encontrada</div>`)
        }

    }, 1500);
}

function playRadio(src) {
    
    $('#player').html('')

    $('#player').html(`
        <audio controls id="audioPlayer">
            <source src="${src}" type="audio/mpeg" id="audioSource">
            Your browser does not support the audio tag.
        </audio>
    `);

    let player = document.getElementById('audioPlayer');
    player.load();
    player.play();
}

async function drawRadio(radio, i) {
    $('#mainAccordion').append(`
        <div class="accordion-item">
            <h2 class="accordion-header" id="panelsStayOpen-heading${i}">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapse${i}" aria-expanded="false" aria-controls="panelsStayOpen-collapse${i}">
                ${radio.name}
            </button>
            </h2>
            <div id="panelsStayOpen-collapse${i}" class="accordion-collapse collapse" aria-labelledby="panelsStayOpen-heading${i}">
            <div class="accordion-body">
                <p>Localização: ${radio.location}</p>

                <p class="text-center" style="width: 200px; height: 200px">
                    <canvas id="chart${i}"></canvas>
                </p>
                
                <div class="d-flex justify-content-between">
                    
                    <a href="${radio.site}" title="Website">
                        <i class="fa-solid fa-link"></i>
                    </a>

                    <a href="${radio.name} - ${radio.location} - 2022-9-28.txt" target="_blank" title="Transcrição">
                        <i class="fa-regular fa-file-lines"></i>
                    </a>

                    <a href="javascript:playRadio('${radio.url}');" title="Ouvir rádio">
                        <i class="fa-solid fa-music"></i>
                    </a>
                </div>
            </div>
            </div>
        </div>
    `)

    if (radio.insercoes.Lula + radio.insercoes.Bolsonaro > 0) {
        new Chart(
            document.getElementById('chart' + i), {
                type: 'doughnut',
                data: {
                    labels: [
                        'Lula',
                        'Bolsonaro'
                    ],
                    datasets: [{
                        label: 'Inserções',
                        data: [radio.insercoes.Lula, radio.insercoes.Bolsonaro],
                        backgroundColor: [
                            'rgb(255, 99, 132)',
                            'rgb(54, 162, 235)'
                        ],
                        hoverOffset: 4
                    }]
                }
            }
        )
    }
}

async function selectOne(uf) {

    if (radios == null) {
        radios = await $.getJSON("/data/radios.json");
    }

    $('#mainAccordion').html('')
    for (let i = 0; i< radios[uf].length; i++) {

        let radio = radios[uf][i]
        
        drawRadio(radio, i)
    }
}

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

$(".map-container").mapael({
    map: {
        name: "brazil",
        zoom: {
            enabled: false
        },
        defaultArea: {
            attrs: {
                fill: "#5ba4ff",
                stroke: "#99c7ff",
                cursor: "pointer"
            },
            attrsHover: {
                animDuration: 0
            },
            text: {
                attrs: {
                    cursor: "pointer",
                    "font-size": 10,
                    fill: "#000"
                },
                attrsHover: {
                    animDuration: 0
                }
            },
            eventHandlers: {
                click: function (e, id, mapElem, textElem) {

                    selectOne(id.toUpperCase())

                    var newData = {
                        'areas': {}
                    };
                    if (mapElem.originalAttrs.fill == "#5ba4ff") {
                        newData.areas[id] = {
                            attrs: {
                                fill: "#0088db"
                            }
                        };
                    } else {
                        newData.areas[id] = {
                            attrs: {
                                fill: "#5ba4ff"
                            }
                        };
                    }
                    $(".container").trigger('update', [{mapOptions: newData}]);
                }
            }
        }
    }
});