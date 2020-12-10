import { Collection, Db, MongoClient, ObjectId } from 'mongodb';

export class DbController {

    private dbo?: Db;
    private customers?: Collection
    private list?: Collection
    private client?: MongoClient
    private task?: Collection

    private constructor() { }

    public static async createDbController(): Promise<DbController> {
        const controller = new DbController();

        controller.client = new MongoClient(process.env.DB_CONNECTION_STRING || '');
        await controller.client.connect()
        controller.dbo = controller.client.db();
        controller.customers = controller.dbo.collection('customers');
        controller.list = controller.dbo.collection('lists');
        controller.task = controller.dbo.collection('tasks');


        return controller;
    }

    public async getTodos(): Promise<any[] | undefined> {
        return this.customers?.find().toArray();
    }

    public async getLists(): Promise<any[] | undefined> {
        const lists = await this.list?.find().toArray();
        if (!lists) return undefined; // If collection is empty
        for (const list of lists)
            list.tasks = await this.task?.find({ listid: list._id }).toArray();
        return lists;
    }

    public async getCustomerByName(name: string) {
        const customer = await this.customers?.findOne({ name }) as any;
        return customer._id;
    }

    public async insertTodo(listid: number, taskContent: string/*, userId: ObjectId*/): Promise<void> {
        this.task?.insertOne({ taskContent, listid: new ObjectId(listid) });
    }

    public async newList(listName: string): Promise<void> {
        this.list?.insertOne({ listName });
    }
}