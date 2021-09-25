const functions = require("firebase-functions")
const express = require("express")

const app = express()

const { addArtwork, getArtwork, newUser} = require("./src/index")

app.get("/artwork/:artId", getArtwork);
app.post('/artwork', addArtwork)
app.post("/users", newUser);
// app.post("/buyers/:userId", updateUser);

exports.app = functions.https.onRequest(app)
