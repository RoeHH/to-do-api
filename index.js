require("dotenv").config();
var MongoClient = require('mongodb').MongoClient;
var url = process.env.DB_CONNECTION_STRING;
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();
var port = 3000;
// Where we will keep lists
var lists = [];
app.use(cors());
// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//requires
//const { getLists } = require('./getLists.js');
//getLists
MongoClient.connect(url, function (err, db) {
    if (err)
        throw err;
    var dbo = db.db("mydb");
    var mysort = { name: 1 };
    dbo.collection("customers").find().sort(mysort).toArray(function (err, result) {
        if (err)
            throw err;
        lists = result;
        console.log(result);
        db.close();
    });
});
//list to api
app.get('/lists', function (req, res) {
    res.json(lists);
});
//lets the api run
app.listen(port, function () { return console.log("Hello world app listening on port " + port + "!"); });
