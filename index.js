import express from "express";
import bodyParser from "body-parser";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const app = express()
const PORT = 3000
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static(__dirname + "/public/"))

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/views/main.html")
})

app.listen(PORT, () => console.log("http://localhost:" + PORT))