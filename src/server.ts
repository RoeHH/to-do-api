require("dotenv").config()
import { getTodos } from './database';

// create an express app
import { join } from 'path';
import express from "express";
const app = express();

// use the express-static middleware
app.use(express.static(join(__dirname, '/public')));

//list to api
app.get('/lists', async (req, res) => {
    const customers = await getTodos();
    res.status(200).json(customers);
});

// start the server listening for requestsy
app.listen(process.env.PORT || 3000, () =>
    console.log("Server is running on Port:" + process.env.PORT || 3000)
);