import dotenv from 'dotenv';
dotenv.config();

import { DbController } from './database';
const controller = DbController.createDbController();
import bodyParser from 'body-parser';

// create an express app
import { join } from 'path';
import express from 'express';
import { ListMode } from './enums/ListMode';
const app = express();

// use the express-static middleware
app.use(express.static(join(__dirname, '/public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/lists', async (req, res) => {
  const queryMode = req.query.mode;
  const listMode =
    queryMode === 'active'
      ? ListMode.active
      : queryMode === 'archived'
      ? ListMode.archived
      : ListMode.all;
  const customers = await controller.getLists(listMode);
  res.status(200).json(customers);
});

app.post('/new-list', async (req, res) => {
  const list = req.body;
  console.log(list);
  await controller.newList(list.listName);
  res.status(200).json({success: true})
});

app.post('/new-task', async (req, res) => {
  const task = req.body;
  console.log(task);
  await controller.insertTodo(task.listid, task.taskContent);
  res.status(200).json({success: true})
});

app.post('/update-task', async (req, res) => {
  const taskid = req.body.taskid;
  const done = Boolean(req.body.done);
  await controller.updateTask(taskid, done);
  res.status(200).json({success: true})
});

app.post('/update-list', async (req, res) => {
  const listid = req.body.listid;
  console.log(listid);
  const archived = Boolean(req.body.archived);
  console.log(req.body.archived);
  await controller.updateList(listid, archived);
  res.status(200).json({success: true})
});

// start the server listening for requestsy
app.listen(process.env.PORT || 3000, () =>
  console.log('Server is running on Port:' + process.env.PORT || 3000)
);
