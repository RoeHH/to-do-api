// create an express app
const express = require("express")
const app = express()
var lists = [];
// use the express-static middleware
app.use(express.static("public"))

// define the first route
app.get("/", function(req, res) {
    res.send("<h1>Hello World!</h1>")
})


//list to api
app.get('/lists', function(req, res) {
    res.json(lists);
});

// start the server listening for requests
app.listen(process.env.PORT || 3000,
    () => console.log("Server is running..."));