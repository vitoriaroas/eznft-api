const { app } = require("firebase-admin");
const admin = require("firebase-admin");
const { connectFirestore } = require("./firestore");

exports.addArtwork = (req, res) => {
  if(!req.body || !req.body.price || !req.body.location || !req.body.description
    || !req.body.quantity || !req.body.art_name || !req.body.image_url) {
      res.status(401).send('Invalid request')
    }
  const db = connectFirestore();
  let newData = {
    price: Number(req.body.price),
    location: req.body.location,
    description: req.body.description,
    quantity: Number(req.body.quantity),
    art_name: req.body.art_name,
    image_url: req.body.image_url
  };
  if(req.body.artist_name) {
    newData.artist_name = req.body.artist_name
  }
  if(req.body.artist_id) {
    newData.artist_id = req.body.artist_id
  }
  db.collection("artwork")
    .add(newData)
    .then(() => this.getArtwork(req, res))
    .catch((error) => res.send("Error", +error.message));
};

exports.getArtwork = (req, res) => {
  const db = connectFirestore();
  const { artId } = req.params;
  db.collection("artwork")
    .doc(artId)
    .get()
    .then((doc) => {
      let artist = doc.data();
      artist.id = doc.id;
      res.send(artist);
    });
};

exports.getAllArtwork = (req, res) => {
  const db = connectFirestore();
  db.collection("artwork")
    .get()
    .then(collection => {
      const artists = collection.docs.map(doc => {
        let artist = doc.data();
        artist.id = doc.id;
        return artist;
      })
      res.send(artists);
    });
};

exports.newUser = (req, res) => {
  const db = connectFirestore();
  db.collection("users")
    .doc(req.body.uid)
    .set(req.body)
    .then(() => res.send(req.body))
    .catch((error) => res.send("Error", +error.message));
};
