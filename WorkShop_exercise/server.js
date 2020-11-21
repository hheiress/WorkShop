const fs = require('fs');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

 function  getAlbumsFunction (req, res) {
     let albums = getAlbums();
     res.send(albums);
  };
  
  function  getAlbumByIdFunction (req, res) {
    // req.params.albumId will match the value in the url after /albums/
     let id = parseInt(req.params.albumId);
     let albums = getAlbums();
     console.log(req.params.albumId);
     // now we can use the value for req.params.albumId to find the album requested
     let album = albums.find(q => q.albumId == id);
     // how do we "find" something in an array
     // finish the code yourself - it should end with res.send(album) where album is the single album you found  based on the id
     res.send(album);
};

function postAlbumsFunction (req, res) {
    let rawdata = fs.readFileSync('albums.json');
     console.log("POST /albums route");
     let allAlbums = JSON.parse(rawdata);
     let newAlbum= req.body;
     console.log(newAlbum);
     newAlbum.albumId=allAlbums.length.toString();
     allAlbums.push(newAlbum);
     saveAlbums(allAlbums);
     res.send(newAlbum);
  }

function deleteAlbumsFunction (req, res) {
    console.log("Delete /albums route");
    const id = parseInt(req.params.albumId);
    let albums = getAlbums();
    const albumToDelete = albums.find(q =>q.albumId == id);
     if(albumToDelete){
         const index = albums.indexOf(albumToDelete);
         albums.splice(index, 1);
         res.send(albums);
     }
     else{
       res.send("Not found! TRY AGAIN")
     }
    saveAlbums(albums)
};
  // AUX FUNCTIONS
  const getAlbums = () => {
    let rawdata = fs.readFileSync('albums.json');
    return JSON.parse(rawdata);
};
 const saveAlbums = albums => {
    let data = JSON.stringify(albums);
    fs.writeFileSync('albums.json', data);
};
  // ENDPOINTS
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.get('/albums', getAlbumsFunction);
app.get('/albums/:albumId', getAlbumByIdFunction);
app.post('/albums', postAlbumsFunction);
app.delete('/albums/:albumId',deleteAlbumsFunction);

  app.listen(3000, () => {
    console.log("Server is listening on port 3000. Ready to accept requests!")
});