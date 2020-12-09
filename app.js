// create an express app
var express = require("express");
var app = express();
var lists = [];
// use the express-static middleware
app.use(express.static("public"));
// define the first route
app.get("/", function (req, res) {
    res.send("<h1>Hello World!</h1>");
});
//MongoDB stuf
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://iccee0:Mairs12R@cluster0.3htzt.mongodb.net/PROJECT 0?retryWrites=true&w=majority";
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
// start the server listening for requests
app.listen(process.env.PORT || 3000, function () { return console.log("Server is running on Port:" + process.env.PORT || 3000); });
