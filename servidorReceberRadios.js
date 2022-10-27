const Express = require("express");
const app = Express();
const fs = require('fs');

app.use(Express.json())
app.use(Express.urlencoded({ extended: true }))

app.post("/", (req, res) => {
    const radios = JSON.parse(fs.readFileSync("./radios.json"));
    console.log(req.body);
    radios[`${req.body.name} - ${req.body.location.replace(", Brasil", "")}`] = req.body;
    radios[`${req.body.name} - ${req.body.location.replace(", Brasil", "")}`].location = req.body.location.replace(", Brasil", "");

    if(req.body.url !== "https://cdn-web.tunein.com/assets/media/blank.mp3")
        fs.writeFileSync("./radios.json", JSON.stringify(radios, null, 4));        

    res.send("OK");
});

app.listen(5566);