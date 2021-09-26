const { app } = require("firebase-admin");
const admin = require("firebase-admin");
const { connectFirestore } = require("./firestore");

exports.addArtwork = (req, res) => {
  const { price, location, description, quantity, art_name, image_url, artist_name, artist_id } = JSON.parse(req.body)
  if(!price || !location || !description || !quantity || !art_name || !image_url) {
      res.status(401).send('Invalid request')
  }
  const db = connectFirestore();
  let newData = {
    price: Number(price),
    location: location,
    description: description,
    quantity: Number(quantity),
    art_name: art_name,
    image_url: image_url
  };
  if(artist_name) {
    newData.artist_name = artist_name
  }
  if(artist_id) {
    newData.artist_id = artist_id
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
  const new_user = JSON.parse(req.body)
  db.collection("users")
    .doc(new_user.uid)
    .set(new_user)
    .then(() => res.send(new_user))
    .catch((error) => res.send("Error", +error.message));
};
