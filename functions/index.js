const functions = require("firebase-functions")
const express = require("express")
const cors = require("cors")
const app = express()

const { addArtwork, getArtwork, getAllArtwork, newUser, buyArtwork } = require("./src/index")

app.use(cors())
app.use(express.json())

app.get("/artwork/:artId", getArtwork)
app.get("/artwork", getAllArtwork)
app.post("/artwork", addArtwork)
app.post("/users", newUser)
app.post("/buy", buyArtwork)

exports.app = functions.https.onRequest(app)
