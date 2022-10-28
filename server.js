const express = require("express");
const app = express();
const fs = require('fs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('site'));
app.use(express.static('transcricoes'));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/site/index.html");
});

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