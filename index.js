const express = require("express")
const socket = require("socket.io")
const http = require("http")
const ejs = require("ejs")
const cors = require("cors")
const { static } = require("express")

const POTR = 4000

const users = {}

const app = express()
const server = http.createServer(app)
const IO = socket(server)

app.engine("html", ejs.renderFile)
app.set("view engine", "html")

app.use(express.static("static"))
app.use(cors())

IO.on("connection", (client) => {

  client.on("login", username => {

    users[username] = client.id

    client.broadcast.emit("new_login", username)
    console.log(users);
  })

  client.on("send_massage", data => {

    console.log("send massage", data, users[data.receiver])

    client.to(users[data.receiver]).emit("receive_massage", {
      from: data.from,
      massage: data.massage,
    })
  })

  // client.broadcast.emit("massage", { massage: client.id, })

  // console.log("Kirildi")
  // client.on("disconnect", () => console.log("chiqib ketdi"))
})

app.get("/", (req, res) => {

  res.render("index")
})

server.listen(POTR, () => console.log(POTR))