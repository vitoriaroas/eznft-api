const functions = require("firebase-functions");
const express = require("express");

const app = express();


app.get("/artwork/:id", getArtwork);
app.post("/artwork", addArtwork);
app.post("/users", newUser);
app.post("/buyers/:userId", updateUser);

exports.app = functions.https.onRequest(app);
