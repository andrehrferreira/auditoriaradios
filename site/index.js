let radios = null

function playRadio(src) {
    
    $('#player').html('')

    $('#player').html(`
        <audio controls id="audioPlayer">
            <source src="${src}" type="audio/mpeg" id="audioSource">
            Your browser does not support the audio tag.
        </audio>
    `);

    let player = document.getElementById('audioPlayer');
    let source = document.getElementById('audioSource');
    player.load();
    player.play();
}

async function selectOne(uf) {

    if (radios == null) {
        radios = await $.getJSON("/data/radios.json");
    }

    $('#mainAccordion').html('')
    let collapsed = ''
    for (let i = 0; i< radios[uf].length; i++) {

        let radio = radios[uf][i]

        console.log(radio)

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
                    
                    <div class="d-flex justify-content-between">
                        
                        <a href="${radio.site}">
                            <i class="fa-solid fa-link"></i>
                        </a>

                        <a href="javascript:playRadio('${radio.url}');">
                            <i class="fa-solid fa-music"></i>
                        </a>
                    </div>
                </div>
                </div>
            </div>
        `)
    }
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