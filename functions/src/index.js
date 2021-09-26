const { app } = require("firebase-admin");
const admin = require("firebase-admin");
const { connectFirestore } = require("./firestore");

exports.addArtwork = (req, res) => {
  const { price, location, description, quantity, art_name, image_url, artist_name, artist_id } = JSON.parse(req.body)
  if(!price || !location || !description || !quantity || !art_name || !image_url) {
      console.log('-----------------------')
      console.log(req.body)
      console.log(typeof req.body)
      console.log("price", !price)
      console.log("price --> ", price)
      console.log("location", !location)
      console.log("description", !description)
      console.log("quantity", !quantity)
      console.log("art_name", !art_name)
      console.log("image_url", !image_url)
      console.log('-----------------------')
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
  db.collection("users")
    .doc(req.body.uid)
    .set(req.body)
    .then(() => res.send(req.body))
    .catch((error) => res.send("Error", +error.message));
};
