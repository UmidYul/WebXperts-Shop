import express from "express";
import bodyParser from "body-parser";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import bcrypt from "bcrypt"
import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'

const app = express()
const PORT = 3000
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const file = join(__dirname, 'db.json')
const adapter = new JSONFile(file)
const defaultData = { users: [] }
const db = new Low(adapter, defaultData)

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json({ type: 'application/json' }))
app.use(express.static(__dirname + "/public/"))

// GET REQUESTS

app.get("/logUp", (req, res) => {
    res.sendFile(__dirname + "/views/logUp.html")
})

app.get("/logIn", (req, res) => {
    res.sendFile(__dirname + "/views/logIn.html")
})
// POST REQUESTS

function AlertMessage(status, message) {
    console.log(message);
    // app.post("/AlertMessage", async (req, res) => {
    //     res.send(JSON.stringify({ status: status, message: message }))
    // })
}

app.post("/logUp_api", async (req, res) => {
    await db.read()
    const { users } = db.data
    const { name, email, password } = req.body
    try {
        if (users.find(user => user.email === email)) {
            AlertMessage(404, "Такой Пользователь Уже Существует!")
            console.log("Такой Пользователь Уже Существует!")
        } else {
            const salt = await bcrypt.genSalt()
            const HashedPassword = await bcrypt.hash(password, salt)
            users.push({ name: name, email: email, password: HashedPassword })
            db.write()
        }
    } catch (error) {
        console.log(error);
    }
})

app.post("/logIn_api", async (req, res) => {
    await db.read()
    const { users } = db.data
    const { email, password } = req.body
    const user = users.find(user => user.email === email)
    if (!user) {
        AlertMessage(404, "Такого Пользователя Не Существует!")
    } else {
        try {
            if (await bcrypt.compare(password, user.password)) {
                AlertMessage(200, "Вы Успешно Зарегистрировались!")
            } else {
                AlertMessage(404, "Вы Ввели Не Верный Пароль!")
            }
        } catch (error) {
            console.log(error);
        }
    }
})

app.listen(PORT, () => console.log("http://localhost:" + PORT))