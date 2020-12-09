require("dotenv").config();
//MongoDB stuf
var MongoClient = require('mongodb').MongoClient;
var url = process.env.DB_CONNECTION_STRING;
// create an express app
const express = require("express");
const app = express();
var bodyParser = require('body-parser');
// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// use the express-static middleware
app.use(express.static("public"));
// define the first route
app.get("/", function(req, res) {
    res.send("<h1>Hello World!</h1>");
});
//getLists
MongoClient.connect(url, function(err, db) {
    if (err)
        throw err;
    var dbo = db.db("mydb");
    var mysort = { name: 1 };
    dbo.collection("customers").find().sort(mysort).toArray(function(err, result) {
        if (err)
            throw err;
        lists = result;
        console.log(result);
        db.close();
    });
});
//list to api
app.get('/lists', function(req, res) {
    res.json(result);
});
// start the server listening for requests
app.listen(process.env.PORT || 3000, function() { return console.log("Server is running on Port:" + process.env.PORT || 3000); });