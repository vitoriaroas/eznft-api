const { app } = require('firebase-admin')
const admin = require('firebase-admin')
const { connectFirestore } = require('./firestore')

exports.addArtwork = (req, res) => {
     const {
          price,
          location,
          description,
          quantity,
          art_name,
          image_url,
          artist_name,
          artist_id,
     } = JSON.parse(req.body)
     if (
          !price ||
          !location ||
          !description ||
          !quantity ||
          !art_name ||
          !image_url
     ) {
          res.status(401).send('Invalid request')
     }
     const db = connectFirestore()
     let newData = {
          price: Number(price),
          location: location,
          description: description,
          quantity: Number(quantity),
          art_name: art_name,
          image_url: image_url,
     }
     if (artist_name) {
          newData.artist_name = artist_name
     }
     if (artist_id) {
          newData.artist_id = artist_id
     }
     db.collection('artwork')
          .add(newData)
          .then(() => this.getArtwork(req, res))
          .catch(error => res.send('Error', +error.message))
}

exports.getArtwork = (req, res) => {
     const db = connectFirestore()
     const { artId } = req.params
     db.collection('artwork')
          .doc(artId)
          .get()
          .then(doc => {
               let artist = doc.data()
               artist.id = doc.id
               res.send(artist)
          })
}

exports.getAllArtwork = (req, res) => {
     const db = connectFirestore()
     db.collection('artwork')
          .get()
          .then(collection => {
               const artists = collection.docs.map(doc => {
                    let artist = doc.data()
                    artist.id = doc.id
                    return artist
               })
               res.send(artists)
          })
}

exports.newUser = (req, res) => {
     const db = connectFirestore()
     const new_user = JSON.parse(req.body)
     db.collection('users')
          .doc(new_user.uid)
          .set(new_user)
          .then(() => res.send(new_user))
          .catch(error => res.send('Error', +error.message))
}

exports.buyArtwork = (req, res) => {
  const db = connectFirestore()
  const { artId, userId, nftId } = JSON.parse(req.body)
  console.log({ artId, userId, nftId })
  // get artwork by id
  db.collection('artwork')
  .doc(artId)
  .get()
  .then(doc => {
    let artwork = doc.data()
    artwork.id = doc.id
    artwork.nftId = nftId
    console.log('artwork --> ', artwork)
    // get user by id
    db.collection('users')
      .doc(userId)
      .get()
      .then(doc => {
        let user = doc.data()
        user.id = doc.id
        user.nftId = nftId
        console.log('user --> ', user)
        // add user to artwork's collection
        db.collection('artwork')
          .doc(artId)
          .update({
            buyers: admin.firestore.FieldValue.arrayUnion(user),
          })
          .then(() => {
               console.log('updated artwork')
            // add artwork to user's collection
            db.collection('users')
              .doc(userId)
              .update({
                artworks: admin.firestore.FieldValue.arrayUnion(artwork),
              })
              .then(() => {
                    console.log('updated user')
                   res.send(artwork)
               })
          })
      })
  })
  .catch(error => res.status(500).send('Error', + error.message))
}
