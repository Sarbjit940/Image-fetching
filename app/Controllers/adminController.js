const { resolve } = require('path');
const Response = require('../Middleware/response');
const request = require('request');
const { MongoClient } = require('mongodb');
let adminController = {}

adminController.imageFetech = async function (req, res) {
  try {
    if (!req || !req.query || !req.query.query) {
      return Response.sendErrorResponse(req, res, ['Please provide the data info'])
    }
    let query = req.query.query;
    let url = `https://api.unsplash.com/search/photos?page=1&query=${query}&client_id=${API_KEY}`;
    let options = {
      method: 'GET',
      url: url,
      json: true,
      headers: { 'Content-Type': 'application/json' }
    };
    let imageResult = await makeRequest(options);
    let images = [];
    for (imagesFetching of imageResult.results) {
      images.push({
        images_url: imagesFetching.urls
      });
    }
    //insert the image on mongoDb cloud
    await mongo(images[0].images_url.raw);
    Response.sendSuccessResponse(req, res, ['Data Successfully fetched'], images);
  } catch (error) {
    console.log("error=======>", error);
    return Response.sendErrorResponse(req, res, error);
  }
}

module.exports = adminController;

async function makeRequest(options) {
  return new Promise(function (resolve, reject) {
    console.log("options > ", options)
    request(options,
      function (error, response, body) {
        // console.log("error , body > ", error , body);
        if (error) {
          return reject(error);
        }
        return resolve(body);
      });
  });
}

async function mongo(image) {
  //mongodb connection
  const uri = DB_URL;
  const client = new MongoClient(uri, { useUnifiedTopology: true });
  try {
    await client.connect(function (err, db) {
      if (err) throw err;
      var dbo = db.db("images");
      var myobj = { imageurl: image };
      dbo.collection("imageUrl").insertOne(myobj, function (err, res) {
        if (err) throw err;
        console.log("Image is successfully added to mongodb cloud cluster");
      });
    });
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

// async function listDatabases(client){
//   databasesList = await client.db().admin().listDatabases();
//   databasesList.databases.forEach(db => console.log(` - ${db.name}`));
// };
