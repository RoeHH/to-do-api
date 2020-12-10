import dotenv from 'dotenv';
dotenv.config();

import { DbController } from './database';
import bodyParser from 'body-parser';

// create an express app
import { join } from 'path';
import express from "express";
const app = express();

// use the express-static middleware
app.use(express.static(join(__dirname, '/public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//list to api
app.get('/customers', async (req, res) => {
    const controller = await DbController.createDbController();
    const customers = await controller.getTodos();
    res.status(200).json(customers);
});

app.get('/name', async (req, res) => {
    const controller = await DbController.createDbController();
    const customer = await controller.getCustomerByName('Company Inc');
    res.status(200).json(customer);
});

app.post('/new-list', async (req, res) => {
    const list = req.body;
    console.log(list);
    const controller = await DbController.createDbController();
    controller.newList(list.listName);
    res.send('List is added to the database');
});

app.post('/new-task', async (req, res) => {
    const task = req.body;
    console.log(task);
    const controller = await DbController.createDbController();
    controller.insertTodo(task.listid, task.taskContent);
    res.send('List is added to the database');
});

app.get('/lists', async (req, res) => {
    const controller = await DbController.createDbController();
    const customers = await controller.getLists();
    res.status(200).json(customers);
});

// start the server listening for requestsy
app.listen(process.env.PORT || 3000, () =>
    console.log("Server is running on Port:" + process.env.PORT || 3000)
);