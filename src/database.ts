import { Collection, Db, MongoClient, ObjectId } from 'mongodb';

export class DbController {

    private dbo?: Db;
    private customers?: Collection
    private client?: MongoClient

    private constructor() { }

    public static async createDbController(): Promise<DbController> {
        const controller = new DbController();

        controller.client = new MongoClient(process.env.DB_CONNECTION_STRING || '');
        await controller.client.connect()
        controller.dbo = controller.client.db();
        controller.customers = controller.dbo.collection('customers');

        return controller;
    }

    public async getTodos(): Promise<any[] | undefined> {
        return this.customers?.find().toArray();
    }

    public async getCustomerByName(name: string) {
        return await this.customers?.findOne({ name });
    }

    public async insertTodo(name: string, address: string, userId: ObjectId): Promise<void> {
        this.customers?.insertOne({ name, address });
    }
}