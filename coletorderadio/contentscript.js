var s = document.createElement('script');
s.innerHTML = `
    function coletar(){
        try{
            if(document.querySelector("audio").src){
                let payload = {
                    name: document.querySelector("div.pageTitles-module__pageTitle___yApR2>h1").innerHTML,
                    location: document.querySelector("div.more-information-module__moreInfoRows___wW4HX>div:nth-child(1)>p:nth-child(2)").innerHTML,
                    url: document.querySelector("audio").src,
                    site: document.querySelector("div.more-information-module__moreInfoRows___wW4HX>div:nth-child(8)>a>p")?.innerHTML || document.querySelector("p.more-information-module__text___BV7aN")?.innerHTML
                };

                var formBody = [];
                for (var property in payload) {
                    var encodedKey = encodeURIComponent(property);
                    var encodedValue = encodeURIComponent(payload[property]);
                    formBody.push(encodedKey + "=" + encodedValue);
                }
                formBody = formBody.join("&");

                fetch('http://localhost:5566', {
                    "method": "POST",
                    "mode": "cors",
                    "credentials": "omit",
                    "body": formBody,
                    "referrerPolicy": "strict-origin-when-cross-origin",
                    "mode": "no-cors",
                    headers: {'Content-Type':'application/x-www-form-urlencoded'},
                })
                .then(response => response.json()) 
                .then(json => console.log(json))
                .catch(err => console.log(err));
            }
        }
        catch(e){
            console.log(e);
        }
    }
    
    let persistent = setInterval(() => {
        if(document.querySelector("audio").src && document.querySelector("audio").src !== "https://cdn-web.tunein.com/assets/media/blank.mp3"){
            clearInterval(persistent);
            coletar();
            console.log('OK')
        }        
    }, 1000);`;

(document.head || document.documentElement).appendChild(s);