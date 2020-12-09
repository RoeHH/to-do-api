import { Db, MongoClient } from 'mongodb';

export class DbController {

    private dbo?: Db;
    private client?: MongoClient

    private constructor() {}
    
    public static async createDbController(): Promise<DbController> {
        const controller = new DbController();

        controller.client = new MongoClient(process.env.DB_CONNECTION_STRING || '');
        await controller.client.connect()
        controller.dbo = controller.client.db();
        return controller;
    }

    public async getTodos(): Promise<any[] | undefined> {
        return this.dbo?.collection('customers').find().toArray();
    }
}