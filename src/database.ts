import { Collection, Db, MongoClient, ObjectId } from 'mongodb';
import { updateVariableDeclarationList } from 'typescript';
import { ListMode } from './enums/ListMode';

export class DbController {
  private dbo?: Db;
  private customers?: Collection;
  private list?: Collection;
  private client?: MongoClient;
  private task?: Collection;

  private constructor() {}

  public static createDbController(): DbController {
    const controller = new DbController();

    controller.client = new MongoClient(process.env.DB_CONNECTION_STRING || '');
    controller.client.connect().then(() => {
      controller.dbo = controller.client?.db();
      controller.list = controller.dbo?.collection('lists');
      controller.task = controller.dbo?.collection('tasks');
    });

    return controller;
  }

  public async getLists(listMode: ListMode): Promise<any[] | undefined> {
    let lists = await this.list?.find().toArray();
    if (!lists) return undefined; // If collection is empty
    for (const list of lists) {
      list.tasks = await this.task?.find({ listid: list._id }).toArray();
    }

    if (listMode === ListMode.archived)
      lists = lists.filter((list) => {
        for (const task of list.tasks) if (!task.done) return false;
        return true;
      });
    else if (listMode === ListMode.active)
      lists = lists.filter((list) => {
        for (const task of list.tasks) if (!task.done) return true;
      });
    return lists;
  }

  public async insertTodo(
    listid: number,
    taskContent: string /*, userId: ObjectId*/
  ): Promise<void> {
    this.task?.insertOne({
      taskContent,
      listid: new ObjectId(listid),
      done: false,
    });
  }

  public async newList(listName: string): Promise<void> {
    this.list?.insertOne(
      { listName, archived: false },
      function (err, docsInserted) {
        console.log(docsInserted);
      }
    );
  }

  public async updateTask(taskid: number, done: boolean): Promise<void> {
    this.task?.updateOne(
      { _id: new ObjectId(taskid) },
      {
        $set: { done },
      }
    );
  }
  public async updateList(listid: number, archived: boolean): Promise<void> {
    this.list?.updateOne(
      { _id: new ObjectId(listid) },
      {
        $set: { archived },
      }
    );
  }

  public async newListTask(
    listName: string,
    taskcontent: string
  ): Promise<void> {
    var listid;
    var wait = (ms: number) => new Promise((r, j) => setTimeout(r, ms));
    await this.list?.insertOne(
      { listName, archived: false },
      function (err, docsInserted) {
        if (err) return;
        console.log(docsInserted.insertedId);
        listid = docsInserted.insertedId;
      }
    );
    await wait(2000);
    if (listid !== undefined) {
      this.insertTodo(listid, taskcontent);
    }
  }

  public async deleteList(listid: number): Promise<void> {
    //delete the tasks in a list
    let tasks = await this.task?.find({ listid: new ObjectId(listid) }).toArray();
    if (tasks !== undefined) {
      for (const task of tasks) {
        this.deleteTask(task._id)
      }
    }
    //delete the list
    this.list?.deleteOne({
      _id: new ObjectId(listid),
    }, function (err, obj) {
      if (err) throw err;
      console.log("1 document deleted");
    });
  }
  public async deleteTask(taskid: number): Promise<void> {
    this.task?.deleteOne({
      _id: new ObjectId(taskid),
    }, function (err, obj) {
        if (err) throw err;
      console.log("1 document deleted");
    });
  }
}