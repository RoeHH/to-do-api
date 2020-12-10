import { Collection, Db, MongoClient, ObjectId } from 'mongodb';

export class DbController {
  private dbo?: Db;
  private customers?: Collection;
  private list?: Collection;
  private client?: MongoClient;
  private task?: Collection;

  private constructor() { }

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

  public async getLists(): Promise<any[] | undefined> {
    const lists = await this.list?.find().toArray();
    if (!lists) return undefined; // If collection is empty
    for (const list of lists) list.tasks = await this.task?.find({ listid: list._id }).toArray();
    return lists;
  }


  public async insertTodo(listid: number, taskContent: string /*, userId: ObjectId*/): Promise<void> {
    this.task?.insertOne({ taskContent, listid: new ObjectId(listid) });
  }

  public async newList(listName: string): Promise<void> {
    this.list?.insertOne({ listName, archived: false });
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
}