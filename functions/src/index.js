const { app } = require("firebase-admin");
const admin = require("firebase-admin");
const { connectFirestore } = require("./firestore");

exports.addArtwork = (req, res) => {
  const db = connectFirestore();
  const newData = {
    artist_name: req.body.artist_name || undefined,
    artist_id: req.body.artist_id || undefined,
    price: Number(req.body.price),
    location: req.body.location,
    description: req.body.description,
    quantity: Number(req.body.quantity),
    art_name: req.body.art_name,
    image_url: req.body.image_url
  };
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
