const request = require('request');

request('https://to-do-list-api-blj.herokuapp.com/lists', { json: true }, (err, res, body) => {
    if (err) return console.log(err);
    //g = res.body[0];
    //console.log(g.name);
    console.log(body);
});